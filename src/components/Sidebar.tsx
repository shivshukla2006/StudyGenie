import { Home, MessageSquare, BookOpen, BarChart2, User, Swords, Settings, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
    const mainNavItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
        { id: 'chat', icon: MessageSquare, label: 'Genie Chat', path: '/chat' },
        { id: 'notes', icon: FileText, label: 'Smart Notes', path: '/notes' },
        { id: 'quizzes', icon: BookOpen, label: 'Quizzes', path: '/quizzes' },
        { id: 'battles', icon: Swords, label: 'Study Battles', path: '/battles' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics', path: '/analytics' },
    ];

    const preferencesItems = [
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
        { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const renderNavItems = (items: { id: string; icon: any; label: string; path: string }[], isPreferences = false) => (
        <ul className="space-y-1">
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all overflow-hidden ${isActive
                                    ? 'shadow-inner'
                                    : 'hover:bg-white/10'
                                }`
                            }
                            style={({ isActive }) => isActive ? {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderLeft: '3px solid var(--btn-primary)',
                                color: 'white'
                            } : {
                                borderLeft: '3px solid transparent',
                                color: 'var(--text-secondary)',
                                opacity: 0.8
                            }}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={20} className="shrink-0" style={{ color: isActive ? 'var(--sidebar-active-border)' : 'inherit' }} />
                                    <span className="ml-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    {!isPreferences && isActive && (
                                        <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--sidebar-active-border)' }}></div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside className="group h-full flex flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl transition-[width,background-color] duration-300 ease-in-out w-full lg:w-20 lg:hover:w-64 overflow-hidden z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.3)]">
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
                <nav className="flex-1 space-y-8">
                    <div>
                        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Menu
                        </h3>
                        {renderNavItems(mainNavItems)}
                    </div>
                </nav>

                <div className="mt-8">
                    {renderNavItems(preferencesItems, true)}
                </div>
            </div>
        </aside>
    );
};
