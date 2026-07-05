import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Terminal as TerminalIcon, Loader2, AlertTriangle,
  CheckCircle2, XCircle, Trophy, RotateCcw, Zap, Eye, EyeOff,
  ShieldCheck, FlaskConical, SkipForward
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { modules } from '../data/modules';
import DockerTerminal from '../components/Terminal/DockerTerminal';
import CodeBlock from '../components/CodeBlock/CodeBlock';

const PASS_PERCENT = 70;

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

function scoreColor(pct) {
  return pct >= PASS_PERCENT ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
}

export default function ModuleLabTest() {
  const { moduleId } = useParams();
  const id = parseInt(moduleId);
  const module = modules.find(m => m.id === id);

  const { completeModuleLabTest, getModuleLabTestResult } = useProgress();
  const savedResult = getModuleLabTestResult(id);

  const [tasks, setTasks] = useState(null); // null = loading, [] = none
  const [tasksError, setTasksError] = useState(null);

  const [phase, setPhase] = useState('intro'); // intro | starting | test | result
  const [sessionId, setSessionId] = useState(null);
  const [sessionError, setSessionError] = useState(null);
  const [showTerminal, setShowTerminal] = useState(true);

  const [current, setCurrent] = useState(0);
  const [taskStates, setTaskStates] = useState({}); // {taskId: {status:'passed'|'skipped', attempts, lastVerify}}
  const [verifying, setVerifying] = useState(false);
  const [lastVerify, setLastVerify] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState(null);
  const [justPassed, setJustPassed] = useState(false);

  const sessionRef = useRef(null);
  sessionRef.current = sessionId;

  // Load task list
  useEffect(() => {
    let cancelled = false;
    api(`/api/module-tasks/${id}`)
      .then(t => { if (!cancelled) setTasks(t); })
      .catch(e => { if (!cancelled) { setTasks([]); setTasksError(e.message); } });
    return () => { cancelled = true; };
  }, [id]);

  // Kill container when leaving the page
  useEffect(() => () => {
    if (sessionRef.current) {
      fetch(`/api/sessions/${sessionRef.current}`, { method: 'DELETE' }).catch(() => {});
    }
  }, []);

  const resetTaskUI = () => {
    setLastVerify(null);
    setAttempts(0);
    setShowHint(false);
    setSolution(null);
    setJustPassed(false);
  };

  const startTest = async () => {
    setPhase('starting');
    setSessionError(null);
    try {
      const { sessionId: sid } = await api('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ mode: 'module', moduleId: id }),
      });
      setSessionId(sid);
      setCurrent(0);
      setTaskStates({});
      resetTaskUI();
      setPhase('test');
    } catch (e) {
      setSessionError(e.message);
      setPhase('intro');
    }
  };

  const endSession = () => {
    if (sessionRef.current) {
      fetch(`/api/sessions/${sessionRef.current}`, { method: 'DELETE' }).catch(() => {});
    }
    setSessionId(null);
  };

  const advance = (newStates) => {
    const passedCount = Object.values(newStates).filter(s => s.status === 'passed').length;
    if (current < tasks.length - 1) {
      setCurrent(c => c + 1);
      resetTaskUI();
    } else {
      completeModuleLabTest(id, passedCount, tasks.length);
      endSession();
      setPhase('result');
    }
  };

  const handleVerify = async () => {
    const task = tasks[current];
    setVerifying(true);
    try {
      const result = await api(`/api/sessions/${sessionId}/verify-module`, {
        method: 'POST',
        body: JSON.stringify({ moduleId: id, taskId: task.id }),
      });
      setLastVerify(result);
      if (result.success) {
        const newStates = { ...taskStates, [task.id]: { status: 'passed' } };
        setTaskStates(newStates);
        setJustPassed(true);
        // brief success flash, then advance
        setTimeout(() => advance(newStates), 1400);
      } else {
        setAttempts(a => a + 1);
      }
    } catch (e) {
      setLastVerify({ success: false, results: [{ name: `Xatolik: ${e.message}`, passed: false }] });
      setAttempts(a => a + 1);
    } finally {
      setVerifying(false);
    }
  };

  const handleSkip = () => {
    const task = tasks[current];
    const newStates = { ...taskStates, [task.id]: { status: 'skipped' } };
    setTaskStates(newStates);
    advance(newStates);
  };

  const showSolution = async () => {
    try {
      const { solution: sol } = await api(`/api/module-tasks/${id}/${tasks[current].id}/solution`);
      setSolution(sol);
    } catch {
      setSolution('# Yechim yuklanmadi');
    }
  };

  if (!module) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Modul topilmadi</h1>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">Bosh sahifa</Link>
      </div>
    );
  }

  // ---------- Intro / starting ----------
  if (phase === 'intro' || phase === 'starting') {
    return (
      <div className="p-6 max-w-3xl mx-auto fade-in">
        <Link to={`/module/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={18} />
          {module.title}
        </Link>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <FlaskConical size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Amaliy test — real terminalda</h1>
              <p className="text-slate-400">{module.title}</p>
            </div>
          </div>

          {tasks === null ? (
            <div className="flex items-center gap-3 text-slate-400 text-sm py-4">
              <Loader2 size={18} className="animate-spin" /> Topshiriqlar yuklanmoqda...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-400 font-medium mb-1">Topshiriqlar yuklanmadi</p>
              <p className="text-sm text-slate-300 font-mono break-all">{tasksError}</p>
              <p className="text-xs text-slate-500 mt-2">
                Backend ishga tushganmi? <code className="text-emerald-400">npm run dev:full</code>
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Topshiriqlar</div>
                  <div className="text-2xl font-bold text-white">{tasks.length} ta</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">O'tish bali</div>
                  <div className="text-2xl font-bold text-white">{PASS_PERCENT}%</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">Muhit</div>
                  <div className="text-2xl font-bold text-white">Ubuntu</div>
                </div>
              </div>

              {savedResult && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div className="text-sm text-slate-400">Eng yaxshi natijangiz ({savedResult.attempts} urinish):</div>
                  <div className={`text-2xl font-bold ${scoreColor(savedResult.best)}`}>{savedResult.best}%</div>
                </div>
              )}

              <ul className="text-sm text-slate-400 space-y-1 mb-6 list-disc list-inside">
                <li>Sizga alohida Docker container ochiladi — topshiriqlarni terminalda bajarasiz</li>
                <li>Har topshiriqdan keyin <strong className="text-slate-300">"Tekshirish"</strong> bosing — barcha mezonlar o'tsa keyingisiga o'tasiz</li>
                <li>2 marta xato qilsangiz yechimni ko'rish imkoni ochiladi</li>
                <li>Topshiriqlar ketma-ket — oldingisini yakunlamasdan keyingisiga o'tilmaydi</li>
              </ul>

              {sessionError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-red-400 mb-1">Container ochilmadi</p>
                      <p className="text-sm text-slate-300 font-mono break-all">{sessionError}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Docker daemon va backend ishlayotganini tekshiring:
                        <code className="text-emerald-400 ml-1">npm run dev:full</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={startTest}
                disabled={phase === 'starting'}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              >
                {phase === 'starting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Muhit tayyorlanmoqda...
                  </>
                ) : (
                  <>
                    <TerminalIcon size={18} />
                    O'qib chiqdim — testni boshlash
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === 'result') {
    const passedCount = Object.values(taskStates).filter(s => s.status === 'passed').length;
    const percentage = Math.round((passedCount / tasks.length) * 100);
    const passed = percentage >= PASS_PERCENT;
    return (
      <div className="p-6 max-w-3xl mx-auto fade-in">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Trophy size={40} className={passed ? 'text-green-400' : 'text-red-400'} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {passed ? "Modul amaliyoti o'zlashtirildi!" : 'Yana mashq kerak'}
          </h1>
          <p className="text-slate-400 mb-4">
            {module.title} — {tasks.length} topshiriqdan {passedCount} tasi bajarildi
          </p>
          <div className={`text-6xl font-bold mb-2 ${scoreColor(percentage)}`}>{percentage}%</div>
          <p className="text-sm text-slate-500 mb-6">O'tish bali: {PASS_PERCENT}%</p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setPhase('intro'); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw size={17} />
              Qayta topshirish
            </button>
            <Link
              to={`/module/${id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Modulga qaytish
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Per-task summary */}
        <div className="space-y-2">
          {tasks.map((t) => {
            const st = taskStates[t.id]?.status;
            return (
              <div key={t.id} className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3">
                {st === 'passed' ? (
                  <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle size={18} className="text-red-400 flex-shrink-0" />
                )}
                <span className="text-sm text-slate-300 flex-1">{t.id}. {t.title}</span>
                <span className={`text-xs ${st === 'passed' ? 'text-green-400' : 'text-red-400'}`}>
                  {st === 'passed' ? 'bajarildi' : st === 'skipped' ? "o'tkazib yuborildi" : 'bajarilmadi'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Test ----------
  const task = tasks[current];
  const passedCount = Object.values(taskStates).filter(s => s.status === 'passed').length;

  return (
    <div className="p-6 max-w-5xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FlaskConical size={22} className="text-emerald-400" />
          <div>
            <h1 className="font-bold text-white text-sm">{module.title} — amaliy test</h1>
            <p className="text-xs text-slate-400">
              Topshiriq {current + 1}/{tasks.length} · {passedCount} bajarildi
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowTerminal(v => !v)}
          className="text-xs px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
        >
          {showTerminal ? 'Terminalni yashirish' : "Terminalni ko'rsatish"}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
          style={{ width: `${(passedCount / tasks.length) * 100}%` }}
        />
      </div>

      {/* Terminal */}
      {showTerminal && sessionId && (
        <div className="mb-4">
          <DockerTerminal sessionId={sessionId} />
        </div>
      )}

      {/* Task card */}
      <div className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-colors ${
        justPassed ? 'border-green-500/60' : 'border-slate-700'
      }`}>
        <div className="p-4 border-b border-slate-700 bg-slate-800/30 flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            justPassed ? 'bg-green-500/20 text-green-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {justPassed ? <CheckCircle2 size={18} /> : current + 1}
          </span>
          <h2 className="font-semibold text-white flex-1">{task.title}</h2>
          {attempts > 0 && !justPassed && (
            <span className="text-xs text-slate-500">{attempts} urinish</span>
          )}
        </div>

        <div className="p-4">
          <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
            <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm">{task.description}</pre>
          </div>

          {/* Hint */}
          <div className="mb-3">
            <button
              onClick={() => setShowHint(v => !v)}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              <Zap size={15} />
              {showHint ? 'Hintni yashirish' : "Hint ko'rish"}
            </button>
            {showHint && <p className="mt-2 pl-6 text-sm text-slate-400">{task.hint}</p>}
          </div>

          {/* Solution (after 2 failed attempts) */}
          {attempts >= 2 && !justPassed && (
            <div className="mb-3">
              {solution === null ? (
                <button
                  onClick={showSolution}
                  className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300"
                >
                  <Eye size={15} />
                  Yechimni ko'rish
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => setSolution(null)}
                    className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-2"
                  >
                    <EyeOff size={15} />
                    Yechimni yashirish
                  </button>
                  <CodeBlock code={solution} language="bash" title="Yechim" />
                </div>
              )}
            </div>
          )}

          {/* Verify results */}
          {lastVerify && (
            <div className={`mb-4 border rounded-lg p-4 ${
              lastVerify.success ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900/50 border-slate-600'
            }`}>
              {lastVerify.success && (
                <p className="text-green-400 font-medium text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Barakalla! Keyingi topshiriqqa o'tilmoqda...
                </p>
              )}
              <ul className="space-y-1.5">
                {lastVerify.results.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    {r.passed ? (
                      <CheckCircle2 size={15} className="text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={r.passed ? 'text-slate-300' : 'text-slate-400'}>{r.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
            <button
              onClick={handleVerify}
              disabled={verifying || justPassed}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {verifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Tekshirish
                </>
              )}
            </button>

            {attempts >= 2 && !justPassed && (
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors"
                title="Bu topshiriq bajarilmagan deb hisoblanadi"
              >
                <SkipForward size={16} />
                O'tkazib yuborish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
