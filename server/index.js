// LFCS Lab backend: spawns one Docker container per terminal session,
// bridges xterm.js (WebSocket) <-> `docker exec` PTY, and verifies
// exam tasks by running check scripts inside the container.
import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { WebSocketServer } from 'ws';
import Docker from 'dockerode';

import {
  examTaskBank, getExamTask, pickExamTasks, toClientTask, combinedSeed, DOMAINS,
} from './examTasks.js';
import { getModuleTasks, getModuleTask, moduleSeedScript } from './moduleTasks.js';

const PORT = Number(process.env.PORT || 3001);
const LAB_IMAGE = process.env.LFCS_LAB_IMAGE || 'lfcs-lab:latest';
const FALLBACK_IMAGE = 'ubuntu:22.04';
// Session container is killed this long after creation (ms)
const SESSION_TTL_MS = Number(process.env.LFCS_SESSION_TTL_MS || 3 * 60 * 60 * 1000);
const MAX_SESSIONS = Number(process.env.LFCS_MAX_SESSIONS || 10);
// Container network: 'none' (default, xavfsiz — tasklar tashqi internetga muhtoj emas)
// yoki 'bridge' kabi docker network nomi.
const CONTAINER_NETWORK = process.env.LFCS_CONTAINER_NETWORK || 'none';
const MAX_SESSIONS_PER_IP = Number(process.env.LFCS_MAX_SESSIONS_PER_IP || 3);
const MAX_CREATES_PER_HOUR_PER_IP = Number(process.env.LFCS_CREATES_PER_HOUR || 20);

const docker = new Docker();
const app = express();
app.use(cors());
app.use(express.json());

/** @type {Map<string, {container: import('dockerode').Container, createdAt: number, image: string, timer: NodeJS.Timeout, mode: string, moduleId: number|null, examTaskIds: number[]|null, ip: string}>} */
const sessions = new Map();

// Per-IP throttling (in-memory; enough for a single-node deployment)
/** @type {Map<string, number[]>} */
const createLog = new Map();

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function ipThrottled(ip) {
  const now = Date.now();
  const log = (createLog.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  createLog.set(ip, log);
  if (log.length >= MAX_CREATES_PER_HOUR_PER_IP) return 'Soatlik limit oshdi. Keyinroq urinib ko\'ring.';
  const active = [...sessions.values()].filter((s) => s.ip === ip).length;
  if (active >= MAX_SESSIONS_PER_IP) return `Bitta manzildan ko'pi bilan ${MAX_SESSIONS_PER_IP} ta aktiv sessiya mumkin.`;
  return null;
}

async function dockerAvailable() {
  try {
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}

async function imageExists(name) {
  try {
    await docker.getImage(name).inspect();
    return true;
  } catch {
    return false;
  }
}

async function execCollect(container, cmd, timeoutMs = 15000) {
  const exec = await container.exec({
    Cmd: ['bash', '-c', cmd],
    AttachStdout: true,
    AttachStderr: true,
  });
  const stream = await exec.start({});
  let output = '';
  const done = new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      stream.destroy();
      reject(new Error('exec timeout'));
    }, timeoutMs);
    stream.on('data', (chunk) => {
      // Strip docker multiplex header when present (8-byte frames)
      output += chunk.toString('utf8');
      if (output.length > 64 * 1024) output = output.slice(-64 * 1024);
    });
    stream.on('end', () => { clearTimeout(t); resolve(); });
    stream.on('error', (e) => { clearTimeout(t); reject(e); });
  });
  await done;
  const { ExitCode } = await exec.inspect();
  return { exitCode: ExitCode, output };
}

async function destroySession(id) {
  const s = sessions.get(id);
  if (!s) return;
  sessions.delete(id);
  clearTimeout(s.timer);
  try {
    await s.container.remove({ force: true });
  } catch {
    /* already gone */
  }
}

// ---------- REST API ----------

app.get('/api/health', async (_req, res) => {
  const ok = await dockerAvailable();
  res.json({
    ok: true,
    docker: ok,
    labImage: LAB_IMAGE,
    sessions: sessions.size,
  });
});

