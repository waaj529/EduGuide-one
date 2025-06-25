import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  // Check if user is already logged in and clear corrupted state
  useEffect(() => {
    const checkAndCleanSession = async () => {
      try {
        // Clear any corrupted localStorage data first
        localStorage.removeItem('eduguide_user_token');
        localStorage.removeItem('eduguide_user_role');
        localStorage.removeItem('eduguide_user_name');
        
        // Sign out any existing session to start fresh
        await supabase.auth.signOut();
        
        // Now check for a valid session
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Get user role from metadata
          const userRole = data.session.user?.user_metadata?.role || 'student';
          localStorage.setItem('eduguide_user_role', userRole);
          localStorage.setItem('eduguide_user_name', data.session.user?.user_metadata?.name || email.split('@')[0]);
          
          // Redirect to appropriate dashboard
          if (userRole === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.log('Session cleanup completed');
      }
    };
    
    checkAndCleanSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Store user info
      const userRole = data.user?.user_metadata?.role || 'student';
      localStorage.setItem('eduguide_user_token', data.session?.access_token || '');
      localStorage.setItem('eduguide_user_role', userRole);
      localStorage.setItem('eduguide_user_name', data.user?.user_metadata?.name || email.split('@')[0]);
      
      toast({
        title: "Logged in successfully",
        description: "Welcome to EduGuide AI",
      });
      
      // Redirect based on role
      if (userRole === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Store user info
      localStorage.setItem('eduguide_user_token', data.session?.access_token || '');
      localStorage.setItem('eduguide_user_role', role);
      localStorage.setItem('eduguide_user_name', name);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to EduGuide AI",
      });
      
      // Redirect based on role
      if (role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">EduGuide AI</CardTitle>
          <CardDescription className="text-center">
            Your AI-powered learning assistant
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I am a:</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="student-role" 
                        name="role"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRole("student")}
                        className="mr-2"
                      />
                      <Label htmlFor="student-role">Student</Label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="teacher-role" 
                        name="role"
                        value="teacher"
                        checked={role === "teacher"}
                        onChange={() => setRole("teacher")}
                        className="mr-2"
                      />
                      <Label htmlFor="teacher-role">Teacher</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm p-4 text-muted-foreground">
          By signing in, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </div>
      </Card>
    </div>
  );
};

export default Login;
