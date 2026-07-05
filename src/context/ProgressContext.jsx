import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('lfcs-progress');
    const defaults = {
      completedLessons: [],
      completedQuizzes: {},
      completedLabs: [],
      moduleTests: {},
      moduleLabTests: {},
      examBest: null,
      currentModule: 1,
      currentLesson: null,
      totalXP: 0,
      streak: 0,
      lastActivity: null,
    };
    // Merge over defaults so older saved states get new keys
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  useEffect(() => {
    localStorage.setItem('lfcs-progress', JSON.stringify(progress));
  }, [progress]);

  const completeLesson = (moduleId, lessonId) => {
    const key = `${moduleId}-${lessonId}`;
    if (!progress.completedLessons.includes(key)) {
      setProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, key],
        totalXP: prev.totalXP + 50,
        lastActivity: new Date().toISOString(),
      }));
    }
  };

  const completeLab = (moduleId, labId) => {
    const key = `${moduleId}-${labId}`;
    if (!progress.completedLabs.includes(key)) {
      setProgress(prev => ({
        ...prev,
        completedLabs: [...prev.completedLabs, key],
        totalXP: prev.totalXP + 100,
        lastActivity: new Date().toISOString(),
      }));
    }
  };

  const completeQuiz = (moduleId, quizId, score, total) => {
    const key = `${moduleId}-${quizId}`;
    const percentage = Math.round((score / total) * 100);
    setProgress(prev => ({
      ...prev,
      completedQuizzes: {
        ...prev.completedQuizzes,
        [key]: { score, total, percentage, completedAt: new Date().toISOString() }
      },
      totalXP: prev.totalXP + (percentage >= 80 ? 150 : 50),
      lastActivity: new Date().toISOString(),
    }));
  };

  // Module final test: keep best score, count attempts.
  // XP is awarded only when the best score improves (prevents farming).
  const completeModuleTest = (moduleId, score, total) => {
    const percentage = Math.round((score / total) * 100);
    setProgress(prev => {
      const existing = prev.moduleTests?.[moduleId];
      const prevBest = existing?.best ?? -1;
      const improved = percentage > prevBest;
      const xpGain = improved
        ? (percentage >= 80 ? 200 : percentage >= 60 ? 100 : 30)
        : 0;
      return {
        ...prev,
        moduleTests: {
          ...prev.moduleTests,
          [moduleId]: {
            best: Math.max(prevBest, percentage),
            attempts: (existing?.attempts || 0) + 1,
            last: { score, total, percentage, completedAt: new Date().toISOString() },
          },
        },
        totalXP: prev.totalXP + xpGain,
        lastActivity: new Date().toISOString(),
      };
    });
  };

  const getModuleTestResult = (moduleId) => {
    return progress.moduleTests?.[moduleId] || null;
  };

  // Practical (terminal) module test — same best/attempts model, higher XP.
  const completeModuleLabTest = (moduleId, score, total) => {
    const percentage = Math.round((score / total) * 100);
    setProgress(prev => {
      const existing = prev.moduleLabTests?.[moduleId];
      const prevBest = existing?.best ?? -1;
      const improved = percentage > prevBest;
      const xpGain = improved
        ? (percentage >= 80 ? 250 : percentage >= 60 ? 120 : 40)
        : 0;
      return {
        ...prev,
        moduleLabTests: {
          ...prev.moduleLabTests,
          [moduleId]: {
            best: Math.max(prevBest, percentage),
            attempts: (existing?.attempts || 0) + 1,
            last: { score, total, percentage, completedAt: new Date().toISOString() },
          },
        },
        totalXP: prev.totalXP + xpGain,
        lastActivity: new Date().toISOString(),
      };
    });
  };

  const getModuleLabTestResult = (moduleId) => {
    return progress.moduleLabTests?.[moduleId] || null;
  };

  // Practice-exam attempt: XP only on best-score improvement.
  const completeExamAttempt = (percent) => {
    setProgress(prev => {
      const prevBest = prev.examBest ?? -1;
      const improved = percent > prevBest;
      const xpGain = improved
        ? (percent >= 66 ? 300 : percent >= 40 ? 120 : 50)
        : 0;
      return {
        ...prev,
        examBest: Math.max(prevBest, percent),
        totalXP: prev.totalXP + xpGain,
        lastActivity: new Date().toISOString(),
      };
    });
  };

  const isLessonCompleted = (moduleId, lessonId) => {
    return progress.completedLessons.includes(`${moduleId}-${lessonId}`);
  };

  const isLabCompleted = (moduleId, labId) => {
    return progress.completedLabs.includes(`${moduleId}-${labId}`);
  };

  const getQuizResult = (moduleId, quizId) => {
    return progress.completedQuizzes[`${moduleId}-${quizId}`] || null;
  };

  const getModuleProgress = (moduleId, totalLessons) => {
    const completed = progress.completedLessons.filter(
      key => key.startsWith(`${moduleId}-`)
    ).length;
    return Math.round((completed / totalLessons) * 100);
  };

  const resetProgress = () => {
    setProgress({
      completedLessons: [],
      completedQuizzes: {},
      completedLabs: [],
      moduleTests: {},
      moduleLabTests: {},
      examBest: null,
      currentModule: 1,
      currentLesson: null,
      totalXP: 0,
      streak: 0,
      lastActivity: null,
    });
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      completeLesson,
      completeLab,
      completeQuiz,
      completeModuleTest,
      getModuleTestResult,
      completeModuleLabTest,
      getModuleLabTestResult,
      completeExamAttempt,
      isLessonCompleted,
      isLabCompleted,
      getQuizResult,
      getModuleProgress,
      resetProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
