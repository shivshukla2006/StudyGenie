import { Settings, Bell, Shield, LogOut, Trophy, Swords, Zap, CheckCircle2, Lock, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${checked ? 'bg-blue-500' : 'bg-white/10'}`}
    >
        <motion.div
            layout
            className="w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: checked ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

export const Profile = () => {
    const { analytics, achievements, battleLog, savedNotes, messages, profileDetails } = useStore();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [activeModal, setActiveModal] = useState<'notifications' | 'privacy' | 'account' | null>(null);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushAlerts, setPushAlerts] = useState(true);
    const [studyReminders, setStudyReminders] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const sections = [
        { 
            icon: isDarkMode ? Moon : Sun, 
            label: 'Appearance', 
            desc: `Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`,
            action: toggleTheme
        },
        { 
            icon: Bell, 
            label: 'Notifications', 
            desc: 'Configure alert preferences',
            action: () => setActiveModal('notifications')
        },
        { 
            icon: Shield, 
            label: 'Privacy & Security', 
            desc: 'Secure your StudyGenie data',
            action: () => setActiveModal('privacy')
        },
        { 
            icon: Settings, 
            label: 'Account Settings', 
            desc: 'Manage your profile and data',
            action: () => setActiveModal('account')
        },
    ];

    const stats = [
        { label: 'Battles', value: battleLog.length },
        { label: 'Saved Notes', value: savedNotes.length },
        { label: 'Chat History', value: messages.length },
    ];

    return (
        <div className="space-y-10 max-w-4xl mx-auto pb-20">
            {/* Header / User Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl flex items-center justify-center shrink-0 border-4 border-[var(--card-border)] relative rotate-3">
                    <span className="text-white font-black text-5xl">S</span>
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-2xl shadow-lg border-4 border-[#0F172A]"
                    >
                        LV. {analytics.level}
                    </motion.div>
                </div>
                
                <div className="text-center sm:text-left flex-1 w-full pt-2">
                    <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Scholar Explorer</h1>
                    <p className="mt-1 font-medium flex items-center justify-center sm:justify-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <Zap size={16} className="text-yellow-500" />
                        Master Guardian • Member since 2026
                    </p>
                    
                    <div className="mt-6 max-w-md">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-blue-400">
                            <span>{analytics.xp} XP</span>
                            <span>{analytics.xpToNextLevel} XP TOTAL</span>
                        </div>
                        <div className="w-full h-3 rounded-full overflow-hidden bg-white/5 border border-white/5 shadow-inner p-0.5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(analytics.xp / analytics.xpToNextLevel) * 100}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-400 rounded-full" 
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center sm:text-left">
                                <p className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Trophy className="text-yellow-500" size={20} />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Achievements</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {achievements.map((achievement) => (
                        <Card 
                            key={achievement.id} 
                            className={`relative overflow-hidden p-6 border transition-all ${achievement.unlockedAt ? 'border-yellow-500/30 bg-yellow-500/5 shadow-lg shadow-yellow-500/5' : 'border-white/5 opacity-60 grayscale'}`}
                        >
                            <div className="text-4xl mb-3">{achievement.icon}</div>
                            <h3 className="font-bold text-[var(--text-primary)] text-sm">{achievement.title}</h3>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{achievement.description}</p>
                            
                            {achievement.unlockedAt ? (
                                <div className="absolute top-2 right-2 text-yellow-500">
                                    <CheckCircle2 size={16} fill="currentColor" className="text-yellow-500/20" />
                                </div>
                            ) : (
                                <div className="absolute top-2 right-2 text-white/20">
                                    <Lock size={14} />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Battle Logs */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Swords className="text-blue-500" size={20} />
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Battle History</h2>
                    </div>
                    <div className="space-y-3">
                        {battleLog.length > 0 ? (
                            battleLog.slice(0, 5).map((battle) => (
                                <Card key={battle.id} className="flex items-center justify-between p-4 border-white/5 bg-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${battle.outcome === 'victory' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {battle.outcome === 'victory' ? 'W' : 'L'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">vs {battle.opponentName}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">{new Date(battle.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[var(--text-primary)]">{battle.score} - {battle.opponentScore}</p>
                                        <p className={`text-[10px] font-bold uppercase ${battle.outcome === 'victory' ? 'text-green-500' : 'text-red-500'}`}>
                                            {battle.outcome}
                                        </p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-8 text-center border-dashed border-white/10 bg-transparent">
                                <p className="text-sm text-[var(--text-secondary)]">No battles fought yet. Go to Arena!</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Settings className="text-purple-500" size={20} />
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
                    </div>
                    <div className="space-y-3">
                        {sections.map((section, i) => {
                            const Icon = section.icon;
                            return (
                                <Card 
                                    key={i} 
                                    className="flex items-center gap-4 cursor-pointer hover:border-[var(--btn-primary)] transition-all bg-white/5 border-white/5"
                                    onClick={section.action}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--btn-primary)' }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{section.label}</h3>
                                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{section.desc}</p>
                                    </div>
                                </Card>
                            );
                        })}

                        <Button 
                            variant="ghost" 
                            className="w-full mt-4 text-red-500 hover:bg-red-500/10 h-12"
                            onClick={handleSignOut}
                        >
                            <LogOut size={18} className="mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
            <Modal isOpen={activeModal === 'notifications'} onClose={() => setActiveModal(null)} title="Notifications">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: 'var(--sidebar-active-bg)', borderColor: 'var(--card-border)' }}>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Email Alerts</p>
                            <p className="text-xs text-[var(--text-secondary)]">Weekly progress reports</p>
                        </div>
                        <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: 'var(--sidebar-active-bg)', borderColor: 'var(--card-border)' }}>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Push Alerts</p>
                            <p className="text-xs text-[var(--text-secondary)]">Instant app updates</p>
                        </div>
                        <Toggle checked={pushAlerts} onChange={setPushAlerts} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: 'var(--sidebar-active-bg)', borderColor: 'var(--card-border)' }}>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Study Reminders</p>
                            <p className="text-xs text-[var(--text-secondary)]">Daily nudges to keep your streak</p>
                        </div>
                        <Toggle checked={studyReminders} onChange={setStudyReminders} />
                    </div>
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy & Security">
                <div className="space-y-4">
                    <Button variant="secondary" className="w-full justify-start border-[var(--card-border)]" style={{ color: 'var(--btn-text)', backgroundColor: 'var(--btn-primary)' }} onClick={() => { alert('Password reset link sent to your email!'); setActiveModal(null); }}>
                        <Lock size={18} className="mr-2" />
                        Change Password
                    </Button>
                    <div className="flex items-center justify-between p-4 rounded-xl border mt-4" style={{ backgroundColor: 'var(--sidebar-active-bg)', borderColor: 'var(--card-border)' }}>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Data Sharing</p>
                            <p className="text-xs text-[var(--text-secondary)]">Help improve AI models</p>
                        </div>
                        <Toggle checked={true} onChange={() => {}} />
                    </div>
                </div>
            </Modal>

            <Modal isOpen={activeModal === 'account'} onClose={() => setActiveModal(null)} title="Account Settings">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--sidebar-active-bg)', borderColor: 'var(--card-border)' }}>
                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">User Type</span>
                            <span className="font-bold text-sm bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full">{profileDetails?.userType || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">Academic Path</span>
                            <span className="font-bold text-sm bg-purple-500/20 text-purple-500 px-3 py-1 rounded-full">{profileDetails?.academicPath || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--card-border)' }}>
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">Goals</span>
                            <span className="font-bold text-sm text-right max-w-[60%] text-[var(--text-primary)]">{profileDetails?.goals?.join(', ') || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-[var(--text-secondary)]">Weak Subjects</span>
                            <span className="font-bold text-sm text-right max-w-[60%] text-red-500">{profileDetails?.weakSubjects?.join(', ') || 'Not set'}</span>
                        </div>
                    </div>
                    <Button variant="primary" className="w-full font-bold" onClick={() => setActiveModal(null)}>Done</Button>
                </div>
            </Modal>
        </div>
    );
};
