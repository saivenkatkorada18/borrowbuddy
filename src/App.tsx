// src/App.tsx — Root app with routing, auth gate, full-screen auth entry
import { useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollProgress } from './components/motion/ScrollProgress';
import { PageTransition } from './components/motion/PageTransition';
import { AuthPage } from './pages/AuthPage';
import { ToastContainer } from './components/ui/Toast';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { ItemDetail } from './pages/ItemDetail';
import { HowItWorks } from './pages/HowItWorks';
import { TrustSafety } from './pages/TrustSafety';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { addToast } = useToast();

  const handleAuthSuccess = useCallback((displayName: string) => {
    addToast({
      type: 'success',
      title: `Welcome, ${displayName}! 🎉`,
      message: 'You can now borrow items or list your own.',
    });
  }, [addToast]);

  // Wait for auth to initialize
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#4338CA] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-stone-500">Loading BorrowBuddy...</p>
        </div>
      </div>
    );
  }

  // Show AuthPage until user is authenticated
  if (!isAuthenticated) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar onLoginClick={() => {}} onSignupClick={() => {}} />

      <Routes>
        <Route path="/" element={
          <PageTransition>
            <Landing onLogin={() => {}} onSignup={() => {}} />
          </PageTransition>
        } />
        <Route path="/explore" element={
          <PageTransition>
            <Explore />
          </PageTransition>
        } />
        <Route path="/item/:id" element={
          <PageTransition>
            <ItemDetail />
          </PageTransition>
        } />
        <Route path="/how-it-works" element={
          <PageTransition>
            <HowItWorks />
          </PageTransition>
        } />
        <Route path="/trust" element={
          <PageTransition>
            <TrustSafety />
          </PageTransition>
        } />
        <Route path="/dashboard" element={
          <PageTransition>
            <Dashboard />
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        } />
      </Routes>

      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AppContent />
      </MotionConfig>
    </BrowserRouter>
  );
}

