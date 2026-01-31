import { db } from '../config/database.js';
import { cache } from '../config/redis.js';
import { success, notFound } from '../utils/response.js';

// Get lesson by ID
export const getLessonById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Try cache first
  const cacheKey = `lessons:${id}`;
  let lessonData = await cache.get(cacheKey);

  if (!lessonData) {
    const lesson = await db('lessons')
      .select('lessons.*', 'modules.title as module_title')
      .join('modules', 'modules.id', 'lessons.module_id')
      .where({ 'lessons.id': id, 'lessons.is_published': true })
      .first();

    if (!lesson) {
      return notFound(res, 'Lesson not found');
    }

    // Get content
    const content = await db('lesson_content')
      .where({ lesson_id: id })
      .first();

    // Get navigation (prev/next lessons)
    const allLessons = await db('lessons')
      .select('id', 'title', 'sort_order')
      .where({ module_id: lesson.module_id, is_published: true })
      .orderBy('sort_order');

    const currentIndex = allLessons.findIndex(l => l.id === parseInt(id));
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    lessonData = {
      id: lesson.id,
      moduleId: lesson.module_id,
      moduleTitle: lesson.module_title,
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      content: content?.content || '',
      keyPoints: content?.key_points || [],
      navigation: {
        prev: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
        next: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null
      }
    };

    // Add type-specific data
    if (lesson.type === 'lab') {
      const commands = await db('lab_commands')
        .where({ lesson_id: id })
        .orderBy('sort_order');
      lessonData.commands = commands.map(c => ({ cmd: c.cmd, desc: c.description }));
    }

    if (lesson.type === 'quiz') {
      const questions = await db('quiz_questions')
        .select('id', 'question', 'options', 'sort_order')
        .where({ lesson_id: id })
        .orderBy('sort_order');
      // Don't include correct answers in response
      lessonData.questions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options
      }));
    }

    if (lesson.type === 'exam') {
      const tasks = await db('exam_tasks')
        .select('id', 'title', 'description', 'hints', 'sort_order')
        .where({ lesson_id: id })
        .orderBy('sort_order');
      // Don't include solutions in initial response
      lessonData.tasks = tasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        hints: t.hints
      }));
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, lessonData, 300);
  }

  // Add user-specific data
  if (userId) {
    const progress = await db('user_lesson_progress')
      .where({ user_id: userId, lesson_id: id })
      .first();
    lessonData.isCompleted = progress?.is_completed || false;

    // Add previous quiz result if quiz type
    if (lessonData.type === 'quiz') {
      const quizResult = await db('user_quiz_results')
        .where({ user_id: userId, lesson_id: id })
        .orderBy('completed_at', 'desc')
        .first();
      if (quizResult) {
        lessonData.previousResult = {
          score: quizResult.score,
          total: quizResult.total_questions,
          percentage: parseFloat(quizResult.percentage)
        };
      }
    }
  }

  return success(res, lessonData);
};

// Get exam task solution (requires auth)
export const getLessonSolution = async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.query;

  if (!taskId) {
    return res.status(400).json({
      success: false,
      error: 'taskId query parameter required'
    });
  }

  const task = await db('exam_tasks')
    .where({ lesson_id: id, id: taskId })
    .first();

  if (!task) {
    return notFound(res, 'Task not found');
  }

  // Log that user viewed solution (for analytics)
  await db('activity_log').insert({
    user_id: req.user.id,
    action_type: 'solution_viewed',
    entity_type: 'exam_task',
    entity_id: parseInt(taskId),
    metadata: { lesson_id: parseInt(id) }
  });

  return success(res, {
    taskId: task.id,
    solution: task.solution,
    verification: task.verification
  });
};
