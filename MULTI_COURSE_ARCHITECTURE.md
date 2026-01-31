# Multi-Course Learning Platform - Architecture

## Overview
Universal learning platform supporting multiple course types: Technical Certifications, DevOps Tools, Programming Languages, and Human Languages.

## Supported Course Categories

### 1. Technical Certifications
- **LFCS** (Linux Foundation Certified System Administrator) ✅ Current
- **LFCE** (Linux Foundation Certified Engineer)
- **RHCSA** (Red Hat Certified System Administrator)
- **AWS Solutions Architect**
- **Azure Administrator**
- **GCP Professional Cloud Architect**
- **CompTIA Linux+, Security+, Network+**

### 2. DevOps & Container Technologies
- **Docker** (Beginner → Advanced)
- **Kubernetes** (CKAD, CKA, CKS preparation)
- **CI/CD Tools:**
  - Jenkins
  - GitLab CI/CD
  - GitHub Actions
  - ArgoCD
  - Tekton
- **Infrastructure as Code:**
  - Terraform
  - Ansible
  - Pulumi

### 3. Programming & Scripting
- **Bash Scripting** (Advanced)
- **Python** (Beginner → Advanced)
- **Go** (Cloud-native development)
- **JavaScript/TypeScript** (Full-stack)

### 4. Human Languages
- **English** (A1 → C2 levels, IELTS/TOEFL prep)
- **Russian** (A1 → C2 levels)
- **German, Spanish, Chinese** (Future)

### 5. Observability & Monitoring
- **Prometheus & Grafana**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Datadog, New Relic**

## Database Schema Evolution

### New Tables

```sql
-- Course Categories
CREATE TABLE course_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,                    -- 'certifications', 'devops', 'languages'
  display_name VARCHAR(200) NOT NULL,            -- 'Technical Certifications'
  icon VARCHAR(50),                              -- Icon identifier
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses (replaces 'modules' concept)
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES course_categories(id),
  slug VARCHAR(100) UNIQUE NOT NULL,             -- 'lfcs', 'docker-beginner', 'english-ielts'
  title VARCHAR(200) NOT NULL,
  short_description TEXT,
  description TEXT,
  difficulty_level VARCHAR(20),                  -- 'beginner', 'intermediate', 'advanced'
  estimated_hours INTEGER,                       -- Total course duration
  language VARCHAR(10) DEFAULT 'uz',             -- 'uz', 'en', 'ru'
  is_published BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0.00,
  instructor_id INTEGER REFERENCES users(id),
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Modules (chapters/sections within a course)
CREATE TABLE course_modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons (updated schema)
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,  -- For quick filtering
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  lesson_type VARCHAR(20) NOT NULL,              -- 'theory', 'lab', 'quiz', 'video', 'exercise'
  duration_minutes INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT false,                 -- Free preview lessons
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson Content (polymorphic - different types)
CREATE TABLE lesson_content (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL,             -- 'markdown', 'video', 'interactive_lab', 'code_editor'
  content_data JSONB NOT NULL,                   -- Flexible JSON structure per type
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Course Enrollments
CREATE TABLE user_course_enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- User Course Progress
CREATE TABLE user_course_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'not_started',      -- 'not_started', 'in_progress', 'completed'
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  best_score DECIMAL(5,2),                       -- For quizzes/exercises
  UNIQUE(user_id, lesson_id)
);

-- Course Reviews & Ratings
CREATE TABLE course_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id)
);

-- User Achievements (Gamification)
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  xp_reward INTEGER DEFAULT 0,
  criteria JSONB NOT NULL,                       -- Flexible achievement criteria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);
```

## Content Type Structures

### 1. Theory Lessons (Markdown)
```json
{
  "content_type": "markdown",
  "content_data": {
    "markdown": "# Introduction to Docker\n\n...",
    "estimated_read_time": 10,
    "resources": [
      {"title": "Official Docker Docs", "url": "https://docs.docker.com"}
    ]
  }
}
```

### 2. Video Lessons
```json
{
  "content_type": "video",
  "content_data": {
    "video_url": "https://...",
    "video_provider": "youtube|vimeo|self_hosted",
    "duration_seconds": 600,
    "transcript": "Full video transcript...",
    "subtitles": [
      {"language": "en", "url": "https://..."},
      {"language": "ru", "url": "https://..."}
    ]
  }
}
```

### 3. Interactive Lab (Docker/K8s)
```json
{
  "content_type": "interactive_lab",
  "content_data": {
    "lab_type": "docker|kubernetes|terraform",
    "instructions": "Create a Dockerfile for...",
    "initial_files": {
      "Dockerfile": "FROM ...",
      "app.js": "console.log('Hello');"
    },
    "validation_script": "#!/bin/bash\n...",
    "hints": ["Check the base image", "Add EXPOSE directive"],
    "solution": "FROM node:20-alpine\n..."
  }
}
```

