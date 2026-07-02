import { useParams, Link } from 'react-router-dom';
import {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award,
  Clock, BookOpen, Play, CheckCircle2,
  ArrowLeft, ArrowRight, ChevronRight, Beaker, HelpCircle,
  ClipboardList
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { modules } from '../data/modules';

const iconMap = {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award
};

const lessonTypeIcons = {
  theory: BookOpen,
  lab: Beaker,
  quiz: HelpCircle,
  exam: ClipboardList
};

const lessonTypeColors = {
  theory: 'text-blue-400 bg-blue-500/20',
  lab: 'text-green-400 bg-green-500/20',
  quiz: 'text-purple-400 bg-purple-500/20',
  exam: 'text-amber-400 bg-amber-500/20'
};

const lessonTypeLabels = {
  theory: 'Nazariya',
  lab: 'Amaliy Lab',
  quiz: 'Quiz',
  exam: 'Exam Task'
};

export default function Module() {
  const { moduleId } = useParams();
  const { progress, getModuleProgress, isLessonCompleted } = useProgress();

  const module = modules.find(m => m.id === parseInt(moduleId));
  const currentModuleIndex = modules.findIndex(m => m.id === parseInt(moduleId));
  const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null;

  if (!module) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Modul topilmadi</h1>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const Icon = iconMap[module.icon] || Terminal;
  const lessonCount = module.lessons?.length || 0;
  const moduleProgress = lessonCount > 0 ? getModuleProgress(module.id, lessonCount) : 0;
  const completedCount = progress.completedLessons.filter(
    key => key.startsWith(`${module.id}-`)
  ).length;

  // Find first incomplete lesson
  const firstIncompleteLesson = module.lessons?.find(
    lesson => !isLessonCompleted(module.id, lesson.id)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto fade-in">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Barcha modullar</span>
      </Link>

      {/* Module Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
            <Icon size={40} className="text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm px-3 py-1 bg-slate-700 rounded-full text-slate-300">
                Module {module.id}
              </span>
              <span className="text-sm px-3 py-1 bg-amber-500/20 rounded-full text-amber-400">
                Exam: {module.examWeight}
              </span>
              <span className="text-sm px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">
                {module.difficulty}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
            <p className="text-slate-400">{module.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{moduleProgress}%</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock size={14} />
              <span>{module.duration}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">{completedCount} / {lessonCount} darslar tugallangan</span>
            <span className="text-green-400">{moduleProgress}%</span>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-bar-fill" style={{ width: `${moduleProgress}%` }} />
          </div>
        </div>

        {/* Start/Continue button */}
        {firstIncompleteLesson && (
          <Link
            to={`/module/${module.id}/lesson/${firstIncompleteLesson.id}`}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Play size={18} />
            {completedCount > 0 ? 'Davom ettirish' : 'Boshlash'}
          </Link>
        )}
      </div>

      {/* Lessons List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Darslar</h2>

        {module.lessons?.length > 0 ? (
          <div className="space-y-3">
            {module.lessons.map((lesson, idx) => {
              const LessonIcon = lessonTypeIcons[lesson.type] || BookOpen;
              const isCompleted = isLessonCompleted(module.id, lesson.id);
              const isLocked = false; // Could implement prerequisites

              return (
                <Link
                  key={lesson.id}
                  to={`/module/${module.id}/lesson/${lesson.id}`}
                  className={`group flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl transition-all ${
                    isLocked
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                >
                  {/* Lesson number / status */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <span className="font-medium">{idx + 1}</span>
                    )}
                  </div>

                  {/* Lesson info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${lessonTypeColors[lesson.type]}`}>
                        <LessonIcon size={12} />
                        {lessonTypeLabels[lesson.type]}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {lesson.duration}
                      </span>
                    </div>
                    <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                      {lesson.title}
                    </h3>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={20} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 border border-slate-700 rounded-xl">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Tez kunda</h3>
            <p className="text-slate-400">Bu modul ustida ish olib borilmoqda</p>
          </div>
        )}
      </div>

      {/* Module Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        {prevModule ? (
          <Link
            to={`/module/${prevModule.id}`}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <div className="text-left">
              <div className="text-xs text-slate-500">Oldingi modul</div>
              <div className="text-sm">{prevModule.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule && (
          <Link
            to={`/module/${nextModule.id}`}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-slate-500">Keyingi modul</div>
              <div className="text-sm">{nextModule.title}</div>
            </div>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
