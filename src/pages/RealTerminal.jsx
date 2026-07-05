import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Terminal as XTerminal, Play, Square, RotateCcw, AlertTriangle,
  Loader2, Container, Globe
} from 'lucide-react';

import { Terminal as Xterm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

// v86 wasm/main lib — bundled via npm
import { V86 } from 'v86';
import v86WasmUrl from 'v86/build/v86.wasm?url';

import DockerTerminal from '../components/Terminal/DockerTerminal';

// Public asset URLs (see IMAGES.md).
// Both routes proxy to copy.sh (through Vite/Vercel/Nginx) — the upstream
// doesn't set CORS headers and i.copy.sh has hotlink protection so a
// direct browser fetch is blocked.
// Users may drop matching files into /public/v86/ to override the CDN.
const BIOS_BASE = '/v86-cdn';
const IMAGE_BASE = '/v86-img';
const LOCAL_BASE = '/v86';

async function isBinaryAt(url) {
  // Vite dev server SPA fallback returns 200 + text/html for missing paths.
  // A real binary asset must NOT have an HTML content-type.
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) return false;
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('text/html')) return false;
    return true;
  } catch {
    return false;
  }
}

async function resolveAsset(cdnBase, localPath, remoteName, sizeHint) {
  const local = `${LOCAL_BASE}/${localPath}`;
  const ok = await isBinaryAt(local);
  const url = ok ? local : `${cdnBase}/${remoteName}`;
  return sizeHint ? { url, async: true, size: sizeHint } : { url };
}

const resolveBios = (name) => resolveAsset(BIOS_BASE, `bios/${name}`, `bios/${name}`);
const resolveImage = (name, size) => resolveAsset(IMAGE_BASE, `images/${name}`, name, size);

// ---------- Docker playground (backend + container per session) ----------