### 4. Code Exercise (Python/Bash)
```json
{
  "content_type": "code_exercise",
  "content_data": {
    "language": "python|bash|javascript|go",
    "instructions": "Write a function that...",
    "starter_code": "def solution():\n    pass",
    "test_cases": [
      {"input": "hello", "expected_output": "HELLO"},
      {"input": "world", "expected_output": "WORLD"}
    ],
    "solution_code": "def solution(s):\n    return s.upper()"
  }
}
```

### 5. Language Exercise (English/Russian)
```json
{
  "content_type": "language_exercise",
  "content_data": {
    "exercise_type": "grammar|vocabulary|listening|speaking|writing",
    "difficulty": "A1|A2|B1|B2|C1|C2",
    "instructions": "Fill in the blanks with correct verb forms",
    "content": {
      "text": "She ___ (go) to the market yesterday.",
      "audio_url": "https://...",
      "image_url": "https://..."
    },
    "answer_type": "multiple_choice|fill_in_blank|essay|speaking_recording",
    "correct_answers": ["went"],
    "explanations": "Simple past tense is used for completed actions."
  }
}
```

### 6. Quiz Questions
```json
{
  "content_type": "quiz",
  "content_data": {
    "questions": [
      {
        "id": 1,
        "question": "What is the default Docker network driver?",
        "type": "single_choice|multiple_choice|true_false",
        "options": [
          {"id": "a", "text": "bridge", "is_correct": true},
          {"id": "b", "text": "host", "is_correct": false},
          {"id": "c", "text": "overlay", "is_correct": false},
          {"id": "d", "text": "none", "is_correct": false}
        ],
        "explanation": "The bridge driver is the default...",
        "points": 10
      }
    ],
    "passing_score": 70,
    "time_limit_minutes": 30
  }
}
```

## Course Examples

### Example 1: Docker Course Structure
```
Course: Docker Mastery
├── Module 1: Docker Basics
│   ├── Theory: What is Docker?
│   ├── Video: Docker Architecture Explained
│   ├── Lab: Install Docker & Run First Container
│   ├── Quiz: Docker Fundamentals
├── Module 2: Docker Images
│   ├── Theory: Understanding Images & Layers
│   ├── Lab: Build Custom Dockerfile
│   ├── Lab: Multi-stage Builds
│   ├── Exercise: Optimize Image Size
├── Module 3: Docker Networking
│   ├── Theory: Network Drivers
│   ├── Lab: Create Custom Network
│   ├── Lab: Container Communication
├── Module 4: Docker Volumes
│   ├── Theory: Data Persistence
│   ├── Lab: Named Volumes & Bind Mounts
├── Module 5: Docker Compose
│   ├── Theory: Orchestrating Multi-Container Apps
│   ├── Lab: Build Full-Stack App with Compose
│   ├── Project: Deploy WordPress with MySQL
```

### Example 2: English Language Course
```
Course: English for IELTS (Band 7+)
├── Module 1: Speaking
│   ├── Theory: IELTS Speaking Format
│   ├── Video: Common Topics & Strategies
│   ├── Exercise: Part 1 - Introduction Questions
│   ├── Exercise: Part 2 - Cue Card Practice
│   ├── Exercise: Part 3 - Discussion Questions
├── Module 2: Writing Task 1
│   ├── Theory: Describing Charts & Graphs
│   ├── Exercise: Line Graph Analysis
│   ├── Exercise: Bar Chart Description
│   ├── Exercise: Process Diagram
├── Module 3: Writing Task 2
│   ├── Theory: Essay Structure (Opinion, Discussion, Problem-Solution)
│   ├── Exercise: Opinion Essay Practice
│   ├── Exercise: Advantages/Disadvantages Essay
├── Module 4: Reading
│   ├── Theory: Reading Strategies & Question Types
│   ├── Exercise: True/False/Not Given
│   ├── Exercise: Matching Headings
│   ├── Practice Test: Academic Reading
├── Module 5: Listening
│   ├── Theory: Listening Strategies
│   ├── Exercise: Section 1 - Everyday Conversations
│   ├── Exercise: Section 4 - Academic Lectures
```

