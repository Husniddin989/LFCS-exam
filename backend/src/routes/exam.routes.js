import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { db } from '../config/database.js';
import { success } from '../utils/response.js';

const router = Router();

// Get all exam domains
router.get('/', asyncHandler(async (req, res) => {
  const domains = await db('exam_domains')
    .select('exam_domains.*')
    .orderBy('sort_order');

  // Get modules for each domain
  const domainsWithModules = await Promise.all(
    domains.map(async (domain) => {
      const moduleIds = await db('exam_domain_modules')
        .where('exam_domain_id', domain.id)
        .pluck('module_id');

      return {
        id: domain.id,
        name: domain.name,
        weight: domain.weight,
        modules: moduleIds
      };
    })
  );

  return success(res, domainsWithModules);
}));

export default router;
