import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, GraduationCap, Clock, Target,
  CheckCircle2, XCircle, Trophy, RotateCcw, HelpCircle, Flag
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { modules } from '../data/modules';
import { moduleTests } from '../data/moduleTests';

const PASS_PERCENT = 70;

function shuffled(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreColor(pct) {
  return pct >= PASS_PERCENT ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400';
}

export default function ModuleTest() {
  const { moduleId } = useParams();
  const id = parseInt(moduleId);
  const module = modules.find(m => m.id === id);
  const bank = moduleTests[id];

  const { completeModuleTest, getModuleTestResult } = useProgress();
  const savedResult = getModuleTestResult(id);

  const [phase, setPhase] = useState('intro'); // intro | test | result
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // {questionIndex: optionIndex}

  const startTest = () => {
    setQuestions(shuffled(bank));
    setAnswers({});
    setCurrent(0);
    setPhase('test');
  };

  const finishTest = () => {
    const score = questions.reduce(
      (acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0), 0
    );
    completeModuleTest(id, score, questions.length);
    setPhase('result');
  };

  const answeredCount = Object.keys(answers).length;

  const result = useMemo(() => {
    if (phase !== 'result') return null;
    const wrong = questions
      .map((q, idx) => ({ ...q, idx, selected: answers[idx] }))
      .filter(q => q.selected !== q.correct);
    const score = questions.length - wrong.length;
    return {
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      wrong,
    };
  }, [phase, questions, answers]);

  if (!module || !bank?.length) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Test topilmadi</h1>
        <Link to={module ? `/module/${id}` : '/'} className="text-blue-400 hover:underline mt-4 inline-block">
          Ortga qaytish
        </Link>
      </div>
    );
  }

  // ---------- Intro ----------
  if (phase === 'intro') {
    return (
      <div className="p-6 max-w-3xl mx-auto fade-in">
        <Link to={`/module/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft size={18} />
          {module.title}
        </Link>

        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <GraduationCap size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Modul testi</h1>
              <p className="text-slate-400">{module.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
                <HelpCircle size={15} /> Savollar
              </div>
              <div className="text-2xl font-bold text-white">{bank.length} ta</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
                <Target size={15} /> O'tish bali
              </div>
              <div className="text-2xl font-bold text-white">{PASS_PERCENT}%</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
                <Clock size={15} /> Taxminan
              </div>
              <div className="text-2xl font-bold text-white">{Math.ceil(bank.length * 1.5)} min</div>
            </div>
          </div>

          {savedResult && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Eng yaxshi natijangiz ({savedResult.attempts} urinish):
              </div>
              <div className={`text-2xl font-bold ${scoreColor(savedResult.best)}`}>
                {savedResult.best}%
              </div>
            </div>
          )}

          <ul className="text-sm text-slate-400 space-y-1 mb-6 list-disc list-inside">
            <li>Javoblar test oxirida baholanadi — savollar orasida erkin yuring</li>
            <li>Har urinishda savollar tartibi aralashtiriladi</li>
            <li>Eng yaxshi natijangiz saqlanadi{savedResult ? '' : ' va XP beriladi'}</li>
          </ul>

          <button
            onClick={startTest}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {savedResult ? 'Qayta topshirish' : 'Testni boshlash'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Result ----------
  if (phase === 'result' && result) {
    const passed = result.percentage >= PASS_PERCENT;
    return (
      <div className="p-6 max-w-3xl mx-auto fade-in">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <Trophy size={40} className={passed ? 'text-green-400' : 'text-red-400'} />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            {passed ? "Modul o'zlashtirildi!" : "Yana mashq kerak"}
          </h1>
          <p className="text-slate-400 mb-4">
            {module.title} — {result.total} savoldan {result.score} tasi to'g'ri
          </p>

          <div className={`text-6xl font-bold mb-2 ${scoreColor(result.percentage)}`}>
            {result.percentage}%
          </div>
          <p className="text-sm text-slate-500 mb-6">
            O'tish bali: {PASS_PERCENT}%
            {savedResult && savedResult.best > result.percentage && (
              <> · Eng yaxshi natijangiz: {savedResult.best}%</>
            )}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={startTest}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RotateCcw size={17} />
              Qayta topshirish
            </button>
            <Link
              to={`/module/${id}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Modulga qaytish
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Wrong answers review */}
        {result.wrong.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Xatolar tahlili ({result.wrong.length})
            </h2>
            <div className="space-y-4">
              {result.wrong.map((q) => (
                <div key={q.idx} className="bg-slate-800/50 border border-red-500/20 rounded-xl p-5">
                  <h3 className="font-medium text-white mb-3">{q.question}</h3>
                  <div className="space-y-2 mb-3 text-sm">
                    {q.selected !== undefined ? (
                      <div className="flex items-start gap-2 text-red-400">
                        <XCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>Sizning javobingiz: {q.options[q.selected]}</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-slate-500">
                        <XCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>Javob belgilanmagan</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-green-400">
                      <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                      <span>To'g'ri javob: {q.options[q.correct]}</span>
                    </div>
                  </div>
                  {q.explanation && (
                    <p className="text-sm text-slate-400 bg-slate-900/50 rounded-lg p-3">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Test ----------
  const q = questions[current];
  return (
    <div className="p-6 max-w-3xl mx-auto fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GraduationCap size={22} className="text-purple-400" />
          <div>
            <h1 className="font-bold text-white text-sm">{module.title} — test</h1>
            <p className="text-xs text-slate-400">{answeredCount}/{questions.length} javob belgilandi</p>
          </div>
        </div>
        <button
          onClick={finishTest}
          disabled={answeredCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Flag size={15} />
          Yakunlash
        </button>
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              idx === current
                ? 'bg-purple-500 text-white'
                : answers[idx] !== undefined
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-slate-800 text-slate-500 hover:text-white'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-4">
        <div className="text-sm text-slate-400 mb-3">Savol {current + 1} / {questions.length}</div>
        <h2 className="text-lg font-semibold text-white mb-5">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers(prev => ({ ...prev, [current]: idx }))}
              className={`quiz-option w-full text-left flex items-center gap-4 ${
                answers[current] === idx ? 'selected' : ''
              }`}
            >
              <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Oldingi
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(c => c + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg"
          >
            Keyingi
            <ArrowRight size={17} />
          </button>
        ) : (
          <button
            onClick={finishTest}
            disabled={answeredCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-medium rounded-lg"
          >
            <Flag size={17} />
            Yakunlash
          </button>
        )}
      </div>
    </div>
  );
}