app.post('/api/sessions', async (req, res) => {
  if (!(await dockerAvailable())) {
    return res.status(503).json({ error: 'Docker daemon ishlamayapti. Docker Desktop yoki OrbStack-ni ishga tushiring.' });
  }
  if (sessions.size >= MAX_SESSIONS) {
    return res.status(429).json({ error: `Sessiyalar limiti (${MAX_SESSIONS}) to'lgan.` });
  }
  const ip = clientIp(req);
  const throttleMsg = ipThrottled(ip);
  if (throttleMsg) {
    return res.status(429).json({ error: throttleMsg });
  }

  const requestedMode = req.body?.mode;
  const mode = ['exam', 'module', 'playground'].includes(requestedMode) ? requestedMode : 'playground';
  const moduleId = Number(req.body?.moduleId) || null;

  if (mode === 'module' && !getModuleTasks(moduleId)) {
    return res.status(400).json({ error: `Modul ${moduleId} uchun amaliy tasklar topilmadi.` });
  }

  let image = LAB_IMAGE;
  if (!(await imageExists(image))) {
    if (await imageExists(FALLBACK_IMAGE)) {
      image = FALLBACK_IMAGE;
    } else {
      return res.status(503).json({
        error: `Lab image topilmadi. Avval build qiling: npm run lab:build (yoki docker pull ${FALLBACK_IMAGE})`,
      });
    }
  }

  // Exam: har domendan bittadan random task tanlanadi
  const examTasks = mode === 'exam' ? pickExamTasks() : null;

  const id = randomUUID();
  try {
    const container = await docker.createContainer({
      Image: image,
      name: `lfcs-session-${id.slice(0, 8)}`,
      Cmd: ['sleep', 'infinity'],
      Tty: false,
      HostConfig: {
        Memory: 512 * 1024 * 1024,
        NanoCpus: 1_000_000_000,
        PidsLimit: 256,
        CapAdd: ['NET_ADMIN'],
        AutoRemove: true,
        NetworkMode: CONTAINER_NETWORK,
      },
      Labels: { 'lfcs-lab': '1' },
    });
    await container.start();

    // Seed fixtures for graded modes
    const seedSrc = mode === 'exam' ? combinedSeed(examTasks)
      : mode === 'module' ? moduleSeedScript(moduleId)
      : '';
    if (seedSrc.trim()) {
      const seed = await execCollect(container, seedSrc, 60000);
      if (seed.exitCode !== 0) {
        await container.remove({ force: true });
        return res.status(500).json({ error: 'Seed script xatosi: ' + seed.output.slice(0, 500) });
      }
    }

    const timer = setTimeout(() => destroySession(id), SESSION_TTL_MS);
    sessions.set(id, {
      container, createdAt: Date.now(), image, timer, mode, moduleId, ip,
      examTaskIds: examTasks ? examTasks.map((t) => t.id) : null,
    });
    createLog.set(ip, [...(createLog.get(ip) || []), Date.now()]);
    res.json({
      sessionId: id, image, mode, moduleId, ttlMs: SESSION_TTL_MS,
      createdAt: Date.now(),
      examTasks: examTasks ? examTasks.map(toClientTask) : undefined,
    });
  } catch (e) {
    res.status(500).json({ error: 'Container yaratib bo\'lmadi: ' + e.message });
  }
});

// Session info — reconnect (F5) uchun
app.get('/api/sessions/:id', (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sessiya topilmadi yoki muddati tugagan.' });
  res.json({
    sessionId: req.params.id,
    mode: s.mode,
    moduleId: s.moduleId,
    createdAt: s.createdAt,
    expiresAt: s.createdAt + SESSION_TTL_MS,
    examTasks: s.examTaskIds ? s.examTaskIds.map((tid) => toClientTask(getExamTask(tid))) : undefined,
  });
});

app.delete('/api/sessions/:id', async (req, res) => {
  await destroySession(req.params.id);
  res.json({ ok: true });
});

app.get('/api/tasks', (_req, res) => {
  res.json(examTaskBank.map((t) => ({ id: t.id, domain: t.domain, title: t.title, checkCount: t.checks.length })));
});

// Module practical-test task list (checks/solutions are NOT exposed)
app.get('/api/module-tasks/:moduleId', (req, res) => {
  const tasks = getModuleTasks(req.params.moduleId);
  if (!tasks) return res.status(404).json({ error: 'Bu modul uchun amaliy tasklar yo\'q.' });
  res.json(tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    hint: t.hint,
    checkCount: t.checks.length,
  })));
});

