import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Clock, AlertTriangle, Play, CheckCircle2, XCircle,
  ArrowLeft, Eye, EyeOff, RotateCcw, Trophy,
  Timer, Target, Zap, Terminal as TerminalIcon, Loader2,
  ChevronDown, ChevronUp, ShieldCheck, Flag, History, LayoutDashboard
} from 'lucide-react';
import CodeBlock from '../components/CodeBlock/CodeBlock';
import DockerTerminal from '../components/Terminal/DockerTerminal';
import { useProgress } from '../context/ProgressContext';
import { fallbackExamTasks } from '../data/examFallback';

const EXAM_DURATION = 120 * 60; // seconds
const PASS_LINE = 66;
const STATE_KEY = 'lfcs-exam-state';
const HISTORY_KEY = 'lfcs-exam-history';

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function formatClock(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} daqiqa`;
  return `${Math.floor(mins / 60)} soat ${mins % 60} daqiqa`;
}

// ---------- Attempt history graph (last 5) ----------

function AttemptHistory({ history }) {
  if (!history.length) return null;
  const last = history.slice(-5);
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
        <History size={15} />
        Oxirgi urinishlar ({history.length} ta jami)
      </div>
      <div className="flex items-end gap-3 h-28">
        {last.map((h, idx) => {
          const color = h.percent >= PASS_LINE ? 'bg-green-500' : h.percent >= 40 ? 'bg-yellow-500' : 'bg-red-500';
          const d = new Date(h.at);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-xs font-mono text-slate-300">{h.percent}%</span>
              <div
                className={`w-full max-w-[48px] rounded-t ${color} opacity-80`}
                style={{ height: `${Math.max(4, h.percent * 0.7)}%` }}
                title={`${d.toLocaleDateString()} — ${h.percent}%${h.manual ? ' (manual)' : ''}`}
              />
              <span className="text-[10px] text-slate-500">
                {String(d.getDate()).padStart(2, '0')}.{String(d.getMonth() + 1).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
      {/* pass line legend */}
      <div className="mt-2 text-[11px] text-slate-500">
        O'tish chizig'i: {PASS_LINE}% · yashil = PASS
      </div>
    </div>
  );
}

// ---------- Single task card ----------

function ExamTask({ task, index, verifyState, onVerify, verifying, sessionActive, manualMode, manualDone, onToggleManual }) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showChecks, setShowChecks] = useState(true);

  const completed = verifyState?.success || (manualMode && manualDone);

  return (
    <div className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-all ${
      completed ? 'border-green-500/50' : 'border-slate-700'
    }`}>
      <div className="p-4 border-b border-slate-700 bg-slate-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              completed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-white">{task.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-slate-700 rounded">{task.domain}</span>
                <span>Weight: {task.weight}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {task.timeLimit} min
                </span>
              </div>
            </div>
          </div>
          {completed && <CheckCircle2 size={24} className="text-green-400" />}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
          <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">{task.description}</pre>
        </div>

        <div className="mb-3">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Zap size={16} />
            {showHints ? 'Hintlarni yashirish' : `Hintlar ko'rish (${task.hints.length})`}
          </button>
          {showHints && (
            <ul className="mt-2 space-y-1 pl-6">
              {task.hints.map((hint, idx) => (
                <li key={idx} className="text-sm text-slate-400 list-disc">{hint}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
          >
            {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSolution ? 'Yechimni yashirish' : "Yechimni ko'rish"}
          </button>
          {showSolution && (
            <div className="mt-3">
              <CodeBlock code={task.solution} language="bash" title="Solution" />
              <p className="mt-2 text-xs text-slate-500">
                <strong>Verification:</strong> <code className="text-green-400">{task.verification}</code>
              </p>
            </div>
          )}
        </div>

        {verifyState && (
          <div className="mb-4 bg-slate-900/50 border border-slate-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowChecks(!showChecks)}
              className="w-full px-4 py-2 flex items-center justify-between text-sm"
            >
              <span className={`flex items-center gap-2 font-medium ${
                verifyState.success ? 'text-green-400' : 'text-amber-400'
              }`}>
                <ShieldCheck size={16} />
                Tekshiruv: {verifyState.passed}/{verifyState.total} o'tdi
              </span>
              {showChecks ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            {showChecks && (
              <ul className="px-4 pb-3 space-y-1.5">
                {verifyState.results.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {r.passed ? (
                      <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={r.passed ? 'text-slate-300' : 'text-slate-400'}>{r.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-700 flex items-center gap-3">
          {sessionActive ? (
            <button
              onClick={() => onVerify(task.id)}
              disabled={verifying !== null}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                verifyState?.success
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
              }`}
            >
              {verifying === task.id ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : verifyState?.success ? (
                <>
                  <CheckCircle2 size={16} />
                  Tasdiqlandi — qayta tekshirish
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Terminalda tekshirish
                </>
              )}
            </button>
          ) : manualMode ? (
            <button
              onClick={() => onToggleManual(task.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                manualDone
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {manualDone ? 'Tugallandi ✓' : 'Tugallangan deb belgilash (manual)'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------

export default function Exam() {
  const { completeExamAttempt } = useProgress();

  const [phase, setPhase] = useState('loading'); // loading | intro | active | finishing | result
  const [tasks, setTasks] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('none'); // none | starting | active | error
  const [sessionError, setSessionError] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualDone, setManualDone] = useState({});
  const [startedAt, setStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [verifyResults, setVerifyResults] = useState({});
  const [verifying, setVerifying] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);
  const [result, setResult] = useState(null);
  const [reconnectNotice, setReconnectNotice] = useState(null);
  const [history, setHistory] = useState(() => loadJSON(HISTORY_KEY, []));

  const sessionRef = useRef(null);
  sessionRef.current = sessionId;
  const finishedRef = useRef(false);

  const remaining = startedAt
    ? Math.max(0, EXAM_DURATION - Math.floor((now - startedAt) / 1000))
    : EXAM_DURATION;

  // ---- Reconnect on mount ----
  useEffect(() => {
    const saved = loadJSON(STATE_KEY, null);
    if (!saved?.startedAt) {
      setPhase('intro');
      return;
    }
    const expired = Date.now() - saved.startedAt >= EXAM_DURATION * 1000;
    if (saved.manualMode) {
      if (expired) {
        localStorage.removeItem(STATE_KEY);
        setReconnectNotice("Oldingi imtihon vaqti tugagan edi — natijasiz yakunlandi.");
        setPhase('intro');
        return;
      }
      setTasks(saved.tasks);
      setManualMode(true);
      setManualDone(saved.manualDone || {});
      setStartedAt(saved.startedAt);
      setVerifyResults({});
      setSessionStatus('error');
      setPhase('active');
      return;
    }
    // Docker session: tekshirib qayta ulanamiz
    api(`/api/sessions/${saved.sessionId}`)
      .then((info) => {
        setTasks(info.examTasks || saved.tasks);
        setSessionId(saved.sessionId);
        setSessionStatus('active');
        setStartedAt(saved.startedAt);
        setVerifyResults(saved.verifyResults || {});
        setPhase('active');
        setReconnectNotice(null);
      })
      .catch(() => {
        localStorage.removeItem(STATE_KEY);
        setReconnectNotice("Oldingi imtihon sessiyasi topilmadi (muddati tugagan yoki server qayta ishga tushgan). Yangi imtihon boshlang.");
        setPhase('intro');
      });
  }, []);

  // ---- Persist state while active ----
  useEffect(() => {
    if (phase !== 'active' || !startedAt) return;
    localStorage.setItem(STATE_KEY, JSON.stringify({
      sessionId, startedAt, tasks, verifyResults, manualMode, manualDone,
    }));
  }, [phase, sessionId, startedAt, tasks, verifyResults, manualMode, manualDone]);

  // ---- Timer tick ----
  useEffect(() => {
    if (phase !== 'active') return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // ---- Start ----
  const startExam = useCallback(async () => {
    setSessionStatus('starting');
    setSessionError(null);
    setReconnectNotice(null);
    finishedRef.current = false;
    try {
      const resp = await api('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ mode: 'exam' }),
      });
      setTasks(resp.examTasks);
      setSessionId(resp.sessionId);
      setSessionStatus('active');
      setManualMode(false);
    } catch (e) {
      // Backend yo'q — manual rejim (fallback tasklar, o'z-o'zini baholash)
      setSessionError(e.message);
      setSessionStatus('error');
      setTasks(fallbackExamTasks);
      setManualMode(true);
      setManualDone({});
    }
    setVerifyResults({});
    setStartedAt(Date.now());
    setNow(Date.now());
    setPhase('active');
  }, []);

  // ---- Finish ----
  const finishExam = useCallback(async (auto = false) => {
    if (finishedRef.current) return;
    if (!auto && !window.confirm("Imtihonni tugatasizmi? Barcha tasklar tekshirilib, yakuniy natija chiqariladi.")) {
      return;
    }
    finishedRef.current = true;
    const durationSec = Math.min(EXAM_DURATION, Math.floor((Date.now() - startedAt) / 1000));
    let finalResult;

    if (manualMode) {
      const taskResults = tasks.map((t) => ({
        taskId: t.id,
        title: t.title,
        domain: t.domain,
        weight: t.weightValue,
        passed: Boolean(manualDone[t.id]),
        passedChecks: manualDone[t.id] ? 1 : 0,
        totalChecks: 1,
        results: [],
      }));
      const totalWeight = taskResults.reduce((a, t) => a + t.weight, 0);
      const score = taskResults.filter((t) => t.passed).reduce((a, t) => a + t.weight, 0);
      const percent = Math.round((score / totalWeight) * 100);
      finalResult = { score, totalWeight, percent, passed: percent >= PASS_LINE, passLine: PASS_LINE, tasks: taskResults, manual: true };
    } else {
      setPhase('finishing');
      try {
        finalResult = await api(`/api/sessions/${sessionId}/finish-exam`, { method: 'POST' });
      } catch (e) {
        // Server yakunlay olmadi — mavjud verify natijalaridan hisoblaymiz
        const taskResults = tasks.map((t) => {
          const v = verifyResults[t.id];
          return {
            taskId: t.id, title: t.title, domain: t.domain, weight: t.weightValue,
            passed: Boolean(v?.success), passedChecks: v?.passed || 0, totalChecks: v?.total || t.checkCount || 1,
            results: v?.results || [],
          };
        });
        const totalWeight = taskResults.reduce((a, t) => a + t.weight, 0);
        const score = taskResults.filter((t) => t.passed).reduce((a, t) => a + t.weight, 0);
        const percent = Math.round((score / totalWeight) * 100);
        finalResult = {
          score, totalWeight, percent, passed: percent >= PASS_LINE, passLine: PASS_LINE,
          tasks: taskResults, offline: true, error: e.message,
        };
      }
      // Container endi kerak emas
      if (sessionId) fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' }).catch(() => {});
    }

    finalResult.durationSec = durationSec;
    finalResult.autoFinished = auto;

    const entry = {
      at: Date.now(),
      percent: finalResult.percent,
      passed: finalResult.passed,
      durationSec,
      manual: Boolean(finalResult.manual),
    };
    const newHistory = [...loadJSON(HISTORY_KEY, []), entry].slice(-20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
    completeExamAttempt(finalResult.percent);

    localStorage.removeItem(STATE_KEY);
    setSessionId(null);
    setSessionStatus('none');
    setResult(finalResult);
    setPhase('result');
  }, [startedAt, manualMode, manualDone, tasks, sessionId, verifyResults, completeExamAttempt]);

  // ---- Auto-finish when timer hits 0 ----
  useEffect(() => {
    if (phase === 'active' && startedAt && remaining <= 0 && !finishedRef.current) {
      finishExam(true);
    }
  }, [phase, remaining, startedAt, finishExam]);

  // ---- Verify one task ----
  const handleVerify = useCallback(async (taskId) => {
    if (!sessionId) return;
    setVerifying(taskId);
    try {
      const r = await api(`/api/sessions/${sessionId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      });
      setVerifyResults((prev) => ({ ...prev, [taskId]: r }));
    } catch (e) {
      setVerifyResults((prev) => ({
        ...prev,
        [taskId]: { passed: 0, total: 1, success: false, results: [{ name: `Xatolik: ${e.message}`, passed: false }] },
      }));
    } finally {
      setVerifying(null);
    }
  }, [sessionId]);

  // ---- Abandon (restart without result) ----
  const abandonExam = useCallback(() => {
    if (!window.confirm("Imtihonni natijasiz to'xtatasizmi? Container o'chiriladi.")) return;
    if (sessionId) fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' }).catch(() => {});
    localStorage.removeItem(STATE_KEY);
    finishedRef.current = false;
    setSessionId(null);
    setSessionStatus('none');
    setTasks(null);
    setStartedAt(null);
    setVerifyResults({});
    setManualMode(false);
    setManualDone({});
    setResult(null);
    setPhase('intro');
  }, [sessionId]);

  const verifiedCount = tasks ? tasks.filter((t) => verifyResults[t.id]?.success || (manualMode && manualDone[t.id])).length : 0;

  // ================= RENDER =================

  if (phase === 'loading') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px] text-slate-400 gap-3">
        <Loader2 size={20} className="animate-spin" /> Sessiya tekshirilmoqda...
      </div>
    );
  }

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <div className="p-6 max-w-4xl mx-auto fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
              <Award size={32} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">LFCS Practice Exam</h1>
              <p className="text-slate-400">Linux Foundation Certified System Administrator</p>
            </div>
          </div>

          {reconnectNotice && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 text-sm text-yellow-300 flex items-start gap-2">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              {reconnectNotice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={16} />
                <span className="text-sm">Vaqt</span>
              </div>
              <div className="text-2xl font-bold text-white">2 soat</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Target size={16} />
                <span className="text-sm">Tasklar</span>
              </div>
              <div className="text-2xl font-bold text-white">6 ta</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Trophy size={16} />
                <span className="text-sm">O'tish bali</span>
              </div>
              <div className="text-2xl font-bold text-white">{PASS_LINE}%</div>
            </div>
          </div>

          <AttemptHistory history={history} />

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <TerminalIcon className="text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-emerald-400 mb-1">Real Terminal bilan imtihon</h4>
                <p className="text-sm text-slate-300">
                  Har imtihonda 6 domendan bittadan <strong>random task</strong> tanlanadi — har urinish boshqacha.
                  Alohida Docker container ochiladi, tasklarni terminalda bajarasiz.
                  "Imtihonni tugatish" bosilganda (yoki vaqt tugaganda) barcha tasklar
                  birdan tekshirilib, weighted ball chiqariladi.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Sahifa yangilansa ham imtihon davom etadi — sessiya va timer saqlanadi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-red-400 mb-1">Muhim!</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Timer boshlangandan keyin to'xtamaydi — vaqt tugasa avtomatik yakunlanadi</li>
                  <li>• Oraliq "Tekshirish" ixtiyoriy — yakuniy ball faqat tugatishda hisoblanadi</li>
                  <li>• O'tish bali: {PASS_LINE}% (weighted — har task o'z domeni vazniga ega)</li>
                  <li>• Yechimlarni faqat o'zingiz urinib ko'rgandan keyin oching</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            disabled={sessionStatus === 'starting'}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
          >
            {sessionStatus === 'starting' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Imtihon muhiti tayyorlanmoqda...
              </>
            ) : (
              <>
                <Play size={20} />
                Imtihonni boshlash
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Finishing ----------
  if (phase === 'finishing') {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-slate-300 gap-4">
        <Loader2 size={32} className="animate-spin text-amber-400" />
        <p className="font-medium">Barcha tasklar tekshirilmoqda...</p>
        <p className="text-sm text-slate-500">Har bir task mezonlari container ichida baholanadi</p>
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === 'result' && result) {
    return (
      <div className="p-6 max-w-4xl mx-auto fade-in">
        <div className={`border rounded-2xl p-8 text-center mb-6 ${
          result.passed
            ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/40'
            : 'bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/40'
        }`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Trophy size={40} className={result.passed ? 'text-green-400' : 'text-red-400'} />
          </div>

          <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-3 ${
            result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {result.passed ? 'PASS' : 'FAIL'}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {result.passed ? "Tabriklaymiz — imtihondan o'tdingiz!" : "Bu safar yetmadi — davom eting!"}
          </h1>

          <div className={`text-6xl font-bold my-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
            {result.percent}%
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-2 flex-wrap">
            <span>Ball: <strong className="text-white">{result.score}/{result.totalWeight}</strong> (weighted)</span>
            <span>O'tish chizig'i: <strong className="text-white">{result.passLine || PASS_LINE}%</strong></span>
            <span className="flex items-center gap-1">
              <Timer size={14} />
              Sarflangan vaqt: <strong className="text-white">{formatDuration(result.durationSec)}</strong>
            </span>
          </div>
          {result.autoFinished && (
            <p className="text-xs text-yellow-400">Vaqt tugagani uchun avtomatik yakunlandi</p>
          )}
          {result.manual && (
            <p className="text-xs text-slate-500">Natija manual belgilashga asoslangan (terminal tekshiruvisiz)</p>
          )}
          {result.offline && (
            <p className="text-xs text-yellow-400">Server yakunlay olmadi — oxirgi tekshiruv natijalaridan hisoblandi</p>
          )}

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => { setResult(null); setPhase('intro'); finishedRef.current = false; }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw size={17} />
              Qayta topshirish
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Domain breakdown */}
        <h2 className="text-lg font-semibold text-white mb-3">Domain bo'yicha natijalar</h2>
        <div className="space-y-3 mb-8">
          {result.tasks.map((t) => (
            <div key={t.taskId} className={`bg-slate-800/50 border rounded-xl p-4 ${
              t.passed ? 'border-green-500/30' : 'border-red-500/30'
            }`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  {t.passed ? (
                    <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-white">{t.title}</div>
                    <div className="text-xs text-slate-500">{t.domain}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">{t.passedChecks}/{t.totalChecks} mezon</span>
                  <span className={`font-bold ${t.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {t.passed ? `+${t.weight}` : '0'}/{t.weight} ball
                  </span>
                </div>
              </div>
              {!t.passed && t.results?.length > 0 && (
                <ul className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                  {t.results.filter((r) => !r.passed).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                      <XCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                      {r.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <AttemptHistory history={history} />
      </div>
    );
  }

  // ---------- Active exam ----------
  return (
    <div className="p-6 max-w-[1400px] mx-auto fade-in">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-slate-950/95 backdrop-blur-sm -mx-6 px-6 py-3 mb-6 border-b border-slate-800">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Award size={22} className="text-amber-400" />
            <div>
              <h1 className="font-bold text-white text-sm">LFCS Practice Exam</h1>
              <p className="text-xs text-slate-400">{verifiedCount}/{tasks?.length || 0} task tasdiqlandi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              sessionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
              sessionStatus === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-slate-800 text-slate-400'
            }`}>
              <TerminalIcon size={14} />
              {sessionStatus === 'active' ? 'Container aktiv' :
               manualMode ? 'Manual rejim' : 'Terminal yo\'q'}
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              remaining < 600 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'
            }`}>
              <Timer size={16} />
              <span className="font-mono font-bold text-sm">{formatClock(remaining)}</span>
            </div>

            <button
              onClick={() => finishExam(false)}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded-lg transition-colors"
            >
              <Flag size={15} />
              Imtihonni tugatish
            </button>
          </div>
        </div>

        <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
            style={{ width: `${tasks?.length ? (verifiedCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {manualMode && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">Terminal ochilmadi — manual rejim</p>
              <p className="text-sm text-slate-300 font-mono break-all">{sessionError}</p>
              <p className="text-xs text-slate-500 mt-2">
                Backend ishga tushiring: <code className="text-emerald-400">npm run dev:full</code>.
                Manual rejimda tasklarni o'zingiz belgilaysiz — natija taxminiy bo'ladi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Split view: tasks left, terminal right (sticky on xl) */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Terminal — mobile: top; xl: right sticky */}
        {sessionStatus === 'active' && (
          <div className="xl:order-2 xl:w-[46%] flex-shrink-0">
            <div className="xl:sticky xl:top-36">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <TerminalIcon size={16} className="text-emerald-400" />
                  Lab Terminal
                </h2>
                <button
                  onClick={() => setShowTerminal((v) => !v)}
                  className="text-xs px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
                >
                  {showTerminal ? 'Yashirish' : "Ko'rsatish"}
                </button>
              </div>
              {showTerminal && <DockerTerminal sessionId={sessionId} />}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="xl:order-1 flex-1 min-w-0">
          <div className="space-y-6">
            {tasks?.map((task, idx) => (
              <ExamTask
                key={task.id}
                task={task}
                index={idx}
                verifyState={verifyResults[task.id]}
                onVerify={handleVerify}
                verifying={verifying}
                sessionActive={sessionStatus === 'active'}
                manualMode={manualMode}
                manualDone={Boolean(manualDone[task.id])}
                onToggleManual={(id) => setManualDone((prev) => ({ ...prev, [id]: !prev[id] }))}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={abandonExam}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white text-sm"
            >
              <RotateCcw size={16} />
              Natijasiz to'xtatish
            </button>
            <button
              onClick={() => finishExam(false)}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg"
            >
              <Flag size={17} />
              Imtihonni tugatish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
