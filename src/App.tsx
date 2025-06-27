import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Upload from "./pages/Upload";
import Practice from "./pages/Practice";
import FlashcardPage from "./pages/FlashcardPage";
import StudyTimerPage from "./pages/StudyTimerPage";
import ReviewMistakes from "./pages/ReviewMistakes";
import ProgressTracker from "./pages/ProgressTracker";
import Profile from "./pages/Profile";
import StudentContentGenerator from "./pages/StudentContentGenerator";
import SubjectStudy from "./pages/SubjectStudy";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Create a new query client
const queryClient = new QueryClient();

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
