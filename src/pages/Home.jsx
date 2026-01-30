import { Link } from 'react-router-dom';
import {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award,
  Clock, BookOpen, Trophy, TrendingUp, Play, CheckCircle2,
  ArrowRight, Zap
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { modules, examDomains } from '../data/modules';

const iconMap = {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award
};

export default function Home() {
  const { progress, getModuleProgress } = useProgress();

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessons = progress.completedLessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto fade-in">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Xush kelibsiz, LFCS Tayyorgarlik Platformasiga!
        </h1>
        <p className="text-slate-400">
          Linux Foundation Certified System Administrator sertifikatiga tayyorlaning
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-blue-400" />
            </div>
            <span className="text-xs text-slate-500">Progress</span>
          </div>
          <div className="text-2xl font-bold text-white">{completedLessons}/{totalLessons}</div>
          <div className="text-sm text-slate-400">Darslar tugallangan</div>
          <div className="mt-3 progress-bar">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Trophy size={20} className="text-yellow-400" />
            </div>
            <span className="text-xs text-slate-500">Points</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.totalXP}</div>
          <div className="text-sm text-slate-400">XP yig'ilgan</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <span className="text-xs text-slate-500">Quizzes</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {Object.keys(progress.completedQuizzes).length}
          </div>
          <div className="text-sm text-slate-400">Quiz tugallangan</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-purple-400" />
            </div>
            <span className="text-xs text-slate-500">Labs</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.completedLabs.length}</div>
          <div className="text-sm text-slate-400">Lab tugallangan</div>
        </div>
      </div>

      {/* LFCS Exam Domains */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Award size={24} className="text-amber-500" />
          LFCS Exam Domains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examDomains.map((domain, idx) => (
            <div
              key={idx}
              className="bg-slate-800/30 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">{domain.name}</span>
                <span className="text-lg font-bold text-amber-400">{domain.weight}%</span>
              </div>
              <div className="progress-bar h-2">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded"
                  style={{ width: `${domain.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">O'quv Modullari</h2>
          <span className="text-sm text-slate-400">{modules.length} modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = iconMap[module.icon] || Terminal;
            const lessonCount = module.lessons?.length || 0;
            const moduleProgress = lessonCount > 0
              ? getModuleProgress(module.id, lessonCount)
              : 0;
            const isAvailable = module.lessons?.length > 0;

            return (
              <Link
                key={module.id}
                to={isAvailable ? `/module/${module.id}` : '#'}
                className={`group bg-slate-800/50 border border-slate-700 rounded-xl p-5 transition-all ${
                  isAvailable
                    ? 'hover:border-slate-600 hover:bg-slate-800/70 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                      {module.examWeight}
                    </span>
                    {!isAvailable && (
                      <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
                        Tez kunda
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {module.id}. {module.title}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {module.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {lessonCount} lessons
                    </span>
                  </div>
                </div>

                {moduleProgress > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-green-400">{moduleProgress}%</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {isAvailable && moduleProgress === 0 && (
                  <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm group-hover:gap-3 transition-all">
                    <Play size={16} />
                    <span>Boshlash</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              LFCS imtihoniga tayyor bo'lish uchun
            </h3>
            <p className="text-slate-400 text-sm">
              Barcha modullarni ketma-ket o'rganing, lablarni bajaring, va quiz'lardan o'ting.
              Real exam formatidagi tasklar bilan mashq qiling.
            </p>
          </div>
          <Link
            to="/module/1"
            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Play size={18} />
            Birinchi modulni boshlash
          </Link>
        </div>
      </div>
    </div>
  );
}
