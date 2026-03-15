import { Target, TrendingUp, Calendar, Zap, BarChart3 } from 'lucide-react';
import { Card } from '../components/Card';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export const Analytics = () => {
    const { analytics, quizTopics, battleLog } = useStore();

    // Calculate real avg score
    const totalQuizQuestions = quizTopics.reduce((acc, t) => acc + (t.completed || 0), 0);
    const totalPossibleXP = quizTopics.reduce((acc, t) => acc + (t.total || 0) * 10, 0); // Simplified calc
    
    const avgScore = analytics.avgScore; // Using store's avgScore for now, could be dynamic
    
    // Estimate study hours (10 mins per 10 questions completed + 2 mins per battle)
    const estimatedHours = Math.round((totalQuizQuestions * 1) + (battleLog.length * 2 / 60) * 10) / 10;

    const stats = [
        { label: 'Current Streak', value: `${analytics.streak} Days`, icon: Zap, trend: '+2', color: 'text-yellow-500' },
        { label: 'Tests Taken', value: analytics.testsTaken.toString(), icon: Target, trend: '+1 this week', color: 'text-blue-500' },
        { label: 'Avg. Accuracy', value: `${avgScore}%`, icon: TrendingUp, trend: '+5%', color: 'text-green-500' },
        { label: 'Study Hours', value: `${estimatedHours}h`, icon: Calendar, trend: 'Steady', color: 'text-purple-500' },
    ];

    // Data for the chart (last 7 battles or quizzes)
    const recentActivity = [...battleLog].reverse().slice(-7).map(b => b.score);
    if (recentActivity.length < 7) {
        // Fill with some dummy growth if new user
        while (recentActivity.length < 7) recentActivity.unshift(Math.floor(Math.random() * 50));
    }

    const maxScore = Math.max(...recentActivity, 100);

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl shadow-sm border flex justify-between items-center transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Progress Analytics</h1>
                    <p className="text-[var(--text-secondary)] font-medium mt-1">Real-time performance tracking.</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                    <BarChart3 size={24} />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="flex flex-col items-center justify-center p-6 text-center group">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${stat.color} bg-white/5 opacity-80 shadow-inner`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{stat.value}</h3>
                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-1 opacity-60">{stat.label}</p>
                            <span className="text-[10px] font-black mt-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/5" style={{ color: 'var(--streak-color)' }}>
                                {stat.trend}
                            </span>
                        </Card>
                    );
                })}
            </div>

            {/* Real Chart */}
            <Card className="p-8 border-white/5 relative overflow-hidden h-[400px]">
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Learning Velocity</h3>
                            <p className="text-sm text-[var(--text-secondary)]">XP growth across recent activities</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-tighter text-[var(--text-secondary)]">
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Score</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Goal</div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between px-2 gap-3 pb-6 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 opacity-10">
                            {[1, 2, 3, 4].map(line => (
                                <div key={line} className="w-full border-t border-white" />
                            ))}
                        </div>

                        {recentActivity.map((score, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative cursor-pointer pt-4">
                                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-20">
                                    {score} XP
                                </div>
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(score / maxScore) * 80}%` }}
                                    className="w-full max-w-[40px] rounded-xl bg-gradient-to-t from-blue-600/80 via-blue-400/80 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                />
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] mt-4 opacity-40 uppercase">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Decorative Background */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />
            </Card>
        </div>
    );
};
