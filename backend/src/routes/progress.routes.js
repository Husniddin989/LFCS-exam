import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate, completeLessonSchema, completeLabSchema, submitQuizSchema } from '../utils/validation.js';
import * as progressController from '../controllers/progress.controller.js';

const router = Router();

// All progress routes require authentication
router.use(authMiddleware);

// Get user progress
router.get('/', asyncHandler(progressController.getProgress));

// Mark lesson complete
router.post('/lesson', validate(completeLessonSchema), asyncHandler(progressController.completeLesson));

// Mark lab complete
router.post('/lab', validate(completeLabSchema), asyncHandler(progressController.completeLab));

// Submit quiz
router.post('/quiz', validate(submitQuizSchema), asyncHandler(progressController.submitQuiz));

// Reset progress
router.delete('/', asyncHandler(progressController.resetProgress));

export default router;
