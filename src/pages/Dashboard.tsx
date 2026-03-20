import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GenieMascot } from '../components/GenieMascot';
import { useStore } from '../store/useStore';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export const Dashboard = () => {
    const analytics = useStore(state => state.analytics);
    const quizTopics = useStore(state => state.quizTopics);
    const [weakTopics, setWeakTopics] = useState<Array<{ topic: string; accuracy: number; attempts_count: number }>>([]);

    useEffect(() => {
        const fetchWeakTopics = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    const res = await fetch(`${API_BASE_URL}/analytics/weak-topics`, {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`
                        }
                    });
                    const data = await res.json();
                    setWeakTopics(data.weak_topics || []);
                } catch (err) {
                    console.error("Failed to fetch analytics:", err);
                }
            }
        };
        fetchWeakTopics();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div
                    className="p-6 rounded-2xl shadow-sm border border-transparent max-w-lg relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        boxShadow: '0 10px 30px rgba(59,130,246,0.4)'
                    }}
                >
                    <div className="absolute top-0 right-0 p-4">
                         <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30 truncate">
                             Lv. {analytics.level} Scholar
                         </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white pr-20">Welcome to StudyGenie</h1>
                    <p className="mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>Your AI-Powered Learning Assistant is ready.</p>
                </div>
                <div className="hidden sm:block">
                    <GenieMascot className="w-24 h-24" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card glow={true} id="tour-goal">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Level {analytics.level} Progress</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {analytics.xp} / {analytics.xpToNextLevel} XP towards your next rank!
                    </p>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-[0_0_10px_var(--mascot-glow)] transition-all duration-500" style={{ width: `${Math.min((analytics.xp / analytics.xpToNextLevel) * 100, 100)}%` }}></div>
                    </div>
                </Card>

                <Card id="tour-quizzes">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Practice Quizzes</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {quizTopics.length > 0 ? 'Pick up where you left off or start a new topic.' : 'Generate your first personalized pattern-matching quiz.'}
                    </p>
                    <Link to="/quizzes">
                        <Button variant={quizTopics.length > 0 ? "secondary" : "glow"} className="w-full">
                            {quizTopics.length > 0 ? 'Continue Practicing' : 'Generate Quiz'}
                        </Button>
                    </Link>
                </Card>

                <Card id="tour-chat">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI Tutor</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Stuck on a topic? Ask the Genie for help instantly.</p>
                    <Link to="/chat">
                        <Button variant="primary" className="w-full">Open Chat</Button>
                    </Link>
                </Card>
            </div>

            {weakTopics.length > 0 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></span>
                        Topics Needing Focus
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {weakTopics.map((item, i) => (
                            <Card key={i} className="flex items-center justify-between p-4 border-red-500/10 hover:border-red-500/30 transition-all bg-red-500/5 group cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)] text-sm group-hover:text-red-400 transition-colors">{item.topic}</h4>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">{item.attempts_count} quiz attempts</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-red-400">{item.accuracy}%</span>
                                    <p className="text-[10px] text-red-500/50 uppercase font-black tracking-wider">Accuracy</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
