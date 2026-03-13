import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GenieMascot } from '../components/GenieMascot';
import { useStore } from '../store/useStore';

export const Dashboard = () => {
    const analytics = useStore(state => state.analytics);
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
                <Card glow={true}>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Daily Goal</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>You are 80% done with your goal today. Keep it up!</p>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                        <div className="w-[80%] h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-[0_0_10px_var(--mascot-glow)]"></div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Start Practice</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Jump into the latest generated quiz.</p>
                    <Button variant="secondary" className="w-full">Continue Quiz</Button>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">AI Tutor</h3>
                    <p className="mt-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>Stuck on a topic? Ask the Genie for help.</p>
                    <Button variant="primary" className="w-full">Open Chat</Button>
                </Card>
            </div>
        </div>
    );
};
