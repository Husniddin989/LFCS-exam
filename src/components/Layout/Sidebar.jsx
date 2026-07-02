import { NavLink, useLocation } from 'react-router-dom';
import {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award,
  Home, Trophy,
  ChevronDown, ChevronRight,
  CheckCircle2, Circle, X
} from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { modules } from '../../data/modules';

const iconMap = {
  Terminal, Users, Cpu, Network, HardDrive, Package,
  FileText, Shield, Code, Database, Box, Award
};

export default function Sidebar({ open = false, onClose }) {
  const location = useLocation();
  const { progress, getModuleProgress } = useProgress();
  const [expandedModule, setExpandedModule] = useState(null);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <aside
      className={`w-72 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 z-50 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Terminal size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">LFCS Platform</h1>
            <p className="text-xs text-slate-500">Linux Mastery</p>
          </div>
        </NavLink>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-slate-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* User Progress */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Progress</span>
            <span className="text-sm font-medium text-green-400">
              {progress.completedLessons.length} lessons
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min((progress.completedLessons.length / 50) * 100, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-yellow-500" />
              <span className="text-xs text-slate-400">{progress.totalXP} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs text-slate-400">
                {Object.keys(progress.completedQuizzes).length} quizzes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto min-h-0">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link mb-2 ${isActive ? 'active' : ''}`
          }
        >
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <div className="mt-6 mb-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
            Modules
          </h3>
        </div>

        <div className="space-y-1">
          {modules.map((module) => {
            const Icon = iconMap[module.icon] || Terminal;
            const moduleProgress = module.lessons?.length
              ? getModuleProgress(module.id, module.lessons.length)
              : 0;
            const isExpanded = expandedModule === module.id;
            const isActive = location.pathname.includes(`/module/${module.id}`);

            return (
              <div key={module.id}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`sidebar-link w-full justify-between ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium truncate max-w-[140px]">
                        {module.id}. {module.title.split(' ')[0]}
                      </div>
                      {moduleProgress > 0 && (
                        <div className="text-xs text-slate-500">{moduleProgress}%</div>
                      )}
                    </div>
                  </div>
                  {module.lessons?.length > 0 && (
                    isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                  )}
                </button>

                {/* Lessons dropdown */}
                {isExpanded && module.lessons?.length > 0 && (
                  <div className="ml-11 mt-1 space-y-1 border-l border-slate-700 pl-3">
                    {module.lessons.map((lesson) => {
                      const isCompleted = progress.completedLessons.includes(
                        `${module.id}-${lesson.id}`
                      );
                      return (
                        <NavLink
                          key={lesson.id}
                          to={`/module/${module.id}/lesson/${lesson.id}`}
                          className={({ isActive }) =>
                            `flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`
                          }
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle size={14} className="flex-shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2 flex-shrink-0">
        <NavLink
          to="/terminal"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 border rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-500/20 border-emerald-500/50'
                : 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30 hover:border-emerald-500/50'
            }`
          }
        >
          <Terminal size={20} className="text-emerald-400" />
          <div>
            <div className="text-sm font-medium text-emerald-400">Real Terminal</div>
            <div className="text-xs text-slate-500">v86 Linux VM</div>
          </div>
        </NavLink>

        <NavLink
          to="/exam"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 border rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-500/30 border-amber-500/50'
                : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30 hover:border-amber-500/50'
            }`
          }
        >
          <Award size={20} className="text-amber-500" />
          <div>
            <div className="text-sm font-medium text-amber-400">LFCS Exam</div>
            <div className="text-xs text-slate-500">Practice Test</div>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}
