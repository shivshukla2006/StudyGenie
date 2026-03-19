import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GenieMascot } from './GenieMascot';
import { Button } from './Button';

export const LevelUpModal = () => {
    const { showLevelUpModal, setShowLevelUpModal, analytics } = useStore();

    useEffect(() => {
        if (showLevelUpModal) {
            // Physical confetti blast
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults, particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);
        }
    }, [showLevelUpModal]);

    return (
        <AnimatePresence>
            {showLevelUpModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blue-400/30 bg-[#1E293B] p-8 text-center shadow-2xl"
                    >
                        {/* Background Glow */}
                        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
                        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />

                        <div className="relative z-10 space-y-6">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                                className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/20"
                            >
                                <Trophy className="text-white" size={40} />
                            </motion.div>

                            <div className="space-y-2">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-400">Magical Growth!</h2>
                                <h3 className="text-4xl font-black text-white">LEVEL UP</h3>
                                <div className="flex items-center justify-center gap-2">
                                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        {analytics.level}
                                    </span>
                                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                                </div>
                            </div>

                            <div className="h-48">
                                <GenieMascot pose="celebration" className="h-full" />
                            </div>

                            <p className="text-lg text-slate-300">
                                You're becoming a true knowledge master! Your AI Genie is impressed.
                            </p>

                            <div className="pt-4">
                                <Button 
                                    variant="glow" 
                                    onClick={() => setShowLevelUpModal(false)}
                                    className="w-full h-14 text-xl font-bold"
                                >
                                    Continue Learning
                                </Button>
                            </div>

                            <motion.div 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center justify-center gap-2 text-sm text-blue-400/80"
                            >
                                <Sparkles size={16} />
                                <span>New features & challenges unlocked!</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Particle Simulation (CSS only simplified) */}
                    <div className="pointer-events-none absolute inset-0 z-0">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ 
                                    x: '50%', 
                                    y: '50%', 
                                    scale: 0, 
                                    opacity: 0 
                                }}
                                animate={{ 
                                    x: `${Math.random() * 100}%`, 
                                    y: `${Math.random() * 100}%`, 
                                    scale: Math.random() * 1.5, 
                                    opacity: [0, 1, 0] 
                                }}
                                transition={{ 
                                    duration: 2 + Math.random() * 2, 
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                                className="absolute h-2 w-2 rounded-full bg-blue-400"
                            />
                        ))}
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};
