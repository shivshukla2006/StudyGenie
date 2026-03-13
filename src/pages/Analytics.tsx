import { Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { useStore } from '../store/useStore';

export const Analytics = () => {
    const analytics = useStore(state => state.analytics);

    const stats = [
        { label: 'Current Streak', value: `${analytics.streak} Days`, icon: Zap, trend: '+2' },
        { label: 'Tests Taken', value: analytics.testsTaken.toString(), icon: Target, trend: '+1 this week' },
        { label: 'Avg. Score', value: `${analytics.avgScore}%`, icon: TrendingUp, trend: '+5%' },
        { label: 'Study Hours', value: `${analytics.studyHours}h`, icon: Calendar, trend: 'Steady' },
    ];

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl shadow-sm border max-w-lg transition-colors duration-300" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Progress Analytics</h1>
                <p className="text-[var(--text-secondary)] font-medium mt-1">Track your consistency and performance.</p>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--chart-primary)] mb-4" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                                <Icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
                            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">{stat.label}</p>
                            <span className="text-xs font-semibold mt-2 px-2 py-0.5 rounded-full" style={{ color: 'var(--streak-color)', backgroundColor: 'var(--sidebar-active-bg)' }}>
                                {stat.trend}
                            </span>
                        </Card>
                    );
                })}
            </div>

            {/* Placeholder for a chart */}
            <Card className="h-64 flex flex-col items-center justify-center border-dashed" style={{ borderColor: 'var(--card-border)' }}>
                <div className="w-3/4 h-32 flex items-end justify-between px-8 gap-4 opacity-80" style={{ borderBottom: '1px solid var(--chart-grid)' }}>
                    <div className="w-full rounded-t-sm" style={{ height: '40%', backgroundColor: 'var(--chart-primary)' }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '70%', backgroundColor: 'var(--chart-secondary)' }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '50%', backgroundColor: 'var(--chart-primary)' }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '90%', backgroundColor: 'var(--chart-secondary)' }}></div>
                    <div className="w-full rounded-t-sm" style={{ height: '80%', backgroundColor: 'var(--chart-primary)' }}></div>
                </div>
                <p className="text-[var(--text-secondary)] font-semibold italic mt-4">Learning Curve Chart Visualization</p>
            </Card>
        </div>
    );
};