// Reference solution — frontend gates this behind failed attempts
app.get('/api/module-tasks/:moduleId/:taskId/solution', (req, res) => {
  const task = getModuleTask(req.params.moduleId, req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task topilmadi.' });
  res.json({ solution: task.solution });
});

app.post('/api/sessions/:id/verify-module', async (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sessiya topilmadi yoki muddati tugagan.' });

  const task = getModuleTask(req.body?.moduleId, req.body?.taskId);
  if (!task) return res.status(400).json({ error: 'moduleId/taskId noto\'g\'ri.' });

  const results = [];
  for (const check of task.checks) {
    try {
      const { exitCode } = await execCollect(s.container, check.cmd, 10000);
      results.push({ name: check.name, passed: exitCode === 0 });
    } catch {
      results.push({ name: check.name, passed: false, error: 'timeout' });
    }
  }
  const passed = results.filter((r) => r.passed).length;
  res.json({
    taskId: task.id,
    passed,
    total: results.length,
    success: passed === results.length,
    results,
  });
});

async function runChecks(container, checks) {
  const results = [];
  for (const check of checks) {
    try {
      const { exitCode } = await execCollect(container, check.cmd, 10000);
      results.push({ name: check.name, passed: exitCode === 0 });
    } catch {
      results.push({ name: check.name, passed: false, error: 'timeout' });
    }
  }
  return results;
}

app.post('/api/sessions/:id/verify', async (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sessiya topilmadi yoki muddati tugagan.' });

  const task = getExamTask(req.body?.taskId);
  if (!task) return res.status(400).json({ error: 'taskId noto\'g\'ri.' });
  if (s.examTaskIds && !s.examTaskIds.includes(task.id)) {
    return res.status(400).json({ error: 'Bu task sizning imtihoningizga kirmagan.' });
  }

  const results = await runChecks(s.container, task.checks);
  const passed = results.filter((r) => r.passed).length;
  res.json({
    taskId: task.id,
    passed,
    total: results.length,
    success: passed === results.length,
    results,
  });
});

// Imtihonni yakunlash: barcha tanlangan tasklar birdan tekshiriladi,
// weighted ball (domain og'irligi bo'yicha) hisoblanadi. 66% = PASS.
app.post('/api/sessions/:id/finish-exam', async (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Sessiya topilmadi yoki muddati tugagan.' });
  if (!s.examTaskIds) return res.status(400).json({ error: 'Bu sessiya imtihon emas.' });

  const taskResults = [];
  for (const tid of s.examTaskIds) {
    const task = getExamTask(tid);
    const results = await runChecks(s.container, task.checks);
    const passedChecks = results.filter((r) => r.passed).length;
    const domain = DOMAINS.find((d) => d.key === task.domain);
    taskResults.push({
      taskId: task.id,
      title: task.title,
      domain: domain.label,
      weight: domain.weight,
      passedChecks,
      totalChecks: results.length,
      passed: passedChecks === results.length,
      results,
    });
  }

  const totalWeight = taskResults.reduce((a, t) => a + t.weight, 0);
  const score = taskResults.filter((t) => t.passed).reduce((a, t) => a + t.weight, 0);
  const percent = Math.round((score / totalWeight) * 100);

  res.json({
    score,
    totalWeight,
    percent,
    passed: percent >= 66,
    passLine: 66,
    tasks: taskResults,
  });
});

// ---------- WebSocket terminal ----------

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/api/terminal' });

wss.on('connection', async (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const sessionId = url.searchParams.get('session');
  const s = sessions.get(sessionId);
  if (!s) {
    ws.send(JSON.stringify({ type: 'error', message: 'Sessiya topilmadi.' }));
    ws.close();
    return;
  }

  let exec = null;
  let stream = null;
  // Messages can arrive before the container exec is ready — buffer them,
  // otherwise the user's first keystrokes are silently dropped.
  const pending = [];

  const handleMessage = (data, isBinary) => {
    // Control messages come as JSON text; keystrokes as text/binary
    if (!isBinary) {
      const text = data.toString();
      if (text.startsWith('{')) {
        try {
          const msg = JSON.parse(text);
          if (msg.type === 'resize' && exec) {
            exec.resize({ w: msg.cols, h: msg.rows }).catch(() => {});
            return;
          }
        } catch {
          /* fall through: treat as input */
        }
      }
      stream.write(text);
      return;
    }
    stream.write(data);
  };

  ws.on('message', (data, isBinary) => {
    if (!stream) {
      pending.push([data, isBinary]);
      return;
    }
    handleMessage(data, isBinary);
  });

  try {
    exec = await s.container.exec({
      Cmd: ['bash', '-l'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Env: ['TERM=xterm-256color'],
    });
    stream = await exec.start({ hijack: true, stdin: true, Tty: true });
  } catch (e) {
    ws.send(JSON.stringify({ type: 'error', message: 'Terminal ochilmadi: ' + e.message }));
    ws.close();
    return;
  }

  stream.on('data', (chunk) => {
    if (ws.readyState === ws.OPEN) ws.send(chunk);
  });
  stream.on('end', () => ws.close());
  stream.on('error', () => ws.close());

  for (const [data, isBinary] of pending) handleMessage(data, isBinary);
  pending.length = 0;

  ws.on('close', () => {
    try { stream.end(); } catch { /* noop */ }
  });
});

// ---------- Cleanup on exit ----------

async function shutdown() {
  const ids = [...sessions.keys()];
  await Promise.allSettled(ids.map((id) => destroySession(id)));
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(PORT, () => {
  console.log(`LFCS lab backend: http://localhost:${PORT}`);
  console.log(`Lab image: ${LAB_IMAGE} (fallback: ${FALLBACK_IMAGE})`);
});
