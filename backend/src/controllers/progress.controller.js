import { db } from '../config/database.js';
import { success } from '../utils/response.js';

// XP values
const XP_LESSON = 50;
const XP_LAB = 100;
const XP_QUIZ_PASS = 150;
const XP_QUIZ_FAIL = 50;

// Get user progress
export const getProgress = async (req, res) => {
  const userId = req.user.id;

  // Get completed lessons
  const completedLessons = await db('user_lesson_progress')
    .where({ user_id: userId, is_completed: true })
    .select('module_id', 'lesson_id');

  // Get completed labs
  const completedLabs = await db('user_lab_progress')
    .where({ user_id: userId, is_completed: true })
    .select('module_id', 'lesson_id');

  // Get quiz results
  const quizResults = await db('user_quiz_results')
    .where({ user_id: userId })
    .orderBy('completed_at', 'desc');

  // Get user stats
  const stats = await db('user_stats')
    .where({ user_id: userId })
    .first();

  // Get module progress
  const modules = await db('modules')
    .select('id', 'title')
    .where({ is_published: true })
    .orderBy('sort_order');

  const moduleProgress = await Promise.all(
    modules.map(async (mod) => {
      const [lessonCount] = await db('lessons')
        .where({ module_id: mod.id, is_published: true })
        .count('id as count');

      const [completedCount] = await db('user_lesson_progress')
        .where({ user_id: userId, module_id: mod.id, is_completed: true })
        .count('id as count');

      const total = parseInt(lessonCount.count);
      const completed = parseInt(completedCount.count);

      return {
        moduleId: mod.id,
        moduleTitle: mod.title,
        completed,
        total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    })
  );

  // Format response
  const formattedLessons = completedLessons.map(l => `${l.module_id}-${l.lesson_id}`);
  const formattedLabs = completedLabs.map(l => `${l.module_id}-${l.lesson_id}`);

  const formattedQuizzes = {};
  quizResults.forEach(q => {
    const key = `${q.module_id}-${q.lesson_id}`;
    if (!formattedQuizzes[key]) {
      formattedQuizzes[key] = {
        score: q.score,
        total: q.total_questions,
        percentage: parseFloat(q.percentage)
      };
    }
  });

  return success(res, {
    completedLessons: formattedLessons,
    completedQuizzes: formattedQuizzes,
    completedLabs: formattedLabs,
    stats: stats ? {
      totalXP: stats.total_xp || 0,
      currentStreak: stats.current_streak || 0,
      longestStreak: stats.longest_streak || 0,
      totalLessonsCompleted: stats.total_lessons_completed || 0,
      totalQuizzesCompleted: stats.total_quizzes_completed || 0,
      totalLabsCompleted: stats.total_labs_completed || 0
    } : {
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalLessonsCompleted: 0,
      totalQuizzesCompleted: 0,
      totalLabsCompleted: 0
    },
    moduleProgress
  });
};

// Complete lesson
export const completeLesson = async (req, res) => {
  const userId = req.user.id;
  const { lessonId, moduleId, timeSpentSeconds } = req.body;

  // Check if already completed
  const existing = await db('user_lesson_progress')
    .where({ user_id: userId, lesson_id: lessonId })
    .first();

  if (existing?.is_completed) {
    return success(res, {
      xpEarned: 0,
      totalXP: (await getUserXP(userId)),
      message: 'Lesson already completed'
    });
  }

  // Mark as complete
  if (existing) {
    await db('user_lesson_progress')
      .where({ id: existing.id })
      .update({
        is_completed: true,
        completed_at: new Date(),
        time_spent_seconds: (existing.time_spent_seconds || 0) + (timeSpentSeconds || 0),
        xp_earned: XP_LESSON
      });
  } else {
    await db('user_lesson_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      module_id: moduleId,
      is_completed: true,
      completed_at: new Date(),
      time_spent_seconds: timeSpentSeconds || 0,
      xp_earned: XP_LESSON
    });
  }

  // Update stats
  await updateUserStats(userId, { xp: XP_LESSON, lessons: 1 });

  // Log activity
  await logActivity(userId, 'lesson_complete', 'lesson', lessonId, { module_id: moduleId });

  const totalXP = await getUserXP(userId);
  const streak = await updateStreak(userId);

  return success(res, {
    xpEarned: XP_LESSON,
    totalXP,
    currentStreak: streak.current,
    streakUpdated: streak.updated
  });
};

// Complete lab
export const completeLab = async (req, res) => {
  const userId = req.user.id;
  const { lessonId, moduleId, commandsExecuted } = req.body;

  // Check if already completed
  const existing = await db('user_lab_progress')
    .where({ user_id: userId, lesson_id: lessonId })
    .first();

  if (existing?.is_completed) {
    return success(res, {
      xpEarned: 0,
      totalXP: (await getUserXP(userId)),
      message: 'Lab already completed'
    });
  }

  // Mark as complete
  if (existing) {
    await db('user_lab_progress')
      .where({ id: existing.id })
      .update({
        is_completed: true,
        completed_at: new Date(),
        commands_executed: commandsExecuted || [],
        xp_earned: XP_LAB
      });
  } else {
    await db('user_lab_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      module_id: moduleId,
      is_completed: true,
      completed_at: new Date(),
      commands_executed: commandsExecuted || [],
      xp_earned: XP_LAB
    });
  }

  // Update stats
  await updateUserStats(userId, { xp: XP_LAB, labs: 1 });

  // Log activity
  await logActivity(userId, 'lab_complete', 'lesson', lessonId, { module_id: moduleId });

  const totalXP = await getUserXP(userId);

  return success(res, {
    xpEarned: XP_LAB,
    totalXP
  });
};

