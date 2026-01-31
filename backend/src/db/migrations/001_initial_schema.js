/**
 * Initial database schema for LFCS Platform
 */

export async function up(knex) {
  // Enable UUID extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // =====================================================
  // USERS TABLE
  // =====================================================
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 255).unique().notNullable();
    table.string('username', 100).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('display_name', 255);
    table.text('avatar_url');
    table.string('role', 50).defaultTo('student').checkIn(['student', 'instructor', 'admin']);
    table.boolean('is_active').defaultTo(true);
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token', 255);
    table.timestamp('last_login_at');
    table.timestamps(true, true);
  });

  // =====================================================
  // PASSWORD RESETS TABLE
  // =====================================================
  await knex.schema.createTable('password_resets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('token', 255).notNullable();
    table.timestamp('expires_at').notNullable();
    table.boolean('used').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // =====================================================
  // MODULES TABLE
  // =====================================================
  await knex.schema.createTable('modules', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.string('icon', 50).defaultTo('Terminal');
    table.string('color', 100).defaultTo('from-green-500 to-emerald-600');
    table.string('duration', 50);
    table.string('difficulty', 50).checkIn(['Beginner', 'Intermediate', 'Advanced', 'Exam']);
    table.string('exam_weight', 10);
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_published').defaultTo(true);
    table.timestamps(true, true);
  });

  // =====================================================
  // EXAM DOMAINS TABLE
  // =====================================================
  await knex.schema.createTable('exam_domains', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.integer('weight').notNullable().checkBetween([0, 100]);
    table.integer('sort_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // =====================================================
  // EXAM DOMAIN MODULES (many-to-many)
  // =====================================================
  await knex.schema.createTable('exam_domain_modules', (table) => {
    table.integer('exam_domain_id').references('id').inTable('exam_domains').onDelete('CASCADE');
    table.integer('module_id').references('id').inTable('modules').onDelete('CASCADE');
    table.primary(['exam_domain_id', 'module_id']);
  });

  // =====================================================
  // LESSONS TABLE
  // =====================================================
  await knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table.integer('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.string('type', 50).notNullable().checkIn(['theory', 'lab', 'quiz', 'exam']);
    table.string('duration', 50);
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_published').defaultTo(true);
    table.timestamps(true, true);

    table.index('module_id');
    table.index('type');
  });

  // =====================================================
  // LESSON CONTENT TABLE
  // =====================================================
  await knex.schema.createTable('lesson_content', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').unique().notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.text('content').notNullable();
    table.jsonb('key_points').defaultTo('[]');
    table.timestamps(true, true);
  });

  // =====================================================
  // LAB COMMANDS TABLE
  // =====================================================
  await knex.schema.createTable('lab_commands', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.text('cmd').notNullable();
    table.text('description');
    table.integer('sort_order').defaultTo(0);

    table.index('lesson_id');
  });

  // =====================================================
  // QUIZ QUESTIONS TABLE
  // =====================================================
  await knex.schema.createTable('quiz_questions', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.text('question').notNullable();
    table.jsonb('options').notNullable();
    table.integer('correct_index').notNullable().checkPositive();
    table.text('explanation');
    table.integer('sort_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('lesson_id');
  });

  // =====================================================
  // EXAM TASKS TABLE
  // =====================================================
  await knex.schema.createTable('exam_tasks', (table) => {
    table.increments('id').primary();
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.jsonb('hints').defaultTo('[]');
    table.text('solution').notNullable();
    table.text('verification');
    table.integer('sort_order').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('lesson_id');
  });

  // =====================================================
  // USER LESSON PROGRESS TABLE
  // =====================================================
  await knex.schema.createTable('user_lesson_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.integer('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE');
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('completed_at');
    table.integer('time_spent_seconds').defaultTo(0);
    table.integer('xp_earned').defaultTo(0);
    table.timestamps(true, true);

    table.unique(['user_id', 'lesson_id']);
    table.index('module_id');
  });

  // =====================================================
  // USER QUIZ RESULTS TABLE
  // =====================================================
  await knex.schema.createTable('user_quiz_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.integer('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE');
    table.integer('score').notNullable();
    table.integer('total_questions').notNullable();
    table.decimal('percentage', 5, 2).notNullable();
    table.jsonb('answers');
    table.integer('xp_earned').defaultTo(0);
    table.integer('attempt_number').defaultTo(1);
    table.timestamp('completed_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('lesson_id');
  });

  // =====================================================
  // USER LAB PROGRESS TABLE
  // =====================================================
  await knex.schema.createTable('user_lab_progress', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('lesson_id').notNullable().references('id').inTable('lessons').onDelete('CASCADE');
    table.integer('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE');
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('completed_at');
    table.jsonb('commands_executed').defaultTo('[]');
    table.integer('xp_earned').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.unique(['user_id', 'lesson_id']);
  });

  // =====================================================
  // USER STATS TABLE
  // =====================================================
  await knex.schema.createTable('user_stats', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').unique().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('total_xp').defaultTo(0);
    table.integer('current_streak').defaultTo(0);
    table.integer('longest_streak').defaultTo(0);
    table.timestamp('last_activity_at');
    table.integer('total_lessons_completed').defaultTo(0);
    table.integer('total_quizzes_completed').defaultTo(0);
    table.integer('total_labs_completed').defaultTo(0);
    table.integer('total_time_spent_seconds').defaultTo(0);
    table.timestamps(true, true);
  });

  // =====================================================
  // ACTIVITY LOG TABLE
  // =====================================================
  await knex.schema.createTable('activity_log', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('action_type', 100).notNullable();
    table.string('entity_type', 50);
    table.integer('entity_id');
    table.jsonb('metadata').defaultTo('{}');
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('created_at');
    table.index('action_type');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('activity_log');
  await knex.schema.dropTableIfExists('user_stats');
  await knex.schema.dropTableIfExists('user_lab_progress');
  await knex.schema.dropTableIfExists('user_quiz_results');
  await knex.schema.dropTableIfExists('user_lesson_progress');
  await knex.schema.dropTableIfExists('exam_tasks');
  await knex.schema.dropTableIfExists('quiz_questions');
  await knex.schema.dropTableIfExists('lab_commands');
  await knex.schema.dropTableIfExists('lesson_content');
  await knex.schema.dropTableIfExists('lessons');
  await knex.schema.dropTableIfExists('exam_domain_modules');
  await knex.schema.dropTableIfExists('exam_domains');
  await knex.schema.dropTableIfExists('modules');
  await knex.schema.dropTableIfExists('password_resets');
  await knex.schema.dropTableIfExists('users');
}
