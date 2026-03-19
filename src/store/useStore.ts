import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
}

export interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface ProcessedNote {
    id?: string;
    title: string;
    summary: string;
    flashcards: any[];
    concepts: string[];
    created_at?: string;
}

export interface QuizTopic {
    id: number;
    name: string;
    total: number;
    completed: number;
    time: string;
    questions?: Question[];
}

export interface UserProfileDetails {
    userType?: string;
    academicPath?: string;
    specialization?: string;
    subjects?: string[];
    goals?: string[];
    weakSubjects?: string[];
    onboardingCompleted?: boolean;
}

interface AppState {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    clearMessages: () => void;
    
    quizTopics: QuizTopic[];
    updateQuizProgress: (topicId: number, questionsCompleted: number) => void;
    addQuizTopic: (topic: Omit<QuizTopic, 'id' | 'completed'>) => void;
    
    savedNotes: ProcessedNote[];
    saveNote: (note: Omit<ProcessedNote, 'id' | 'created_at'>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    
    analytics: {
        streak: number;
        testsTaken: number;
        avgScore: number;
        studyHours: number;
        xp: number;
        level: number;
        xpToNextLevel: number;
    };
    updateAnalytics: (updates: Partial<AppState['analytics']>) => void;
    addXP: (amount: number) => void;

    achievements: Achievement[];
    unlockAchievement: (id: string) => void;
    
    battleLog: BattleRecord[];
    addBattleRecord: (record: Omit<BattleRecord, 'id' | 'timestamp'>) => void;
    
    showLevelUpModal: boolean;
    setShowLevelUpModal: (show: boolean) => void;

    profileDetails: UserProfileDetails;
    completeOnboarding: (data: UserProfileDetails) => Promise<void>;

    // Cloud Sync Actions
    loadProfile: (userId: string) => Promise<void>;
    syncProgress: () => Promise<void>;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: number;
}

export interface BattleRecord {
    id: string;
    outcome: 'victory' | 'defeat';
    score: number;
    opponentScore: number;
    opponentName: string;
    timestamp: number;
}

export const useStore = create<AppState>((set, get) => ({
    profileDetails: {},
    completeOnboarding: async (data) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const updatePayload = {
            user_type: data.userType,
            academic_path: data.academicPath,
            specialization: data.specialization,
            subjects: data.subjects || [],
            goals: data.goals || [],
            weak_subjects: data.weakSubjects || [],
            onboarding_completed: true,
            updated_at: new Date().toISOString()
        };
        
        await supabase.from('profiles').update(updatePayload).eq('id', user.id);
        
        set({ profileDetails: { ...data, onboardingCompleted: true } });
    },

    messages: [
        {
            id: 'welcome-msg',
            role: 'ai',
            content: "Hi there! I'm your StudyGenie. How can I help you today?",
            timestamp: Date.now()
        }
    ],
    addMessage: (msg) => {
        set((state) => ({
            messages: [
                ...state.messages,
                { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }
            ]
        }));
    },

    clearMessages: () => {
        set({
            messages: [
                {
                    id: 'welcome-msg',
                    role: 'ai',
                    content: "Hi there! I'm your StudyGenie. How can I help you today?",
                    timestamp: Date.now()
                }
            ]
        });
    },

    quizTopics: [],
    updateQuizProgress: (topicId, questionsCompleted) => {
        const xpGained = questionsCompleted * 10;
        set((state) => {
            const newQuizTopics = state.quizTopics.map(topic => 
                topic.id === topicId 
                    ? { ...topic, completed: Math.min(topic.completed + questionsCompleted, topic.total) } 
                    : topic
            );
            return { quizTopics: newQuizTopics };
        });
        get().addXP(xpGained);
    },
    addQuizTopic: (topic) => set((state) => ({
        quizTopics: [
            ...state.quizTopics,
            { ...topic, id: Date.now(), completed: 0 }
        ]
    })),

    savedNotes: [],
    saveNote: async (note) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
            .from('processed_notes')
            .insert({ ...note, user_id: user.id })
            .select()
            .single();
            
        if (data && !error) {
            set((state) => ({
                savedNotes: [data as ProcessedNote, ...state.savedNotes]
            }));
        }
    },
    deleteNote: async (id) => {
        const { error } = await supabase
            .from('processed_notes')
            .delete()
            .eq('id', id);
            
        if (!error) {
            set((state) => ({
                savedNotes: state.savedNotes.filter(n => n.id !== id)
            }));
        }
    },

    analytics: {
        streak: 0,
        testsTaken: 0,
        avgScore: 0,
        studyHours: 0,
        xp: 0,
        level: 1,
        xpToNextLevel: 1000
    },
    updateAnalytics: (updates) => set((state) => ({
        analytics: { ...state.analytics, ...updates }
    })),
    addXP: (amount) => {
        set((state) => {
            let newXp = state.analytics.xp + amount;
            let newLevel = state.analytics.level;
            let newThreshold = state.analytics.xpToNextLevel;
            let leveledUp = false;

            while (newXp >= newThreshold) {
                newLevel++;
                newXp -= newThreshold;
                newThreshold = Math.floor(newThreshold * 1.5);
                leveledUp = true;
            }

            return {
                analytics: {
                    ...state.analytics,
                    xp: newXp,
                    level: newLevel,
                    xpToNextLevel: newThreshold
                },
                showLevelUpModal: leveledUp ? true : state.showLevelUpModal
            };
        });
        get().syncProgress();
    },

    achievements: [
        { id: 'first-quiz', title: 'Brainiac Beginnings', description: 'Complete your first quiz module', icon: '🎓' },
        { id: 'battle-winner', title: 'Grandmaster', description: 'Win your first Study Battle', icon: '⚔️' },
        { id: 'streak-3', title: 'Triple Threat', description: 'Maintain a 3-day study streak', icon: '🔥' },
    ],
    unlockAchievement: async (id) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('user_achievements').upsert({
                user_id: user.id,
                achievement_id: id,
                unlocked_at: new Date().toISOString()
            });
        }
        set((state) => ({
            achievements: state.achievements.map(a => 
                a.id === id ? { ...a, unlockedAt: Date.now() } : a
            )
        }));
    },

    battleLog: [],
    addBattleRecord: async (record) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('battle_history').insert({
                user_id: user.id,
                opponent_name: record.opponentName,
                outcome: record.outcome,
                score: record.score,
                opponent_score: record.opponentScore,
                xp_earned: record.outcome === 'victory' ? 50 : 10
            });
        }
        set((state) => ({
            battleLog: [
                { ...record, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
                ...state.battleLog
            ]
        }));
    },

    showLevelUpModal: false,
    setShowLevelUpModal: (show) => set({ showLevelUpModal: show }),

    loadProfile: async (userId) => {
        // Load basic profile info
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profile) {
            set((state) => ({
                analytics: {
                    ...state.analytics,
                    xp: profile.xp || 0,
                    level: profile.level || 1,
                    streak: profile.current_streak || 0,
                    // Recalculate threshold based on level
                    xpToNextLevel: Math.floor(1000 * Math.pow(1.5, (profile.level || 1) - 1))
                },
                profileDetails: {
                    userType: profile.user_type,
                    academicPath: profile.academic_path,
                    specialization: profile.specialization,
                    subjects: profile.subjects,
                    goals: profile.goals,
                    weakSubjects: profile.weak_subjects,
                    onboardingCompleted: profile.onboarding_completed
                }
            }));
        }

        // Load achievements
        const { data: userAchievements } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at')
            .eq('user_id', userId);

        if (userAchievements) {
            set((state) => ({
                achievements: state.achievements.map(a => {
                    const match = userAchievements.find((ua: any) => ua.achievement_id === a.id);
                    return match ? { ...a, unlockedAt: new Date(match.unlocked_at).getTime() } : a;
                })
            }));
        }

        // Load battle history
        const { data: battles } = await supabase
            .from('battle_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (battles) {
            set({
                battleLog: battles.map((b: any) => ({
                    id: b.id,
                    opponentName: b.opponent_name,
                    outcome: b.outcome as 'victory' | 'defeat',
                    score: b.score,
                    opponentScore: b.opponent_score,
                    timestamp: new Date(b.created_at).getTime()
                }))
            });
        }

        // Chat messages load removed to prevent persistence on refresh

        // Load saved notes
        const { data: notes } = await supabase
            .from('processed_notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (notes) {
            set({ savedNotes: notes as ProcessedNote[] });
        }
    },

    syncProgress: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { analytics } = get();
        await supabase
            .from('profiles')
            .update({
                xp: analytics.xp,
                level: analytics.level,
                current_streak: analytics.streak,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
    }
}));
