import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import StudyTool from './pages/StudyTool';
import { AuthModal } from './components/AuthModal';

type AppView = 'landing' | 'dashboard' | 'study';

function MainRouter() {
  const [view, setView] = useState<AppView>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeSession, setActiveSession] = useState<any>(null);

  const { isAuthenticated, logout } = useAuth();

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartSession = (sessionData?: any) => {
    setActiveSession(sessionData || null);
    setView('study');
  };

  const handleAuthSuccess = () => {
    // Navigate straight to dashboard upon logging in or registering
    setView('dashboard');
  };

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onStart={() => {
            if (isAuthenticated) {
              setView('dashboard');
            } else {
              setView('study');
            }
          }}
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={() => setView('dashboard')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardPage
          onStartSession={handleStartSession}
          onLogout={async () => {
            await logout();
            setView('landing');
          }}
        />
      )}

      {view === 'study' && (
        <StudyTool
          initialSession={activeSession}
          onBack={() => {
            if (isAuthenticated) {
              setView('dashboard');
            } else {
              setView('landing');
            }
          }}
          onGoToDashboard={() => setView('dashboard')}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
