import { Home, MessageSquare, BookOpen, BarChart2, User, Swords } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const MobileNav = () => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
        { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/chat' },
        { id: 'quizzes', icon: BookOpen, label: 'Quizzes', path: '/quizzes' },
        { id: 'battles', icon: Swords, label: 'Battles', path: '/battles' },
        { id: 'analytics', icon: BarChart2, label: 'Stats', path: '/analytics' },
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-primary pb-safe lg:hidden">
            <nav className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center space-y-1 w-16 h-full transition-colors ${isActive
                                    ? 'text-white'
                                    : 'text-white/60 hover:text-white/90'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="relative">
                                        <Icon size={24} />
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};