### Example 3: Kubernetes Course
```
Course: Kubernetes for DevOps Engineers (CKAD Prep)
├── Module 1: Kubernetes Architecture
│   ├── Theory: Control Plane & Worker Nodes
│   ├── Video: K8s Components Overview
│   ├── Lab: Setup Minikube/Kind Cluster
├── Module 2: Pods & Workloads
│   ├── Theory: Pods, ReplicaSets, Deployments
│   ├── Lab: Deploy First Application
│   ├── Lab: Rolling Updates & Rollbacks
│   ├── Quiz: Workload Controllers
├── Module 3: Services & Networking
│   ├── Theory: ClusterIP, NodePort, LoadBalancer
│   ├── Lab: Expose Application with Service
│   ├── Lab: Ingress Controller Setup
├── Module 4: ConfigMaps & Secrets
│   ├── Theory: Configuration Management
│   ├── Lab: Inject Config with ConfigMap
│   ├── Lab: Manage Secrets Securely
├── Module 5: Persistent Storage
│   ├── Theory: PVs, PVCs, Storage Classes
│   ├── Lab: Deploy StatefulSet with Storage
├── Module 6: CKAD Exam Prep
│   ├── Practice Exam 1
│   ├── Practice Exam 2
│   ├── Time-based Challenge Tasks
```

## API Updates

### New Endpoints

```
# Course Categories
GET    /api/v1/categories                    - List all categories
GET    /api/v1/categories/:id                - Category details

# Courses
GET    /api/v1/courses                       - List all courses (filter by category, difficulty, language)
GET    /api/v1/courses/:slug                 - Course details with modules
POST   /api/v1/courses                       - Create course (admin/instructor)
PUT    /api/v1/courses/:id                   - Update course
DELETE /api/v1/courses/:id                   - Delete course

# Course Enrollment
POST   /api/v1/courses/:id/enroll            - Enroll in course
GET    /api/v1/my-courses                    - My enrolled courses
GET    /api/v1/my-courses/:id/progress       - Course progress

# Lessons
GET    /api/v1/courses/:courseId/lessons     - All lessons in course
GET    /api/v1/lessons/:id                   - Lesson content
POST   /api/v1/lessons/:id/complete          - Mark lesson complete
POST   /api/v1/lessons/:id/submit            - Submit exercise/quiz

# Reviews
GET    /api/v1/courses/:id/reviews           - Course reviews
POST   /api/v1/courses/:id/reviews           - Add review
PUT    /api/v1/reviews/:id                   - Update review
DELETE /api/v1/reviews/:id                   - Delete review

# Achievements
GET    /api/v1/achievements                  - All achievements
GET    /api/v1/my-achievements               - User's unlocked achievements

# Admin
GET    /api/v1/admin/courses                 - Manage all courses
GET    /api/v1/admin/users                   - Manage users
GET    /api/v1/admin/analytics               - Platform analytics
```

## Frontend Updates

### New Pages/Routes

```javascript
// Public
/                                  - Home (Course Catalog)
/courses                           - All Courses
/courses/certifications            - Certification Courses
/courses/devops                    - DevOps Courses
/courses/languages                 - Language Courses
/course/:slug                      - Course Details Page
/course/:slug/module/:moduleId     - Module Page
/course/:slug/lesson/:lessonId     - Lesson Page

// User Dashboard
/dashboard                         - My Learning Dashboard
/my-courses                        - Enrolled Courses
/my-progress                       - Progress Analytics
/my-achievements                   - Achievements & Badges
/profile                           - Profile Settings

// Instructor (Future)
/instructor/dashboard              - Instructor Dashboard
/instructor/courses/new            - Create New Course
/instructor/courses/:id/edit       - Edit Course
/instructor/analytics              - Course Analytics

// Admin
/admin                             - Admin Dashboard
/admin/courses                     - Manage Courses
/admin/users                       - Manage Users
/admin/content                     - Content Management
```

### Updated Components

```
components/
├── course/
│   ├── CourseCard.jsx             - Course card in catalog
│   ├── CourseGrid.jsx             - Course grid layout
│   ├── CourseDetails.jsx          - Full course info
│   ├── EnrollButton.jsx           - Enroll/Access button
│   ├── CourseProgress.jsx         - Progress bar/stats
├── lesson/
│   ├── LessonContent.jsx          - Polymorphic content renderer
│   ├── VideoPlayer.jsx            - Video lesson player
│   ├── MarkdownRenderer.jsx       - Theory content
│   ├── InteractiveLab.jsx         - Docker/K8s labs
│   ├── CodeEditor.jsx             - Code exercises
│   ├── QuizInterface.jsx          - Quiz component
│   ├── LanguageExercise.jsx       - Language exercises
├── dashboard/
│   ├── LearningStats.jsx          - XP, streaks, hours
│   ├── CourseList.jsx             - Enrolled courses
│   ├── AchievementBadges.jsx      - Unlocked achievements
├── admin/
│   ├── CourseManager.jsx          - Course CRUD
│   ├── ContentEditor.jsx          - Rich content editor
│   ├── UserManager.jsx            - User management
```

