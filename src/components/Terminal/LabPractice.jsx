import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, Square, Loader2, AlertTriangle, Container, FlaskConical, ArrowRight
} from 'lucide-react';
import DockerTerminal from './DockerTerminal';

// Real practice terminal embedded in lab lessons: opens a disposable
// playground container so students can try the lab commands for real,
// then points them at the module's graded practical test.
export default function LabPractice({ moduleId }) {
  const [status, setStatus] = useState('idle'); // idle | starting | running | error
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [backendUp, setBackendUp] = useState(null);
  const sessionRef = useRef(null);
  sessionRef.current = sessionId;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setBackendUp(Boolean(d.docker)); })
      .catch(() => { if (!cancelled) setBackendUp(false); });
    return () => { cancelled = true; };
  }, []);

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

  // Backend yo'q — panel o'rniga hech narsa ko'rsatmaymiz (simulyatsiya terminali bor)
  if (backendUp === false) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Container size={20} className="text-emerald-400" />
        Real Terminal — mashq maydoni
      </h3>

      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
          <p className="text-sm text-slate-400 flex-1">
            Darsdagi buyruqlarni haqiqiy Ubuntu containerda sinab ko'ring —
            xohlagancha eksperiment qiling, hech narsa buzilmaydi.
          </p>
          {status !== 'running' ? (
            <button
              onClick={start}
              disabled={status === 'starting' || backendUp === null}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              {status === 'starting' ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
              {status === 'starting' ? 'Ochilmoqda...' : 'Terminal ochish'}
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Square size={15} />
              To'xtatish
            </button>
          )}
        </div>

        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3 text-sm">
            <p className="text-red-400 font-medium flex items-center gap-2 mb-1">
              <AlertTriangle size={14} /> Container ochilmadi
            </p>
            <p className="text-slate-400 font-mono text-xs break-all">{error}</p>
          </div>
        )}

        {status === 'running' && sessionId && (
          <div className="mb-3">
            <DockerTerminal sessionId={sessionId} />
          </div>
        )}

        <Link
          to={`/module/${moduleId}/lab-test`}
          className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
        >
          <FlaskConical size={15} />
          Bilimni baholash: modul amaliy testini topshirish
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
