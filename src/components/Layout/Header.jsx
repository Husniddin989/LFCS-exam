import { Search, Bell, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';

export default function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { progress } = useProgress();

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 fixed top-0 right-0 left-0 lg:left-72 z-40">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white flex-shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="flex-1 min-w-0 max-w-xl">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search modules, commands, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400 hidden sm:inline">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full">
            <span className="text-yellow-500 font-semibold text-sm">{progress.totalXP}</span>
            <span className="text-yellow-500/70 text-xs">XP</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-slate-200">Student</div>
              <div className="text-xs text-slate-500">LFCS Learner</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