## Migration Path

### Phase 1: Database Migration (Week 1-2)
1. Create new tables (categories, courses, course_modules)
2. Migrate existing LFCS data to new schema
3. Keep old tables for backward compatibility initially

### Phase 2: API Expansion (Week 3-4)
1. Implement new course/enrollment endpoints
2. Update existing module endpoints to support new schema
3. Add admin endpoints for course management

### Phase 3: Frontend Refactor (Week 5-6)
1. Create course catalog page
2. Update lesson components to handle all content types
3. Build dashboard and progress pages

### Phase 4: Content Creation (Week 7-12)
1. **Docker Course** - 40 lessons, 15 hours
2. **Kubernetes Course** - 60 lessons, 25 hours
3. **English IELTS** - 100 lessons, 40 hours
4. **CI/CD Course** - 30 lessons, 12 hours

### Phase 5: Advanced Features (Week 13+)
1. Video hosting integration (YouTube/Vimeo)
2. Interactive lab environments (Docker-in-Docker, K8s sandbox)
3. Code execution sandbox
4. Speech recognition for language learning
5. Certificate generation
6. Payment integration

## Gamification & Engagement

### XP System
- **Watch Video:** 10 XP
- **Complete Theory:** 20 XP
- **Complete Lab:** 50 XP
- **Pass Quiz:** 30-100 XP (based on score)
- **Complete Module:** 200 XP
- **Complete Course:** 1000 XP
- **Daily Login Streak:** +10 XP/day

### Achievement Examples
- **First Steps:** Complete first lesson
- **Week Warrior:** 7-day streak
- **Docker Master:** Complete Docker course with 90%+ score
- **Polyglot:** Enroll in 2+ language courses
- **Speed Learner:** Complete course in < 50% estimated time
- **Perfect Score:** Get 100% on 5 quizzes
- **Lab Expert:** Complete 50 labs

### Leaderboards
- **Global XP:** All users
- **Course-specific:** Per course leaderboard
- **Weekly/Monthly:** Time-based rankings
- **Category Leaders:** Top learners per category

## Monetization Options

### Free Tier
- 3 free courses (LFCS basics, Docker intro, English A1)
- All theory content
- Limited quizzes (3 per course)

### Premium ($19/month)
- Unlimited access to all courses
- All labs and exercises
- Certificate of completion
- Priority support

### Pro ($49/month)
- Premium + Instructor-led sessions
- Code review
- Career guidance
- Job board access

### One-time Course Purchase
- Individual courses: $49-$199
- Certification bundles: $299

## Technical Stack

### Backend
- Node.js 20 + Express
- PostgreSQL 16 (primary DB)
- Redis 7 (cache + sessions)
- MinIO/S3 (video/file storage)
- RabbitMQ (async jobs - video processing)

### Frontend
- React 19 + Vite
- TailwindCSS
- Monaco Editor (code exercises)
- Video.js (video player)
- WebRTC (speaking exercises for languages)

### DevOps
- Docker + Docker Compose
- Kubernetes (production)
- GitHub Actions (CI/CD)
- Prometheus + Grafana (monitoring)

### Third-party Services
- **Video:** YouTube API / Vimeo
- **Email:** SendGrid / AWS SES
- **Payment:** Stripe
- **Analytics:** Mixpanel / PostHog
- **Search:** Elasticsearch / Algolia

## Security Considerations

1. **Content Security:** Rate limiting, CAPTCHA for exercises
2. **Lab Isolation:** Sandboxed Docker containers with resource limits
3. **Code Execution:** Secure sandbox (firecracker, gVisor)
4. **Payment:** PCI compliance via Stripe
5. **GDPR:** User data export/delete

## Success Metrics

- **User Engagement:** DAU/MAU ratio > 30%
- **Course Completion:** > 40% completion rate
- **User Retention:** 60% monthly retention
- **Revenue:** $10k MRR in 6 months
- **Content:** 20+ courses, 1000+ lessons in year 1

## Next Steps

1. ✅ Fix Docker build (package-lock.json)
2. 📋 Review and approve this architecture
3. 🗄️ Create database migration scripts
4. 🔧 Update API for multi-course support
5. 🎨 Design new UI for course catalog
6. 📝 Start creating Docker course content
7. 🎬 Plan video content production
8. 🚀 Beta launch with 3 courses

---

**Created:** 2026-01-30
**Last Updated:** 2026-01-30
**Status:** Planning Phase
