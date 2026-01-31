import { db } from '../config/database.js';
import { cache } from '../config/redis.js';
import { success, notFound } from '../utils/response.js';

// Get all modules
export const getAllModules = async (req, res) => {
  const userId = req.user?.id;

  // Try cache first
  const cacheKey = 'modules:all';
  let modules = await cache.get(cacheKey);

  if (!modules) {
    modules = await db('modules')
      .select(
        'id',
        'title',
        'description',
        'icon',
        'color',
        'duration',
        'difficulty',
        'exam_weight as examWeight',
        'sort_order'
      )
      .where({ is_published: true })
      .orderBy('sort_order');

    // Get lesson count for each module
    for (const mod of modules) {
      const [count] = await db('lessons')
        .where({ module_id: mod.id, is_published: true })
        .count('id as count');
      mod.lessonCount = parseInt(count.count);
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, modules, 300);
  }

  // Add user progress if logged in
  if (userId) {
    for (const mod of modules) {
      const [completed] = await db('user_lesson_progress')
        .where({ user_id: userId, module_id: mod.id, is_completed: true })
        .count('id as count');

      const completedCount = parseInt(completed.count);
      mod.progress = mod.lessonCount > 0
        ? Math.round((completedCount / mod.lessonCount) * 100)
        : 0;
      mod.completedLessons = completedCount;
    }
  }

  return success(res, modules);
};

// Get single module with lessons
export const getModuleById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Try cache first
  const cacheKey = `modules:${id}`;
  let moduleData = await cache.get(cacheKey);

  if (!moduleData) {
    const module = await db('modules')
      .select(
        'id',
        'title',
        'description',
        'icon',
        'color',
        'duration',
        'difficulty',
        'exam_weight as examWeight'
      )
      .where({ id, is_published: true })
      .first();

    if (!module) {
      return notFound(res, 'Module not found');
    }

    // Get lessons
    const lessons = await db('lessons')
      .select('id', 'title', 'type', 'duration', 'sort_order')
      .where({ module_id: id, is_published: true })
      .orderBy('sort_order');

    moduleData = {
      ...module,
      lessons
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, moduleData, 300);
  }

  // Add user progress for lessons if logged in
  if (userId) {
    const completedLessons = await db('user_lesson_progress')
      .where({ user_id: userId, module_id: id, is_completed: true })
      .pluck('lesson_id');

    moduleData.lessons = moduleData.lessons.map(lesson => ({
      ...lesson,
      isCompleted: completedLessons.includes(lesson.id)
    }));

    // Calculate overall progress
    const completed = moduleData.lessons.filter(l => l.isCompleted).length;
    moduleData.progress = moduleData.lessons.length > 0
      ? Math.round((completed / moduleData.lessons.length) * 100)
      : 0;
  }

  return success(res, moduleData);
};
