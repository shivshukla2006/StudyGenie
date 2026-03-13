import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Quizzes } from './pages/Quizzes';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { StudyBattles } from './pages/StudyBattles';
import { LevelUpModal } from './components/LevelUpModal';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Auth } from './components/Auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/dashboard" replace />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/battles" element={<StudyBattles />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Profile />} />
            </Routes>
            <LevelUpModal />
          </Layout>
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