function DockerPlayground() {
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | error
  const [error, setError] = useState(null);
  const sessionRef = useRef(null);
  sessionRef.current = sessionId;

  useEffect(() => () => {
    if (sessionRef.current) {
      fetch(`/api/sessions/${sessionRef.current}`, { method: 'DELETE' }).catch(() => {});
    }
  }, []);

  const start = useCallback(async () => {
    setStatus('starting');
    setError(null);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'playground' }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || res.statusText);
      setSessionId(body.sessionId);
      setStatus('running');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, []);

  const stop = useCallback(() => {
    if (sessionId) {
      fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' }).catch(() => {});
    }
    setSessionId(null);
    setStatus('idle');
  }, [sessionId]);

  return (
    <div>
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Container className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-slate-300 space-y-1">
            <p className="font-medium text-emerald-400">Docker rejimi — to'liq Ubuntu 22.04 muhiti</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Har sessiya uchun alohida container — xohlagancha buzing, hech narsa buzilmaydi.</li>
              <li><code className="text-emerald-400">useradd, chage, crontab, ip, iptables, mkfs.ext4, vim</code> — hammasi bor.</li>
              <li>Talab: backend (<code className="text-emerald-400">npm run dev:full</code>) va Docker daemon.</li>
              <li>Container yopilganda yoki sahifadan chiqilganda o'chiriladi.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {status !== 'running' && (
          <button
            onClick={start}
            disabled={status === 'starting'}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {status === 'starting' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {status === 'starting' ? 'Ochilmoqda...' : 'Container ochish'}
          </button>
        )}
        {status === 'running' && (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Square size={16} />
            To'xtatish
          </button>
        )}
        <div className="ml-auto text-xs text-slate-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            status === 'running' ? 'bg-green-400 animate-pulse' :
            status === 'starting' ? 'bg-yellow-400 animate-pulse' :
            status === 'error' ? 'bg-red-400' : 'bg-slate-500'
          }`} />
          <span className="font-mono">{status}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-red-400 mb-1">Container ochilmadi</p>
              <p className="text-sm text-slate-300 font-mono break-all">{error}</p>
              <p className="text-xs text-slate-500 mt-2">
                Backend: <code className="text-emerald-400">npm run server</code>,
                lab image: <code className="text-emerald-400">npm run lab:build</code>.
                Backend bo'lmasa v86 rejimidan foydalaning.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'running' && sessionId && (
        <DockerTerminal sessionId={sessionId} />
      )}

      {status === 'idle' && (
        <div className="bg-[#0d1117] border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm" style={{ height: '300px' }}>
          "Container ochish" tugmasini bosing
        </div>
      )}
    </div>
  );
}

// ---------- v86 in-browser VM ----------

function V86Terminal() {
  const containerRef = useRef(null);
  const emulatorRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle | loading | running | stopped | error
  const [progress, setProgress] = useState({ loaded: 0, total: 0, file: '' });
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState('Terminalni ishga tushirish uchun "Boshlash" tugmasini bosing');

  const disposeEmulator = useCallback(() => {
    try {
      emulatorRef.current?.destroy?.();
    } catch {
      /* noop */
    }
    emulatorRef.current = null;
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  }, []);

  useEffect(() => () => disposeEmulator(), [disposeEmulator]);

  const startEmulator = useCallback(async () => {
    setError(null);
    setStatus('loading');
    setStatusMsg('Boot fayllar hozirlanmoqda...');

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      const [bios, vgaBios, bzimage] = await Promise.all([
        resolveBios('seabios.bin'),
        resolveBios('vgabios.bin'),
        // Buildroot Linux — BusyBox + Lua + curl (~5 MB)
        resolveImage('buildroot-bzimage.bin', 5166352),
      ]).catch((e) => { throw new Error('Image URL resolve failed: ' + e.message); });

      setProgress({ loaded: 0, total: 100, file: 'buildroot-bzimage.bin' });
      setStatusMsg('Kernel yuklanmoqda...');

      const emulator = new V86({
        wasm_path: v86WasmUrl,
        memory_size: 128 * 1024 * 1024,
        vga_memory_size: 2 * 1024 * 1024,
        bios,
        vga_bios: vgaBios,
        bzimage,
        cmdline: 'tsc=reliable mitigations=off random.trust_cpu=on',
        autostart: true,
        disable_speaker: true,
        // v86 creates the xterm.js instance inside `container` and pipes it
        // to the guest's serial0 (ttyS0).
        serial_console: {
          type: 'xtermjs',
          xterm_lib: Xterm,
          container: containerRef.current,
        },
      });

      emulator.add_listener('download-progress', (e) => {
        setProgress({
          loaded: e.loaded || 0,
          total: e.total || 0,
          file: e.file_name || '',
        });
        if (e.total > 0) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setStatusMsg(`Yuklanmoqda: ${e.file_name} (${pct}%)`);
        }
      });

      emulator.add_listener('emulator-ready', () => {
        setStatusMsg('Emulator tayyor, boot boshlanmoqda...');
      });

      emulator.add_listener('emulator-started', () => {
        setStatus('running');
        setStatusMsg('Ishlamoqda — terminal ichiga bosing va buyruq yozing');
      });

      emulator.add_listener('emulator-stopped', () => {
        setStatus('stopped');
        setStatusMsg('Emulator to\'xtatildi');
      });

      emulator.add_listener('download-error', (e) => {
        setError(`Yuklashda xatolik: ${e?.file_name || 'noma\'lum fayl'}. CDN mavjud emas yoki CORS bloklandi.`);
        setStatus('error');
      });

      emulatorRef.current = emulator;
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
      setStatus('error');
    }
  }, []);

  const stopEmulator = useCallback(() => {
    try {
      emulatorRef.current?.stop?.();
    } catch { /* noop */ }
    setStatus('stopped');
    setStatusMsg('Emulator to\'xtatildi');
  }, []);

  const restartEmulator = useCallback(() => {
    try {
      emulatorRef.current?.restart?.();
      setStatus('running');
      setStatusMsg('Qayta yuklandi');
    } catch { /* noop */ }
  }, []);

  const resetTerminal = useCallback(() => {
    disposeEmulator();
    setStatus('idle');
    setStatusMsg('Terminalni ishga tushirish uchun "Boshlash" tugmasini bosing');
    setError(null);
  }, [disposeEmulator]);

  const percent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
  const running = status === 'running';
  const loading = status === 'loading';

  return (
    <div>
      {/* Warning banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-slate-300 space-y-1">
            <p className="font-medium text-amber-400">Muhim eslatmalar:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Bu Buildroot Linux (BusyBox + Lua + curl) — <code className="text-emerald-400">ls, cat, grep, find, tar, useradd, ip, mount</code> va h.k. ishlaydi.</li>
              <li><code className="text-emerald-400">systemctl</code>, <code className="text-emerald-400">apt</code>, <code className="text-emerald-400">yum</code> yo'q — BusyBox init'da <code className="text-emerald-400">/etc/init.d</code> ishlatiladi.</li>
              <li>Barcha o'zgarishlar RAM'da — sahifa yopilgach yo'qoladi.</li>
              <li>Birinchi yuklash ~5 MB (CDN'dan, faqat bir marta).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {!running && !loading && (
          <button
            onClick={startEmulator}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Play size={16} />
            Boshlash
          </button>
        )}
        {running && (
          <>
            <button
              onClick={stopEmulator}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Square size={16} />
              To'xtatish
            </button>
            <button
              onClick={restartEmulator}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw size={16} />
              Qayta yuklash
            </button>
          </>
        )}
        {(status === 'stopped' || status === 'error') && (
          <button
            onClick={resetTerminal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        )}

        <div className="ml-auto text-xs text-slate-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            running ? 'bg-green-400 animate-pulse' :
            loading ? 'bg-yellow-400 animate-pulse' :
            status === 'error' ? 'bg-red-400' :
            'bg-slate-500'
          }`} />
          <span className="font-mono">{status}</span>
        </div>
      </div>

      {/* Progress bar */}
      {loading && progress.total > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="truncate flex-1 mr-2">{progress.file || 'Fayl yuklanmoqda...'}</span>
            <span className="font-mono">{percent}%</span>
          </div>
          <div className="progress-bar h-2">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {/* Status message */}
      {statusMsg && (
        <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
          {loading && <Loader2 size={12} className="animate-spin" />}
          {statusMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-red-400 mb-1">Xatolik</p>
              <p className="text-sm text-slate-300 font-mono break-all">{error}</p>
              <p className="text-xs text-slate-500 mt-2">
                Agar CDN ishlamayotgan bo'lsa, <code>public/v86/</code> ichiga image fayllarini o'zingiz joylashtiring (qarang: IMAGES.md).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Terminal */}
      <div className="bg-[#0d1117] border border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-slate-400 font-mono">buildroot@lfcs — ttyS0</span>
        </div>
        <div
          ref={containerRef}
          onClick={() => containerRef.current?.querySelector('.xterm-helper-textarea')?.focus()}
          className="w-full cursor-text"
          style={{ minHeight: '520px', padding: '8px' }}
        />
      </div>

      {/* Help */}
      <div className="mt-4 text-xs text-slate-500">
        Maslahat: shellga <code className="text-emerald-400">ls /bin</code> yozib mavjud buyruqlarni ko'ring.
        Login <code className="text-emerald-400">root</code> (parolsiz).
      </div>
    </div>
  );
}

// ---------- Page with mode switch ----------

export default function RealTerminal() {
  const [mode, setMode] = useState('docker'); // docker | v86
  const [backendUp, setBackendUp] = useState(null); // null = checking

  useEffect(() => {
    let cancelled = false;
    const markDown = () => {
      if (cancelled) return;
      setBackendUp(false);
      // Backend is down — fall back to v86 so the page still works
      setMode('v86');
    };
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.docker) setBackendUp(true);
        else markDown();
      })
      .catch(markDown);
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <XTerminal size={28} className="text-emerald-400" />
          Real Linux Terminal
        </h1>
        <p className="text-slate-400 text-sm">
          Buyruqlarni haqiqiy Linux muhitida sinab ko'ring — Docker container (to'liq Ubuntu)
          yoki brauzerda ishlaydigan v86 VM.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setMode('docker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'docker'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Container size={16} />
          Docker
          {backendUp === true && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
          {backendUp === false && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
        </button>
        <button
          onClick={() => setMode('v86')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'v86'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Globe size={16} />
          v86 (brauzer)
        </button>
      </div>

      {mode === 'docker' ? <DockerPlayground /> : <V86Terminal />}
    </div>
  );
}
