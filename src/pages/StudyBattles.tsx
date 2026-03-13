import { useState, useEffect, useMemo } from 'react';
import { Swords, Timer, Zap, Trophy, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import questionsData from '../data/questions.json';

export const StudyBattles = () => {
    const { addXP, addBattleRecord, analytics } = useStore();
    const [battleState, setBattleState] = useState<'lobby' | 'countdown' | 'playing' | 'results'>('lobby');
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shake, setShake] = useState(false);

    // Filter questions or just use the pool
    const battleQuestions = useMemo(() => {
        return [...questionsData].sort(() => Math.random() - 0.5).slice(0, 5);
    }, [battleState === 'countdown']); // Re-shuffle when starting new battle

    // Timer logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (battleState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
                // Simulate opponent scoring randomly
                if (Math.random() > 0.7) {
                    setOpponentScore(prev => prev + 25);
                }
            }, 1000);
        } else if (timeLeft === 0 && battleState === 'playing') {
            handleBattleEnd();
        }
        return () => clearInterval(timer);
    }, [battleState, timeLeft]);

    const handleBattleEnd = () => {
        setBattleState('results');
        const outcome = score > opponentScore ? 'victory' : 'defeat';
        const xpGained = outcome === 'victory' ? 200 : 50;
        
        addXP(xpGained);
        addBattleRecord({
            outcome,
            score,
            opponentScore,
            opponentName: 'Alex99'
        });
    };

    // Countdown logic
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (battleState === 'countdown') {
            timer = setTimeout(() => {
                setBattleState('playing');
                setTimeLeft(30);
                setScore(0);
                setOpponentScore(0);
                setCurrentQuestionIndex(0);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [battleState]);

    const handleAnswer = (optionIndex: number) => {
        if (battleState !== 'playing') return;
        
        const isCorrect = optionIndex === battleQuestions[currentQuestionIndex].correct;
        
        if (isCorrect) {
            setScore(prev => prev + 25);
            if (currentQuestionIndex < battleQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                handleBattleEnd();
            }
        } else {
            // Shake effect on wrong answer
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const currentQuestion = battleQuestions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">Study Battles</h1>
                    <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Compete against peers and the Genie for massive XP!</p>
                </div>
                {battleState === 'lobby' && (
                    <Button variant="glow" onClick={() => setBattleState('countdown')} className="h-12 px-6">
                        <Swords className="mr-2" size={20} />
                        Find Opponent
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {battleState === 'lobby' && (
                    <motion.div 
                        key="lobby"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-2 gap-6 mt-8"
                    >
                        <Card className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-[var(--card-bg)] to-blue-500/10 border-blue-500/20">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-500">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Ranked Arena</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="mb-6 text-sm">Test your knowledge under pressure. Win to claim 200 XP and climb the leaderboard.</p>
                            <Button variant="primary" className="w-full" onClick={() => setBattleState('countdown')}>Enter Arena</Button>
                        </Card>

                        <Card className="flex flex-col items-center text-center p-8 opacity-70 border-dashed">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-500">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Genie Boss Fight</h3>
                            <p style={{ color: 'var(--text-secondary)' }} className="mb-6 text-sm">Unlock at Level 10. Face the ultimate AI challenge for legendary rewards.</p>
                            <Button variant="secondary" className="w-full" disabled>Locked (Lvl {analytics.level}/10)</Button>
                        </Card>
                    </motion.div>
                )}

                {battleState === 'countdown' && (
                    <motion.div
                        key="countdown"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-32"
                    >
                        <Card className="flex flex-col items-center justify-center p-12 border-blue-500/50 bg-blue-500/5">
                            <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-4">Opponent Found: <span className="text-blue-500">Alex99</span></h2>
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="text-8xl font-black text-[var(--btn-primary)]"
                            >
                                VS
                            </motion.div>
                            <p className="mt-8 text-xl font-semibold text-[var(--text-primary)] animate-pulse uppercase tracking-[0.2em]">Preparing Battle...</p>
                        </Card>
                    </motion.div>
                )}

                {battleState === 'playing' && (
                    <motion.div 
                        key="playing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Scoreboard H.U.D. */}
                        <div className="flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                            <div className="text-center w-24">
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">You</p>
                                <p className="text-3xl font-black text-[var(--btn-primary)]">{score}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <motion.div animate={timeLeft <= 5 ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
                                    <Timer size={32} className={timeLeft <= 10 ? 'text-red-500' : 'text-orange-400'} />
                                </motion.div>
                                <p className={`font-mono font-bold text-xl mt-1 ${timeLeft <= 10 ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                                    0:{timeLeft.toString().padStart(2, '0')}
                                </p>
                            </div>
                            <div className="text-center w-24">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Alex99</p>
                                <p className="text-3xl font-black text-red-500">{opponentScore}</p>
                            </div>
                        </div>

                        {/* Battle Question */}
                        <motion.div
                            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="relative overflow-hidden p-8 border-t-4 border-t-blue-500">
                                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(timeLeft / 30) * 100}%` }}
                                        transition={{ duration: 1, ease: 'linear' }}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between mb-6">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                        Question {currentQuestionIndex + 1} / {battleQuestions.length}
                                    </span>
                                    {shake && (
                                        <div className="flex items-center gap-1 text-red-500 animate-bounce">
                                            <AlertCircle size={14} />
                                            <span className="text-xs font-bold">Wrong!</span>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold mb-8 text-[var(--text-primary)] leading-tight">
                                     "{currentQuestion.question}"
                                </h3>
                                
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, idx) => (
                                        <Button 
                                            key={idx}
                                            variant="secondary" 
                                            className="h-16 text-lg justify-start px-6 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 group"
                                            onClick={() => handleAnswer(idx)}
                                        >
                                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-blue-500/20 text-sm font-bold text-white/40 group-hover:text-blue-400 border border-white/10 transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}

                {battleState === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-10"
                    >
                        <Card className="flex flex-col items-center justify-center p-12 text-center border-white/10 shadow-2xl relative overflow-hidden">
                            {/* Animated Bg */}
                            <div className={`absolute inset-0 opacity-5 ${score > opponentScore ? 'bg-green-500' : 'bg-red-500'}`} />
                            
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-12 ${score > opponentScore ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-green-500/50' : 'bg-gradient-to-br from-red-400 to-rose-600 text-white shadow-red-500/50'}`}
                            >
                                {score > opponentScore ? <Trophy size={56} /> : <Swords size={56} />}
                            </motion.div>

                            <h2 className="text-5xl font-black text-[var(--text-primary)] mb-2 tracking-tight">
                                {score > opponentScore ? 'VICTORY!' : 'DEFEAT'}
                            </h2>
                            <p className="text-xl mb-10 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Final Score: <span className="font-bold text-[var(--btn-primary)] text-2xl px-2">{score}</span> vs <span className="font-bold text-red-500 text-2xl px-2">{opponentScore}</span>
                            </p>
                            
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-3 mb-10 p-5 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-500/20 shadow-inner"
                            >
                                <Zap className="text-yellow-400" size={28} />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-none mb-1">Rewards Earned</p>
                                    <span className="font-black text-2xl text-yellow-500">
                                        +{score > opponentScore ? '200' : '50'} XP
                                    </span>
                                </div>
                            </motion.div>

                            <div className="flex gap-4 w-full max-w-sm">
                                <Button variant="glow" onClick={() => setBattleState('countdown')} className="flex-1 h-14 font-bold text-lg">
                                    Rematch
                                </Button>
                                <Button variant="secondary" onClick={() => setBattleState('lobby')} className="flex-1 h-14 font-bold text-lg border-white/10">
                                    Lobby
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
