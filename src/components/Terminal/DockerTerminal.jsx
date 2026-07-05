import { useEffect, useRef, useCallback } from 'react';
import { Terminal as Xterm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// Connects an xterm.js terminal to the lab backend over WebSocket.
// The backend bridges the socket to a bash PTY inside the session's
// Docker container. `sessionId` must come from POST /api/sessions.
export default function DockerTerminal({ sessionId, onClose }) {
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const termRef = useRef(null);

  const connect = useCallback(() => {
    if (!containerRef.current || !sessionId) return () => {};

    const term = new Xterm({
      cursorBlink: true,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 13,
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#39ff14',
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    termRef.current = term;

    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${window.location.host}/api/terminal?session=${sessionId}`);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
      term.focus();
    };

    ws.onmessage = (ev) => {
      if (typeof ev.data === 'string') {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'error') {
            term.writeln(`\r\n\x1b[1;31m${msg.message}\x1b[0m`);
            return;
          }
        } catch {
          /* plain text output */
        }
        term.write(ev.data);
      } else {
        term.write(new Uint8Array(ev.data));
      }
    };

    ws.onclose = () => {
      term.writeln('\r\n\x1b[1;33m— sessiya uzildi —\x1b[0m');
      onClose?.();
    };

    const dataDisp = term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data);
    });

    const resizeObserver = new ResizeObserver(() => {
      try {
        fit.fit();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
        }
      } catch {
        /* noop */
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      dataDisp.dispose();
      try { ws.close(); } catch { /* noop */ }
      term.dispose();
      wsRef.current = null;
      termRef.current = null;
    };
  }, [sessionId, onClose]);

  useEffect(() => connect(), [connect]);

  return (
    <div className="bg-[#0d1117] border border-slate-700 rounded-lg overflow-hidden">
      <div className="bg-slate-800 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-slate-400 font-mono">root@lfcs-lab — docker</span>
      </div>
      <div
        ref={containerRef}
        onClick={() => termRef.current?.focus()}
        className="w-full cursor-text"
        style={{ height: '440px', padding: '8px' }}
      />
    </div>
  );
}
