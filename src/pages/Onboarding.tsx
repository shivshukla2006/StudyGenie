import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { DynamicSelect } from '../components/DynamicSelect';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const Onboarding = () => {
    const navigate = useNavigate();
    const completeOnboarding = useStore(state => state.completeOnboarding);
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // State
    const [userType, setUserType] = useState<string>('');
    const [academicPath, setAcademicPath] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [goals, setGoals] = useState<string[]>([]);
    const [weakSubjects, setWeakSubjects] = useState<string[]>([]);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await completeOnboarding({
                userType,
                academicPath,
                specialization,
                subjects,
                goals,
                weakSubjects
            });
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        } finally {
            setLoading(false);
        }
    };

    const isSchool = userType === 'School Student' || userType === 'Other';
    // If 'Other' is typed as custom, it's not 'School Student' or 'College Student'. We assume generic flow for custom.

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 sm:p-12 rounded-[2rem] shadow-2xl backdrop-blur-xl relative z-10"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Personalize Your Genie</h1>
                        <p className="text-sm text-blue-200/60 font-medium">Step {step} of 4</p>
                    </div>
                </div>

                <div className="w-full h-1.5 bg-black/40 rounded-full mb-8 overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: '25%' }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[300px]"
                    >
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">Tell us about yourself</h2>
                                <DynamicSelect
                                    label="User Type"
                                    options={['School Student', 'College Student', 'Other']}
                                    value={userType}
                                    onChange={setUserType}
                                    otherPlaceholder="Please specify your type"
                                    required
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-bold text-white mb-6">Your Academic Profile</h2>
                                {isSchool ? (
                                    <>
                                        <DynamicSelect
                                            label="Stream"
                                            options={['Science', 'Commerce', 'Arts', 'Other']}
                                            value={academicPath}
                                            onChange={setAcademicPath}
                                            otherPlaceholder="Enter your stream"
                                            required
                                        />
                                        <DynamicSelect
                                            label="Subjects"
                                            options={['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy', 'Economics', 'Other']}
                                            value={subjects}
                                            onChange={setSubjects}
                                            otherPlaceholder="Enter your subject"
                                            multi
                                            required
                                        />
                                    </>
                                ) : (
                                    <>
                                        <DynamicSelect
                                            label="Course"
                                            options={['B.Tech', 'BCA', 'BBA', 'BSc', 'Other']}
                                            value={academicPath}
                                            onChange={setAcademicPath}
                                            otherPlaceholder="Enter your course"
                                            required
                                        />
                                        <DynamicSelect
                                            label="Branch / Specialization"
                                            options={['Computer Science', 'AI/ML', 'Mechanical', 'Electrical', 'Commerce', 'Other']}
                                            value={specialization}
                                            onChange={setSpecialization}
                                            otherPlaceholder="Enter your specialization"
                                            required
                                        />
                                        <DynamicSelect
                                            label="Subjects / Skills"
                                            options={['Data Structures', 'Web Development', 'Marketing', 'Finance', 'Other']}
                                            value={subjects}
                                            onChange={setSubjects}
                                            otherPlaceholder="Enter your subject or skill"
                                            multi
                                            required
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">What are your primary goals?</h2>
                                <DynamicSelect
                                    label="Goals"
                                    options={['School Exams', 'Competitive Exams', 'College Exams', 'Placement Preparation', 'Skill Learning', 'Other']}
                                    value={goals}
                                    onChange={setGoals}
                                    otherPlaceholder="Enter your goal"
                                    multi
                                    required
                                />
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">Areas for Improvement</h2>
                                <DynamicSelect
                                    label="Weak Subjects"
                                    options={['Mathematics', 'Science', 'Programming', 'Language', 'Other']}
                                    value={weakSubjects}
                                    onChange={setWeakSubjects}
                                    otherPlaceholder="Enter weak subject"
                                    multi
                                    required
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || loading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                            step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && !userType) || (step === 2 && !academicPath)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? 'Saving...' : 'Complete Setup'}
                            <Sparkles size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
