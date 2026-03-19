import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LevelUpModal } from './components/LevelUpModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Auth } from './components/Auth';
import Landing from './pages/Landing';
import { useStore } from './store/useStore';

// Lazy load pages for Code-Splitting (Optimizations)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Quizzes = lazy(() => import('./pages/Quizzes').then(m => ({ default: m.Quizzes })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const StudyBattles = lazy(() => import('./pages/StudyBattles').then(m => ({ default: m.StudyBattles })));
const Notes = lazy(() => import('./pages/Notes').then(m => ({ default: m.Notes })));

const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const profileDetails = useStore(state => state.profileDetails);
  
  // If explicitly false, redirect to onboarding (undefined means it's still loading)
  if (profileDetails && profileDetails.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { session, user } = useAuth();
  const loadProfile = useStore(state => state.loadProfile);

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
    }
  }, [user, loadProfile]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" replace />} />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Suspense fallback={<div className="flex items-center justify-center p-12 text-sm text-[var(--text-secondary)]">Loading page...</div>}>
            <Onboarding />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <OnboardingGuard>
            <Layout>
              <Suspense fallback={<div className="flex items-center justify-center p-12 text-sm text-[var(--text-secondary)]">Loading page...</div>}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/quizzes" element={<Quizzes />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/battles" element={<StudyBattles />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Profile />} />
                </Routes>
              </Suspense>
              <PWAInstallPrompt />
              <LevelUpModal />
            </Layout>
          </OnboardingGuard>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
