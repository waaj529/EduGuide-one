
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const AuthButtons = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    return (
      <Button 
        asChild 
        className="hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
      >
        <Link to={user?.role === 'teacher' ? '/teacher-dashboard' : '/dashboard'}>
          Go to Dashboard
        </Link>
      </Button>
    );
  }
  
  return (
    <Button 
      asChild 
      className="hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
    >
      <Link to="/login">
        Sign In
      </Link>
    </Button>
  );
};

export default AuthButtons;
