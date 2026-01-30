import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock, BookOpen,
  Beaker, HelpCircle, ClipboardList, ChevronDown, ChevronUp,
  Lightbulb, AlertTriangle, Terminal as TerminalIcon, Copy, Check, Eye, EyeOff
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { modules } from '../data/modules';
import Terminal from '../components/Terminal/Terminal';
import Quiz from '../components/Quiz/Quiz';
import CodeBlock from '../components/CodeBlock/CodeBlock';

const lessonTypeIcons = {
  theory: BookOpen,
  lab: Beaker,
  quiz: HelpCircle,
  exam: ClipboardList
};

// Simple markdown-like parser
function parseContent(content) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let currentCodeBlock = null;
  let currentTable = null;

  lines.forEach((line, idx) => {
    // Code block start/end
    if (line.startsWith('```')) {
      if (currentCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${idx}`}
            code={currentCodeBlock.code.join('\n')}
            language={currentCodeBlock.lang || 'bash'}
          />
        );
        currentCodeBlock = null;
      } else {
        currentCodeBlock = {
          lang: line.slice(3).trim() || 'bash',
          code: []
        };
      }
      return;
    }

    if (currentCodeBlock) {
      currentCodeBlock.code.push(line);
      return;
    }

    // Table handling
    if (line.startsWith('|')) {
      if (!currentTable) {
        currentTable = { rows: [], isHeader: true };
      }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.some(c => c.match(/^-+$/))) {
        // Skip separator row
        currentTable.isHeader = false;
        return;
      }
      currentTable.rows.push({ cells, isHeader: currentTable.isHeader });
      return;
    } else if (currentTable) {
      elements.push(
        <div key={`table-${idx}`} className="overflow-x-auto my-4">
          <table className="w-full border-collapse">
            <thead>
              {currentTable.rows.filter(r => r.isHeader).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.cells.map((cell, cIdx) => (
                    <th key={cIdx} className="border border-slate-600 bg-slate-800 px-4 py-2 text-left text-sm font-semibold">
                      {cell}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {currentTable.rows.filter(r => !r.isHeader).map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx} className="border border-slate-700 px-4 py-2 text-sm">
                      <span dangerouslySetInnerHTML={{ __html: parseInline(cell) }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(<h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(3)}</h2>);
      return;
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={idx} className="text-xl font-semibold text-slate-200 mt-6 mb-3">{line.slice(4)}</h3>);
      return;
    }
    if (line.startsWith('#### ')) {
      elements.push(<h4 key={idx} className="text-lg font-medium text-slate-300 mt-4 mb-2">{line.slice(5)}</h4>);
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const text = line.slice(2);
      const isWarning = text.toLowerCase().includes('warning') || text.toLowerCase().includes('lfcs');
      const isTip = text.toLowerCase().includes('tip');
      elements.push(
        <div key={idx} className={`flex items-start gap-3 p-4 my-4 rounded-lg border ${
          isWarning ? 'bg-amber-500/10 border-amber-500/30' :
          isTip ? 'bg-blue-500/10 border-blue-500/30' :
          'bg-slate-800/50 border-slate-700'
        }`}>
          {isWarning ? <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} /> :
           isTip ? <Lightbulb className="text-blue-400 flex-shrink-0 mt-0.5" size={18} /> : null}
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </div>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={idx} className="text-slate-300 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
    );
  });

  return elements;
}

function parseInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-slate-700 rounded text-green-400 text-sm font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:underline">$1</a>');
}

// Exam Task Component
function ExamTask({ task }) {
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
          LFCS Task
        </span>
      </div>

      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
        <p className="text-slate-300 whitespace-pre-line">{task.description}</p>
      </div>

      {/* Hints */}
      {task.hints && (
        <div className="mb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Lightbulb size={16} />
            {showHints ? 'Hintlarni yashirish' : 'Hintlar ko\'rish'}
            {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showHints && (
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              {task.hints.map((hint, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Solution */}
      <div>
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSolution ? 'Yechimni yashirish' : 'Yechimni ko\'rish'}
        </button>
        {showSolution && (
          <div className="mt-3">
            <div className="relative">
              <CodeBlock code={task.solution} language="bash" />
            </div>
            {task.verification && (
              <p className="mt-2 text-xs text-slate-500">
                <strong>Tekshirish:</strong> {task.verification}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Lesson() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, completeLab, completeQuiz, isLessonCompleted } = useProgress();

  const module = modules.find(m => m.id === parseInt(moduleId));
  const lesson = module?.lessons?.find(l => l.id === parseInt(lessonId));

  const currentLessonIndex = module?.lessons?.findIndex(l => l.id === parseInt(lessonId)) ?? -1;
  const prevLesson = currentLessonIndex > 0 ? module.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < (module?.lessons?.length ?? 0) - 1
    ? module.lessons[currentLessonIndex + 1]
    : null;

  const isCompleted = isLessonCompleted(parseInt(moduleId), parseInt(lessonId));
  const LessonIcon = lessonTypeIcons[lesson?.type] || BookOpen;

  const handleComplete = () => {
    if (lesson.type === 'lab') {
      completeLab(parseInt(moduleId), parseInt(lessonId));
    }
    completeLesson(parseInt(moduleId), parseInt(lessonId));
  };

  const handleQuizComplete = (score, total) => {
    completeQuiz(parseInt(moduleId), parseInt(lessonId), score, total);
    completeLesson(parseInt(moduleId), parseInt(lessonId));
  };

  if (!module || !lesson) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Dars topilmadi</h1>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <Link to={`/module/${module.id}`} className="hover:text-white transition-colors">
          Module {module.id}
        </Link>
        <span>/</span>
        <span className="text-slate-200">Lesson {lesson.id}</span>
      </div>

      {/* Lesson Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              lesson.type === 'theory' ? 'bg-blue-500/20' :
              lesson.type === 'lab' ? 'bg-green-500/20' :
              lesson.type === 'quiz' ? 'bg-purple-500/20' :
              'bg-amber-500/20'
            }`}>
              <LessonIcon size={24} className={
                lesson.type === 'theory' ? 'text-blue-400' :
                lesson.type === 'lab' ? 'text-green-400' :
                lesson.type === 'quiz' ? 'text-purple-400' :
                'text-amber-400'
              } />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  lesson.type === 'theory' ? 'bg-blue-500/20 text-blue-400' :
                  lesson.type === 'lab' ? 'bg-green-500/20 text-green-400' :
                  lesson.type === 'quiz' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {lesson.type === 'theory' ? 'Nazariya' :
                   lesson.type === 'lab' ? 'Amaliy Lab' :
                   lesson.type === 'quiz' ? 'Quiz' : 'Exam Task'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={12} />
                  {lesson.duration}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
            </div>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Tugallangan</span>
            </div>
          )}
        </div>

        {/* Key Points */}
        {lesson.keyPoints && (
          <div className="mt-6 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Lightbulb size={16} className="text-yellow-400" />
              Asosiy nuqtalar
            </h4>
            <ul className="space-y-1">
              {lesson.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lesson Content */}
      <div className="markdown-content mb-8">
        {lesson.type === 'quiz' && lesson.questions ? (
          <Quiz
            questions={lesson.questions}
            moduleId={moduleId}
            quizId={lessonId}
            onComplete={handleQuizComplete}
          />
        ) : lesson.type === 'exam' && lesson.tasks ? (
          <div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-medium text-amber-400 mb-1">LFCS Exam Format</h4>
                  <p className="text-sm text-slate-300">
                    Bu tasklar LFCS imtihoni formatida. Har bir task uchun 5-10 minut vaqt ajrating.
                    Avval o'zingiz yechishga harakat qiling, keyin yechimni tekshiring.
                  </p>
                </div>
              </div>
            </div>
            {lesson.tasks.map((task, idx) => (
              <ExamTask key={idx} task={task} />
            ))}
          </div>
        ) : (
          <>
            {parseContent(lesson.content)}

            {/* Lab commands */}
            {lesson.type === 'lab' && lesson.commands && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TerminalIcon size={20} className="text-green-400" />
                  Interaktiv Terminal
                </h3>
                <Terminal
                  commands={lesson.commands}
                  title="LFCS Lab Terminal"
                  interactive={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Complete Button */}
      {!isCompleted && lesson.type !== 'quiz' && (
        <div className="mb-8">
          <button
            onClick={handleComplete}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            Darsni tugallangan deb belgilash
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        {prevLesson ? (
          <Link
            to={`/module/${module.id}/lesson/${prevLesson.id}`}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <div className="text-left">
              <div className="text-xs text-slate-500">Oldingi dars</div>
              <div className="text-sm">{prevLesson.title}</div>
            </div>
          </Link>
        ) : (
          <Link
            to={`/module/${module.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Modul sahifasi</span>
          </Link>
        )}

        {nextLesson ? (
          <Link
            to={`/module/${module.id}/lesson/${nextLesson.id}`}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-slate-500">Keyingi dars</div>
              <div className="text-sm">{nextLesson.title}</div>
            </div>
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link
            to={`/module/${module.id}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>Modulni tugatish</span>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
