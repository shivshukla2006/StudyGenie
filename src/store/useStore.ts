import { create } from 'zustand';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
}

export interface QuizTopic {
    id: number;
    name: string;
    total: number;
    completed: number;
    time: string;
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

interface AppState {
    messages: Message[];
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    
    quizTopics: QuizTopic[];
    updateQuizProgress: (topicId: number, questionsCompleted: number) => void;
    
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
}

export const useStore = create<AppState>((set) => ({
    messages: [
        {
            id: 'welcome-msg',
            role: 'ai',
            content: "Hi there! I'm your StudyGenie. How can I help you today?",
            timestamp: Date.now()
        }
    ],
    addMessage: (msg) => set((state) => ({
        messages: [
            ...state.messages,
            { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }
        ]
    })),

    quizTopics: [
        { id: 1, name: 'Data Structures', total: 15, completed: 5, time: '20m' },
        { id: 2, name: 'Linear Algebra', total: 10, completed: 8, time: '15m' },
        { id: 3, name: 'Biology - Genetics', total: 20, completed: 0, time: '30m' },
    ],
    updateQuizProgress: (topicId, questionsCompleted) => set((state) => {
        const xpGained = questionsCompleted * 10;
        const newQuizTopics = state.quizTopics.map(topic => 
            topic.id === topicId 
                ? { ...topic, completed: Math.min(topic.completed + questionsCompleted, topic.total) } 
                : topic
        );
        
        // Use functional state update to trigger addXP logic properly
        state.addXP(xpGained);

        return {
            quizTopics: newQuizTopics,
        };
    }),

    analytics: {
        streak: 5,
        testsTaken: 12,
        avgScore: 84,
        studyHours: 24,
        xp: 850,
        level: 3,
        xpToNextLevel: 1000
    },
    updateAnalytics: (updates) => set((state) => ({
        analytics: { ...state.analytics, ...updates }
    })),
    addXP: (amount) => set((state) => {
        let newXp = state.analytics.xp + amount;
        let newLevel = state.analytics.level;
        let newThreshold = state.analytics.xpToNextLevel;
        let leveledUp = false;

        while (newXp >= newThreshold) {
            newLevel++;
            newXp -= newThreshold; // Carry over XP
            newThreshold = Math.floor(newThreshold * 1.5); // Scale difficulty
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
    }),

    achievements: [
        { id: 'first-quiz', title: 'Brainiac Beginnings', description: 'Complete your first quiz module', icon: '🎓' },
        { id: 'battle-winner', title: 'Grandmaster', description: 'Win your first Study Battle', icon: '⚔️' },
        { id: 'streak-3', title: 'Triple Threat', description: 'Maintain a 3-day study streak', icon: '🔥', unlockedAt: Date.now() },
    ],
    unlockAchievement: (id) => set((state) => ({
        achievements: state.achievements.map(a => 
            a.id === id ? { ...a, unlockedAt: Date.now() } : a
        )
    })),

    battleLog: [],
    addBattleRecord: (record) => set((state) => ({
        battleLog: [
            { ...record, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
            ...state.battleLog
        ]
    })),

    showLevelUpModal: false,
    setShowLevelUpModal: (show) => set({ showLevelUpModal: show })
}));
