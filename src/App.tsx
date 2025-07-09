import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import PasswordResetConfirmation from './pages/PasswordResetConfirmation';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import DailyTips from './pages/DailyTips';
import Preferences from './pages/Preferences';
import Relationships from './pages/Relationships';
import RelationshipAssessment from './pages/RelationshipAssessment';
import RelationshipDetail from './pages/RelationshipDetail';
import BiometricSettings from './pages/BiometricSettings';
import Reports from './pages/Reports';
import ConversationAnalysis from './pages/ConversationAnalysis';
import Premium from './pages/Premium';

const queryClient = new QueryClient();

// Auth wrapper component to handle session state
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error?.message.includes('session_not_found')) {
          await handleInvalidSession();
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'USER_DELETED' || event === 'TOKEN_REFRESHED') {
        // Check if session is still valid after token refresh
        const { data, error } = await supabase.auth.getUser();
        if (error?.message.includes('session_not_found')) {
          await handleInvalidSession();
        }
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });

    // Handle invalid session by signing out and redirecting
    const handleInvalidSession = async () => {
      await supabase.auth.signOut();
      navigate('/login');
    };

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthWrapper>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-confirmation" element={<PasswordResetConfirmation />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/daily-tips" element={<DailyTips />} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/relationships" element={<Relationships />} />
                <Route path="/relationships/:id" element={<RelationshipDetail />} />
                <Route path="/relationships/:id/assess" element={<RelationshipAssessment />} />
                <Route path="/biometric-settings" element={<BiometricSettings />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analyze" element={<ConversationAnalysis />} />
                <Route path="/premium" element={<Premium />} />
              </Routes>
            </div>
            <Toaster position="top-right" />
          </div>
        </AuthWrapper>
      </Router>
    </QueryClientProvider>
  );
}

export default App;