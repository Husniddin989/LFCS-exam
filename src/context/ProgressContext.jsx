import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('lfcs-progress');
    return saved ? JSON.parse(saved) : {
      completedLessons: [],
      completedQuizzes: {},
      completedLabs: [],
      currentModule: 1,
      currentLesson: null,
      totalXP: 0,
      streak: 0,
      lastActivity: null,
    };
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