// Submit quiz
export const submitQuiz = async (req, res) => {
  const userId = req.user.id;
  const { lessonId, moduleId, answers } = req.body;

  // Get quiz questions with correct answers
  const questions = await db('quiz_questions')
    .where({ lesson_id: lessonId })
    .orderBy('sort_order');

  if (questions.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No questions found for this lesson'
    });
  }

  // Calculate score
  let score = 0;
  const results = questions.map((q, idx) => {
    const selectedIndex = answers[idx];
    const isCorrect = selectedIndex === q.correct_index;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      selectedIndex,
      correctIndex: q.correct_index,
      isCorrect,
      explanation: q.explanation
    };
  });

  const total = questions.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 66;

  // Determine XP
  const xpEarned = passed ? XP_QUIZ_PASS : XP_QUIZ_FAIL;

  // Get attempt number
  const [prevAttempts] = await db('user_quiz_results')
    .where({ user_id: userId, lesson_id: lessonId })
    .count('id as count');
  const attemptNumber = parseInt(prevAttempts.count) + 1;

  // Save result
  await db('user_quiz_results').insert({
    user_id: userId,
    lesson_id: lessonId,
    module_id: moduleId,
    score,
    total_questions: total,
    percentage,
    answers,
    xp_earned: xpEarned,
    attempt_number: attemptNumber
  });

  // Mark lesson as complete (only first time)
  const lessonProgress = await db('user_lesson_progress')
    .where({ user_id: userId, lesson_id: lessonId })
    .first();

  if (!lessonProgress?.is_completed) {
    await db('user_lesson_progress').insert({
      user_id: userId,
      lesson_id: lessonId,
      module_id: moduleId,
      is_completed: true,
      completed_at: new Date(),
      xp_earned: XP_LESSON
    }).onConflict(['user_id', 'lesson_id']).merge({
      is_completed: true,
      completed_at: new Date()
    });

    await updateUserStats(userId, { xp: XP_LESSON + xpEarned, lessons: 1, quizzes: 1 });
  } else {
    await updateUserStats(userId, { xp: xpEarned, quizzes: 1 });
  }

  // Log activity
  await logActivity(userId, 'quiz_submit', 'lesson', lessonId, {
    module_id: moduleId,
    score,
    total,
    passed
  });

  const totalXP = await getUserXP(userId);

  return success(res, {
    score,
    total,
    percentage,
    passed,
    xpEarned,
    totalXP,
    results
  });
};

// Reset progress
export const resetProgress = async (req, res) => {
  const userId = req.user.id;

  await db.transaction(async (trx) => {
    await trx('user_lesson_progress').where({ user_id: userId }).delete();
    await trx('user_lab_progress').where({ user_id: userId }).delete();
    await trx('user_quiz_results').where({ user_id: userId }).delete();
    await trx('user_stats').where({ user_id: userId }).update({
      total_xp: 0,
      current_streak: 0,
      total_lessons_completed: 0,
      total_quizzes_completed: 0,
      total_labs_completed: 0
    });
  });

  return success(res, { message: 'Progress reset successfully' });
};

// Helper functions
async function getUserXP(userId) {
  const stats = await db('user_stats').where({ user_id: userId }).first();
  return stats?.total_xp || 0;
}

async function updateUserStats(userId, { xp = 0, lessons = 0, quizzes = 0, labs = 0 }) {
  await db('user_stats')
    .where({ user_id: userId })
    .update({
      total_xp: db.raw('total_xp + ?', [xp]),
      total_lessons_completed: db.raw('total_lessons_completed + ?', [lessons]),
      total_quizzes_completed: db.raw('total_quizzes_completed + ?', [quizzes]),
      total_labs_completed: db.raw('total_labs_completed + ?', [labs]),
      last_activity_at: new Date()
    });
}

async function updateStreak(userId) {
  const stats = await db('user_stats').where({ user_id: userId }).first();
  const lastActivity = stats?.last_activity_at;
  const now = new Date();

  let updated = false;
  let currentStreak = stats?.current_streak || 0;

  if (lastActivity) {
    const hoursSinceLastActivity = (now - new Date(lastActivity)) / (1000 * 60 * 60);

    if (hoursSinceLastActivity > 48) {
      // Streak broken
      currentStreak = 1;
      updated = true;
    } else if (hoursSinceLastActivity > 20) {
      // New day, increment streak
      currentStreak += 1;
      updated = true;
    }
  } else {
    currentStreak = 1;
    updated = true;
  }

  if (updated) {
    const longestStreak = Math.max(stats?.longest_streak || 0, currentStreak);
    await db('user_stats')
      .where({ user_id: userId })
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak
      });
  }

  return { current: currentStreak, updated };
}

async function logActivity(userId, actionType, entityType, entityId, metadata = {}) {
  await db('activity_log').insert({
    user_id: userId,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    metadata
  });
}
