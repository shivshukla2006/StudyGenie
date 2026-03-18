import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Github } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOAuth = (provider: 'google' | 'github') => {
        setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is currently unavailable.`);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const cleanEmail = email.trim();
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });
                if (error) throw error;
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                    options: {
                        data: {
                            username: cleanEmail.split('@')[0],
                        }
                    }
                });
                if (error) throw error;
                
                // If the user signed up but no session is returned, email confirmation is likely required
                if (!data.session) {
                    setError('Please check your email to confirm your account.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 blur-3xl opacity-30 rounded-full animate-pulse-glow" />
                        <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/80 border border-white/10 backdrop-blur-lg p-4 shadow-2xl overflow-hidden flex items-center justify-center animate-float">
                            <img src="/logo_mascot_clean.png" alt="StudyGenie Logo" className="w-full h-full object-contain mix-blend-screen scale-110" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-1">
                        <span className="text-white">Study</span>
                        <span className="text-[#3B82F6]">Genie</span>
                    </h1>
                    <p className="text-blue-200/60 font-medium">Your magical learning companion</p>
                </div>

                {/* Form Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
                    
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-200/60 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-200/40 group-focus-within:text-blue-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="student@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-200/60 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-200/40 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-400 text-sm font-medium bg-red-900/20 border border-red-500/20 p-3 rounded-xl"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl p-[2px] mt-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-black/20 backdrop-blur-md rounded-[10px] px-4 py-3 flex items-center justify-center gap-2 group-hover:bg-black/0 transition-colors duration-300">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <>
                                        <span className="font-bold text-white text-lg">{isLogin ? 'Sign In' : 'Sign Up'}</span>
                                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0F172A] px-2 text-blue-200/40">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleOAuth('google')}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white hover:bg-white/10 transition-colors font-medium text-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.5 1.57 14.94 1 12 1 7.24 1 3.23 3.84 1.34 7.93l3.77 2.93c.9-2.7 3.42-4.82 6.89-4.82z"/>
                                <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.51h6.43c-.28 1.48-1.12 2.74-2.38 3.59l3.71 2.87c2.17-2 3.43-4.94 3.43-8.67z"/>
                                <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.95-2.93l-3.71-2.87c-1.11.75-2.53 1.2-4.24 1.2-3.26 0-6.02-2.2-7.01-5.16l-3.77 2.93C3.21 20.16 7.22 23 12 23z"/>
                                <path fill="#FBBC05" d="M4.99 13.24A6.03 6.03 0 014.65 12c0-.43.06-.85.16-1.26L1.04 7.81C.38 9.11 0 10.51 0 12c0 1.49.38 2.89 1.04 4.19l3.95-2.95z"/>
                            </svg>
                            <span>Google</span>
                        </button>
                        <button
                            onClick={() => handleOAuth('github')}
                            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white hover:bg-white/10 transition-colors font-medium text-sm"
                        >
                            <Github size={18} />
                            <span>GitHub</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-blue-200/60 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-white font-bold hover:text-blue-400 transition-colors"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
