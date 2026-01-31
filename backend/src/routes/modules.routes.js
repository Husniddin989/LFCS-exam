import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { optionalAuth } from '../middleware/auth.middleware.js';
import * as modulesController from '../controllers/modules.controller.js';

const router = Router();

// All module routes use optional auth to include user progress if logged in
router.get('/', optionalAuth, asyncHandler(modulesController.getAllModules));
router.get('/:id', optionalAuth, asyncHandler(modulesController.getModuleById));

export default router;
