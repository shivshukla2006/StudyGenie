import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { GenieMascot } from './GenieMascot';

export const Layout = ({ children }: { children: ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div 
            className="flex flex-col h-[100dvh] w-full overflow-hidden transition-colors duration-300 bg-cover bg-center bg-no-repeat bg-fixed relative" 
            style={{ backgroundImage: `url('/auth-bg.png')`, color: 'var(--text-primary)' }}
        >
            <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[2px] pointer-events-none z-0" />
            <div className="flex flex-col h-full w-full relative z-10">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                <div className="hidden lg:block h-full">
                    <Sidebar />
                </div>

                <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0">
                    <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>

                <MobileNav />

                {/* Floating Chatbot Button */}
                {location.pathname !== '/chat' && (
                    <Link to="/chat" className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-50">
                        <GenieMascot pose="button" />
                    </Link>
                )}
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-64 transition-colors duration-300" style={{ backgroundColor: 'var(--sidebar-bg)' }} onClick={e => e.stopPropagation()}>
                        <Sidebar />
                    </div>
                </div>
            )}
        </div>
    );
};
