import { useState, useEffect } from 'react';
import { Bell, Search, User, Menu, Sun, Moon, Zap } from 'lucide-react';
import { Input } from './Input';
import { useStore } from '../store/useStore';

export const Header = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
    const { analytics } = useStore();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const xpProgress = (analytics.xp / analytics.xpToNextLevel) * 100;

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 px-4 backdrop-blur-md sm:px-6 lg:px-8 transition-colors duration-300" style={{ backgroundColor: 'var(--header-bg)', color: 'var(--header-text)' }}>
            <div className="flex items-center gap-4">
                {toggleSidebar && (
                    <button
                        onClick={toggleSidebar}
                        className="block text-white/80 hover:text-white lg:hidden"
                    >
                        <Menu size={24} />
                    </button>
                )}

                {/* Logo */}
                <div className="flex items-center gap-2 mr-4">
                    <div className="relative h-11 w-11 rounded-full border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden flex items-center justify-center animate-float">
                        <img src="/logo_mascot_clean.png" alt="StudyGenie Logo" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-xl font-bold tracking-tight hidden sm:block">
                        <span className="text-white">Study</span>
                        <span className="text-[#3B82F6]">Genie</span>
                    </span>
                </div>

                <div className="hidden lg:block w-64">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                        <Input placeholder="Search topics, notes..." className="pl-10 h-10 border-white/20" />
                    </div>
                </div>
            </div>

            {/* Progress Center (Desktop) */}
            <div className="hidden md:flex flex-col items-center gap-1 flex-1 max-w-xs px-4">
                <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-wider text-blue-300/80">
                    <span>Level {analytics.level}</span>
                    <span>{analytics.xp} / {analytics.xpToNextLevel} XP</span>
                </div>
                <div className="h-2 w-full rounded-full bg-blue-900/40 overflow-hidden border border-white/5 relative">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-400 transition-all duration-500 ease-out"
                        style={{ width: `${xpProgress}%` }}
                    />
                    <div className="absolute top-0 right-0 h-full w-12 bg-white/20 blur-sm -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Mobile Level Badge */}
                <div className="md:hidden flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-lg border border-blue-500/30">
                    <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-blue-200">Lvl {analytics.level}</span>
                </div>

                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="relative rounded-full p-2 hover:bg-white/10 transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="relative rounded-full p-2 hover:bg-white/10 transition-colors">
                    <Bell size={20} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <button className="flex h-8 w-8 overflow-hidden rounded-full border border-white/30 items-center justify-center hover:bg-white/10 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <User size={16} />
                </button>
            </div>
        </header>
    );
};
