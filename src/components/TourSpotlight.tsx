import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useStore } from '../store/useStore';
import { Sparkles, ChevronRight, Check } from 'lucide-react';

export const TourSpotlight = () => {
    const { hasCompletedTour, completeTour, profileDetails } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const steps = [
        {
            target: '#tour-goal',
            title: 'Your Learning Journey',
            content: 'This is your current Level and XP progress. Collect XP in Battles and Quizzes to rank up!'
        },
        {
            target: '#tour-quizzes',
            title: 'Practice & Learn',
            content: 'Generate personalized pattern-matching quizzes powered by AI right here.'
        },
        {
            target: '#tour-chat',
            title: 'Genie AI Tutor',
            content: 'Stuck on something? Ask the Genie for instant explanations and guidance.'
        }
    ];

    useEffect(() => {
        // Only show if onboarding is done but tour isn't
        if (hasCompletedTour || !profileDetails.onboardingCompleted) return;

        const updateRect = () => {
            const el = document.querySelector(steps[currentStep].target);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        // Delay to ensure DOM is rendered after navigation
        const timer = setTimeout(updateRect, 300);
        window.addEventListener('resize', updateRect);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
        };
    }, [currentStep, hasCompletedTour, profileDetails.onboardingCompleted]);

    if (hasCompletedTour || !profileDetails.onboardingCompleted) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] pointer-events-none">
                {/* Dim background */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm transition-all duration-500"
                />

                {/* Spotlight hole */}
                {targetRect && (
                    <motion.div
                        className="absolute bg-transparent pointer-events-none rounded-3xl"
                        initial={false}
                        animate={{
                            top: targetRect.top - 16,
                            left: targetRect.left - 16,
                            width: targetRect.width + 32,
                            height: targetRect.height + 32,
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ 
                            boxShadow: '0 0 0 9999px rgba(15,23,42,0.8), 0 0 50px rgba(59,130,246,0.3) inset',
                            border: '1px solid rgba(59,130,246,0.5)'
                        }}
                    >
                        <motion.div 
                            className="absolute -inset-1 border-2 border-dashed border-blue-400/50 rounded-3xl animate-[spin_20s_linear_infinite]"
                        />
                    </motion.div>
                )}

                {/* Tooltip Card */}
                {targetRect && (
                    <motion.div
                        className="absolute z-[110] pointer-events-auto w-full max-w-[320px]"
                        initial={false}
                        animate={{
                            top: targetRect.bottom + 32,
                            left: Math.max(16, targetRect.left + (targetRect.width / 2) - 160),
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    >
                        <div className="bg-[#1E293B]/95 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <Sparkles className="text-yellow-400 w-5 h-5 flex-shrink-0" />
                                <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{steps[currentStep].title}</h3>
                            </div>
                            <p className="text-blue-100/70 text-sm mb-6 leading-relaxed relative z-10">
                                {steps[currentStep].content}
                            </p>
                            
                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                                <Button variant="glow" onClick={handleNext} className="h-10 px-5 rounded-xl shadow-lg shadow-blue-500/25 border-none">
                                    {currentStep === steps.length - 1 ? (
                                        <span className="flex items-center">Finish <Check className="w-4 h-4 ml-2" /></span>
                                    ) : (
                                        <span className="flex items-center">Next <ChevronRight className="w-4 h-4 ml-2" /></span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};
