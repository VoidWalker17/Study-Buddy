import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import StudyTool from './pages/StudyTool';
import { FullScreenSignup } from './components/ui/full-screen-signup';

type AppView = 'landing' | 'auth' | 'dashboard' | 'study';

function MainRouter() {
  const [view, setView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeSession, setActiveSession] = useState<any>(null);

  const { isAuthenticated, logout } = useAuth();

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode === 'register' ? 'signup' : 'login');
    setView('auth');
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
              handleOpenAuth('register');
            }
          }}
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={() => setView('dashboard')}
        />
      )}

      {view === 'auth' && (
        <FullScreenSignup
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onBackToHome={() => setView('landing')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardPage
          onStartSession={handleStartSession}
          onLogout={async () => {
            await logout();
            setView('landing');
          }}
          onGoToLanding={() => setView('landing')}
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
