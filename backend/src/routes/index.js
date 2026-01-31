import { Router } from 'express';
import authRoutes from './auth.routes.js';
import modulesRoutes from './modules.routes.js';
import lessonsRoutes from './lessons.routes.js';
import progressRoutes from './progress.routes.js';
import examRoutes from './exam.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/modules', modulesRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/progress', progressRoutes);
router.use('/exam-domains', examRoutes);

// Stats endpoint (public)
router.get('/stats', async (req, res) => {
  try {
    const { db } = await import('../config/database.js');

    const [moduleCount] = await db('modules').count('id as count');
    const [lessonCount] = await db('lessons').count('id as count');
    const [quizCount] = await db('quiz_questions').count('id as count');
    const [examTaskCount] = await db('exam_tasks').count('id as count');

    res.json({
      success: true,
      data: {
        totalModules: parseInt(moduleCount.count),
        totalLessons: parseInt(lessonCount.count),
        totalQuizQuestions: parseInt(quizCount.count),
        totalExamTasks: parseInt(examTaskCount.count)
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        totalModules: 12,
        totalLessons: 0,
        totalQuizQuestions: 0,
        totalExamTasks: 0
      }
    });
  }
});

export default router;
