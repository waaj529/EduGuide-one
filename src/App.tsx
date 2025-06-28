import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const Upload = lazy(() => import("./pages/Upload"));
const Practice = lazy(() => import("./pages/Practice"));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage"));
const StudyTimerPage = lazy(() => import("./pages/StudyTimerPage"));
const ReviewMistakes = lazy(() => import("./pages/ReviewMistakes"));
const ProgressTracker = lazy(() => import("./pages/ProgressTracker"));
const Profile = lazy(() => import("./pages/Profile"));
const StudentContentGenerator = lazy(() => import("./pages/StudentContentGenerator"));
const SubjectStudy = lazy(() => import("./pages/SubjectStudy"));

// Create an optimized query client with better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache queries for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep unused data in cache for 10 minutes  
      gcTime: 1000 * 60 * 10,
      // Retry failed requests only once in production
      retry: import.meta.env.PROD ? 1 : 3,
      // Don't refetch on window focus in production for better UX
      refetchOnWindowFocus: !import.meta.env.PROD,
    },
  },
});

// Role-based redirect component
const RoleBasedRedirect = () => {
  return <Navigate to="/login" replace />;
};

// Upload route wrapper to handle role-based redirection properly
const UploadRouteWrapper = () => {
  return (
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
              <div className="flex flex-col min-h-screen overflow-x-hidden">
                <Navbar />
                <main className="flex-1 w-full page-transition">
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                      <LoadingSpinner size="lg" text="Loading..." />
                    </div>
                  }>
                    <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Role-based redirect */}
                    <Route path="/dashboard-redirect" element={<RoleBasedRedirect />} />
                    
                    {/* Student routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* New Student Content Generator route */}
                    <Route path="/study-materials" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudentContentGenerator />
                      </ProtectedRoute>
                    } />
                    
                    {/* Subject Study with YouTube Videos */}
                    <Route path="/study/:subject" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <SubjectStudy />
                      </ProtectedRoute>
                    } />
                    
                    {/* Teacher routes */}
                    <Route path="/teacher-dashboard" element={
                      <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    } />
                    
                      {/* Upload route - now properly handled with role-based access */}
                      <Route path="/upload" element={<UploadRouteWrapper />} />
                    
                    {/* Other routes - primarily student focused */}
                    <Route path="/practice" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <Practice />
                      </ProtectedRoute>
                    } />
                    <Route path="/flashcards" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <FlashcardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/timer" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <StudyTimerPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/review" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <ReviewMistakes />
                      </ProtectedRoute>
                    } />
                    <Route path="/progress" element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <ProgressTracker />
                      </ProtectedRoute>
                    } />
                    
                    {/* Shared routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
              </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
