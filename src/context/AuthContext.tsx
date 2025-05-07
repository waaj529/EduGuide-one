
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: 'student' | 'teacher';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  switchRole: (role: 'student' | 'teacher') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check auth state on load and subscribe to auth changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
            role: data.session.user.user_metadata?.role || 'student'
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          
          // Set local storage for compatibility with existing code
          localStorage.setItem('eduguide_user_token', data.session.access_token);
          localStorage.setItem('eduguide_user_role', userData.role);
          localStorage.setItem('eduguide_user_name', userData.name || '');
        } else {
          setUser(null);
          setIsAuthenticated(false);
          
          // Clear local storage
          localStorage.removeItem('eduguide_user_token');
          localStorage.removeItem('eduguide_user_role');
          localStorage.removeItem('eduguide_user_name');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Call immediately
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          role: session.user.user_metadata?.role || 'student'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set local storage for compatibility with existing code
        localStorage.setItem('eduguide_user_token', session.access_token);
        localStorage.setItem('eduguide_user_role', userData.role);
        localStorage.setItem('eduguide_user_name', userData.name || '');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        
        // Clear local storage
        localStorage.removeItem('eduguide_user_token');
        localStorage.removeItem('eduguide_user_role');
        localStorage.removeItem('eduguide_user_name');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/' && 
            window.location.pathname !== '/login' && 
            !window.location.pathname.includes('/terms') && 
            !window.location.pathname.includes('/privacy')) {
          navigate('/login');
        }
      }
    });
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  // Switch role function
  const switchRole = async (role: 'student' | 'teacher') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to switch roles",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setUser({
        ...user,
        role
      });
      
      // Update local storage
      localStorage.setItem('eduguide_user_role', role);
      
      toast({
        title: `Switched to ${role === 'teacher' ? 'Teacher' : 'Student'} Mode`,
        description: `You now have access to ${role} features.`,
      });
      
      // Redirect to appropriate dashboard
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Role switch failed",
        description: error.message || "An error occurred while switching roles",
        variant: "destructive"
      });
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    switchRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
