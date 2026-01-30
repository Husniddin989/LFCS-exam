import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Play, RotateCcw } from 'lucide-react';

export default function Terminal({ commands = [], title = "Terminal", interactive = false }) {
  const [history, setHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [copied, setCopied] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Simulated command responses
  const commandResponses = {
    'ls': 'bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var',
    'pwd': '/home/student',
    'whoami': 'student',
    'date': new Date().toString(),
    'uname -a': 'Linux lfcs-lab 5.15.0-generic #1 SMP x86_64 GNU/Linux',
    'echo $HOME': '/home/student',
    'cat /etc/os-release': 'NAME="Ubuntu"\nVERSION="22.04 LTS"\nID=ubuntu\nID_LIKE=debian',
    'df -h': 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   12G   38G  24% /',
    'free -h': '              total        used        free      shared  buff/cache   available\nMem:           16Gi       4.2Gi       8.1Gi       312Mi       3.7Gi        11Gi\nSwap:         2.0Gi          0B       2.0Gi',
    'ps aux | head -5': 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169584 13256 ?        Ss   10:00   0:02 /sbin/init\nroot         2  0.0  0.0      0     0 ?        S    10:00   0:00 [kthreadd]\nroot         3  0.0  0.0      0     0 ?        I<   10:00   0:00 [rcu_gp]',
    'clear': 'CLEAR',
    'help': 'Available commands: ls, pwd, whoami, date, uname -a, df -h, free -h, ps, cat, echo, clear, help'
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    const response = commandResponses[trimmedCmd] ||
      Object.entries(commandResponses).find(([key]) =>
        trimmedCmd.startsWith(key.split(' ')[0])
      )?.[1] ||
      `bash: ${trimmedCmd.split(' ')[0]}: command not found (simulation mode)`;

    setHistory(prev => [...prev, { cmd: trimmedCmd, output: response }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const runCommand = (cmd) => {
    handleCommand(cmd);
  };

  return (
    <div className="terminal my-4">
      {/* Terminal header */}
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="ml-4 text-sm text-slate-400">{title}</span>
      </div>

      {/* Terminal body */}
      <div ref={terminalRef} className="terminal-body font-mono text-sm">
        {/* Pre-defined commands */}
        {commands.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex items-center justify-between group">
              <div className="terminal-line">
                <span className="terminal-prompt">$</span>
                <span className="terminal-command">{item.cmd}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyToClipboard(item.cmd, `cmd-${idx}`)}
                  className="p-1 text-slate-500 hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copied === `cmd-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                </button>
                {interactive && (
                  <button
                    onClick={() => runCommand(item.cmd)}
                    className="p-1 text-slate-500 hover:text-green-400 transition-colors"
                    title="Run command"
                  >
                    <Play size={14} />
                  </button>
                )}
              </div>
            </div>
            {item.output && (
              <div className="terminal-output ml-4 mt-1">{item.output}</div>
            )}
            {item.desc && (
              <div className="text-xs text-slate-600 ml-4 mt-1">
                # {item.desc}
              </div>
            )}
          </div>
        ))}

        {/* Interactive history */}
        {history.map((item, idx) => (
          <div key={`history-${idx}`} className="mb-2">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-command">{item.cmd}</span>
            </div>
            <div className="terminal-output ml-4 mt-1 whitespace-pre-wrap">
              {item.output}
            </div>
          </div>
        ))}

        {/* Interactive input */}
        {interactive && (
          <div className="terminal-line mt-2">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white ml-2"
              placeholder="Enter command..."
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Terminal footer */}
      {interactive && (
        <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
          <span>Simulation mode — limited commands available</span>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
