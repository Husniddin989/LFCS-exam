import { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

export default function Quiz({ questions, moduleId, quizId, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (idx) => {
    if (showResult) return;
    setSelectedAnswer(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    setAnswers(prev => [...prev, {
      questionId: question.id,
      selected: selectedAnswer,
      correct: question.correct,
      isCorrect: selectedAnswer === question.correct
    }]);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const score = answers.filter(a => a.isCorrect).length;
      setQuizComplete(true);
      if (onComplete) {
        onComplete(score, totalQuestions);
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  // Final score calculation
  const finalScore = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((finalScore / totalQuestions) * 100);

  if (quizComplete) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
          percentage >= 80 ? 'bg-green-500/20' : percentage >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'
        }`}>
          <Trophy size={40} className={
            percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
          } />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Quiz tugadi!</h2>
        <p className="text-slate-400 mb-6">
          Siz {totalQuestions} ta savoldan {finalScore} tasiga to'g'ri javob berdingiz
        </p>

        <div className="text-5xl font-bold mb-6">
          <span className={
            percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
          }>
            {percentage}%
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          {percentage >= 80 ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 size={20} />
              <span>Ajoyib natija! +150 XP</span>
            </div>
          ) : percentage >= 60 ? (
            <div className="flex items-center gap-2 text-yellow-400">
              <HelpCircle size={20} />
              <span>Yaxshi! Yana mashq qiling. +50 XP</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={20} />
              <span>Mavzuni qayta o'rganing</span>
            </div>
          )}
        </div>

        <button
          onClick={handleRestart}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
          Qayta boshlash
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="p-6">
        {/* Question header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-slate-400">
            Savol {currentQuestion + 1} / {totalQuestions}
          </span>
          <span className="text-sm px-3 py-1 bg-slate-700 rounded-full text-slate-300">
            {question.id ? `Q${question.id}` : `Q${currentQuestion + 1}`}
          </span>
        </div>

        {/* Question text */}
        <h3 className="text-xl font-semibold text-white mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            let optionClass = 'quiz-option';
            if (showResult) {
              if (idx === question.correct) {
                optionClass += ' correct';
              } else if (idx === selectedAnswer && idx !== question.correct) {
                optionClass += ' incorrect';
              }
            } else if (idx === selectedAnswer) {
              optionClass += ' selected';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className={`${optionClass} w-full text-left flex items-center gap-4`}
                disabled={showResult}
              >
                <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && idx === question.correct && (
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                )}
                {showResult && idx === selectedAnswer && idx !== question.correct && (
                  <XCircle size={20} className="text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className="mb-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
            <div className="flex items-start gap-3">
              <HelpCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Tushuntirish</h4>
                <p className="text-sm text-slate-300">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {showResult ? (
              selectedAnswer === question.correct ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={16} /> To'g'ri!
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle size={16} /> Noto'g'ri
                </span>
              )
            ) : (
              selectedAnswer !== null && 'Javobni tekshiring'
            )}
          </div>

          {!showResult ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Tekshirish
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Keyingi savol
                  <ArrowRight size={18} />
                </>
              ) : (
                'Yakunlash'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
