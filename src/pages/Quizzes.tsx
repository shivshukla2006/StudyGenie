import { BookOpen, Star, Clock, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useStore, type QuizTopic } from '../store/useStore';
import { useState } from 'react';
import { Modal } from '../components/Modal';

export const Quizzes = () => {
    const topics = useStore(state => state.quizTopics);
    const updateQuizProgress = useStore(state => state.updateQuizProgress);
    const updateAnalytics = useStore(state => state.updateAnalytics);
    const analytics = useStore(state => state.analytics);

    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenieModal, setShowGenieModal] = useState(false);
    const [genieTopic, setGenieTopic] = useState('');
    const addQuizTopic = useStore(state => state.addQuizTopic);

    const [activeTopic, setActiveTopic] = useState<QuizTopic | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleStart = (topic: QuizTopic) => {
        setActiveTopic(topic);
        setCurrentQIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const handleGenerateAIQuiz = async () => {
        if (!genieTopic.trim()) return;
        setIsGenerating(true);
        try {
            const response = await fetch('http://localhost:8000/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: genieTopic, count: 5 })
            });

            if (!response.ok) throw new Error('Genie is tired!');
            
            const quizData = await response.json();
            
            addQuizTopic({
                name: quizData.title,
                total: quizData.questions.length,
                time: `${quizData.questions.length * 2}m`,
                questions: quizData.questions
            });
            
            setShowGenieModal(false);
            setGenieTopic('');
        } catch (err) {
            console.error('Genie Quiz Error:', err);
            alert("The Genie's magic failed! Check if the backend is running. ✨");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswerSelection = (idx: number) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);

        // Note: score check was here

        setTimeout(() => {
            if (activeTopic) {
                if (currentQIndex < (activeTopic.questions?.length || 3) - 1) {
                    setCurrentQIndex(prev => prev + 1);
                    setSelectedOption(null);
                    setIsAnswered(false);
                } else {
                    // Quiz Finished
                    updateQuizProgress(activeTopic.id, activeTopic.total);
                    updateAnalytics({ testsTaken: analytics.testsTaken + 1 });
                    setActiveTopic(null);
                }
            }
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="p-6 rounded-2xl shadow-md border flex justify-between items-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Practice Quizzes</h1>
                    <p className="font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Master your subjects, one question at a time.</p>
                </div>
                <Button variant="glow" onClick={() => setShowGenieModal(true)}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Genie Magic
                </Button>
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
                                onClick={() => handleStart(topic)}
                            >
                                {topic.completed === 0 ? 'Start Now' : 'Continue'}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Genie Magic Modal */}
            <Modal isOpen={showGenieModal} onClose={() => setShowGenieModal(false)} title="Genie AI Generator">
                <div className="space-y-4">
                    <p className="text-[var(--text-secondary)]">What subject should the Genie create a quiz for today?</p>
                    <Input 
                        placeholder="e.g. Ancient Rome, Photosynthesis, React Hooks..." 
                        value={genieTopic}
                        onChange={(e) => setGenieTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateAIQuiz()}
                    />
                    <Button 
                        variant="primary" 
                        className="w-full" 
                        onClick={handleGenerateAIQuiz}
                        disabled={isGenerating || !genieTopic.trim()}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Working Magic...
                            </>
                        ) : 'Generate Quiz ✨'}
                    </Button>
                </div>
            </Modal>

            {/* Quiz Player Modal */}
            <Modal 
                isOpen={activeTopic !== null} 
                onClose={() => setActiveTopic(null)}
                title={activeTopic?.name || 'Quiz'}
            >
                <div className="space-y-6">
                    {activeTopic && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Question {currentQIndex + 1} of {activeTopic.questions?.length || 3}
                                </span>
                            </div>
                            <div className="w-full h-2 rounded-full mb-6" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${((currentQIndex) / (activeTopic.questions?.length || 3)) * 100}%`, 
                                        backgroundColor: 'var(--btn-primary)' 
                                    }}
                                />
                            </div>

                            <h3 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
                                {activeTopic.questions?.[currentQIndex]?.question || "Loading question..."}
                            </h3>

                            <div className="space-y-3">
                                {(activeTopic.questions?.[currentQIndex]?.options || [1, 2, 3, 4]).map((opt, idx) => {
                                    const isCorrect = idx === activeTopic.questions?.[currentQIndex]?.correctAnswer;
                                    const isSelected = selectedOption === idx;
                                    
                                    let borderColor = 'var(--card-border)';
                                    let bgColor = 'var(--card-bg)';
                                    
                                    if (isAnswered) {
                                        if (isCorrect) {
                                            borderColor = '#22C55E';
                                            bgColor = 'rgba(34, 197, 94, 0.1)';
                                        } else if (isSelected) {
                                            borderColor = '#EF4444';
                                            bgColor = 'rgba(239, 68, 68, 0.1)';
                                        }
                                    } else if (isSelected) {
                                        borderColor = 'var(--btn-primary)';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelection(idx)}
                                            disabled={isAnswered}
                                            className="w-full p-4 text-left rounded-xl border transition-all font-medium text-[var(--text-primary)]"
                                            style={{ backgroundColor: bgColor, borderColor: borderColor }}
                                        >
                                            {typeof opt === 'string' ? opt : `Option ${opt}`}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswered && activeTopic.questions?.[currentQIndex]?.explanation && (
                                <div className="mt-4 p-4 rounded-xl border bg-blue-500/5 border-blue-500/20 text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                                    <strong>Explanation:</strong> {activeTopic.questions[currentQIndex].explanation}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
