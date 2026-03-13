import { BookOpen, Star, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { Modal } from '../components/Modal';

export const Quizzes = () => {
    const topics = useStore(state => state.quizTopics);
    const updateQuizProgress = useStore(state => state.updateQuizProgress);
    const updateAnalytics = useStore(state => state.updateAnalytics);
    const analytics = useStore(state => state.analytics);

    const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);

    const handleStart = (topicId: number) => {
        setActiveTopicId(topicId);
        setCurrentQIndex(0);
    };

    const handleAnswerSelection = () => {
        if (currentQIndex < 2) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            // Finished a short 3-question session
            if (activeTopicId !== null) {
                updateQuizProgress(activeTopicId, 3);
                updateAnalytics({ testsTaken: analytics.testsTaken + 1 });
            }
            setActiveTopicId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl shadow-md border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Practice Quizzes</h1>
                <p className="font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Master your subjects, one question at a time.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {topics.map((topic) => (
                    <Card key={topic.id} className="cursor-pointer hover:border-[var(--btn-primary)] transition-colors flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--btn-primary)' }}>
                                    <BookOpen size={20} />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--sidebar-active-bg)', color: 'var(--text-secondary)' }}>
                                    <Clock size={12} />
                                    <span>{topic.time}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{topic.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                <Star size={14} />
                                <span>{topic.completed} / {topic.total} Completed</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${(topic.completed / topic.total) * 100}%`, backgroundColor: 'var(--btn-primary)' }}
                                />
                            </div>
                            <Button 
                                variant={topic.completed === 0 ? 'secondary' : 'glow'} 
                                className="w-full"
                                onClick={() => handleStart(topic.id)}
                            >
                                {topic.completed === 0 ? 'Start Now' : 'Continue'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal 
                isOpen={activeTopicId !== null} 
                onClose={() => setActiveTopicId(null)}
                title={topics.find(t => t.id === activeTopicId)?.name || 'Quiz'}
            >
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Question {currentQIndex + 1} of 3</span>
                        </div>
                        <div className="w-full h-2 rounded-full mb-6" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${((currentQIndex) / 3) * 100}%`, backgroundColor: 'var(--btn-primary)' }}
                            />
                        </div>

                        <h3 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
                            {currentQIndex === 0 && "Which data structure uses LIFO?"}
                            {currentQIndex === 1 && "What is the time complexity of binary search?"}
                            {currentQIndex === 2 && "Which sorting algorithm is the fastest on average?"}
                        </h3>

                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={handleAnswerSelection}
                                    className="w-full p-4 text-left rounded-xl border hover:border-[var(--btn-primary)] transition-all font-medium text-[var(--text-primary)]"
                                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                                >
                                    Option {opt} - Simulated Answer
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
