import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { optionalAuth, authMiddleware } from '../middleware/auth.middleware.js';
import * as lessonsController from '../controllers/lessons.controller.js';

const router = Router();

// Get lesson content (optional auth for progress status)
router.get('/:id', optionalAuth, asyncHandler(lessonsController.getLessonById));

// Get exam task solution (requires auth, tracked as viewed)
router.get('/:id/solution', authMiddleware, asyncHandler(lessonsController.getLessonSolution));

export default router;
