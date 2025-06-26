import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Upload,
  NotebookPen,
  BookText,
  User,
  CheckCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';

const LearningMaterialsSection = () => {
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for user role in localStorage
    const storedRole = localStorage.getItem('eduguide_user_role') as 'student' | 'teacher' | null;
    setUserRole(storedRole);
    
    // If no role is set, default to student for demo purposes
    if (!storedRole) {
      setUserRole('student');
      localStorage.setItem('eduguide_user_role', 'student');
    }
  }, []);
  
  const switchRole = (role: 'student' | 'teacher') => {
    localStorage.setItem('eduguide_user_role', role);
    setUserRole(role);
    
    // Navigate to appropriate dashboard
    if (role === 'teacher') {
      navigate('/teacher-dashboard');
      toast({
        title: "Switched to Teacher Mode",
        description: "You now have access to teacher features.",
        variant: "default",
      });
    } else {
      navigate('/dashboard');
      toast({
        title: "Switched to Student Mode",
        description: "You now have access to student features.",
        variant: "default",
      });
    }
  };
  
  // Teacher-specific cards for content generation
  const teacherCards = [
    {
      icon: <FileText className="h-7 w-7 text-primary" />,
      title: "Assignment Generator",
      description: "Create customized assignments from your uploaded content with specific learning objectives and difficulty levels.",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-100 dark:border-blue-800",
      link: "/upload?type=assignments"
    },
    {
      icon: <BookOpen className="h-7 w-7 text-blue-500" />,
      title: "Quiz Generator",
      description: "Generate interactive quizzes with multiple difficulty levels and question types based on your materials.",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-100 dark:border-purple-800",
      link: "/upload?type=quizzes"
    },
    {
      icon: <GraduationCap className="h-7 w-7 text-amber-500" />,
      title: "Exam Question Generator",
      description: "Create comprehensive exam questions that test various aspects of your content with answer evaluation.",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-100 dark:border-amber-800",
      link: "/upload?type=exams"
    }
  ];
  
  // Student-specific cards for learning
  const studentCards = [
    {
      icon: <NotebookPen className="h-7 w-7 text-teal-500" />,
      title: "Study Material Generator",
      description: "Generate AI-powered study materials from your course content with practice questions and answers.",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
      borderColor: "border-teal-100 dark:border-teal-800",
      link: "/study-materials"
    },
    {
      icon: <BookText className="h-7 w-7 text-indigo-500" />,
      title: "Exam Preparation",
      description: "Create flashcards, summaries, and practice tests to prepare for your upcoming exams.",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      borderColor: "border-indigo-100 dark:border-indigo-800",
      link: "/study-materials"
    },
    {
      icon: <User className="h-7 w-7 text-rose-500" />,
      title: "Personalized Learning",
      description: "Get personalized learning paths and feedback on your practice answers to improve your understanding.",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      borderColor: "border-rose-100 dark:border-rose-800",
      link: "/study-materials"
    }
  ];
  
  // Display cards based on user role
  const displayCards = userRole === 'teacher' ? teacherCards : studentCards;
  
  return (
    <div className="py-16 px-4 md:px-8 w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to EduGuide AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {userRole === 'teacher' 
            ? "Generate high-quality educational content with our AI-powered tools for your students."
                            : "Upload your documents and get study materials generated automatically."
          }
        </p>
        
        {userRole && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {userRole === 'teacher' ? (
              <>
                <GraduationCap className="h-4 w-4 mr-2" />
                Teacher Mode
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Student Mode
              </>
            )}
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {displayCards.map((card, index) => (
          <div 
            key={index} 
            className={`${card.bgColor} rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] border ${card.borderColor}`}
          >
            <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
              {card.icon}
            </div>
            
            <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
            
            <p className="text-muted-foreground mb-8">
              {card.description}
            </p>
            
            <Link to={card.link}>
              <Button variant="ghost" className="flex items-center group hover:bg-primary/10">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Link to={userRole === 'teacher' ? "/upload" : "/study-materials"}>
          <Button size="lg" className="group bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-lg transition-all duration-300 hover:shadow-lg">
            <Upload className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-[-2px]" />
            {userRole === 'teacher' ? "Upload Teaching Materials" : "Upload Study Materials"}
          </Button>
        </Link>
      </div>
      
      {/* Role Selection Section - Designed better */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-8 border border-blue-100 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Experience</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          EduGuide AI offers tailored experiences for both students and teachers. Select your role to access features designed specifically for your needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card 
            className={`hover:shadow-md transition-all cursor-pointer ${userRole === 'student' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => switchRole('student')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 mt-4">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Student Mode</h3>
              <p className="text-muted-foreground mb-6">
                Access personalized study materials, practice questions, flashcards, and track your learning progress
              </p>
              
              {userRole === 'student' ? (
                <div className="flex items-center text-primary">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Currently Active</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => switchRole('student')}
                  className="w-full"
                >
                  Switch to Student
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card 
            className={`hover:shadow-md transition-all cursor-pointer ${userRole === 'teacher' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => switchRole('teacher')}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4 mt-4">
                <GraduationCap className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Teacher Mode</h3>
              <p className="text-muted-foreground mb-6">
                Create assignments, quizzes, and exams from your teaching materials and monitor student performance
              </p>
              
              {userRole === 'teacher' ? (
                <div className="flex items-center text-primary">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Currently Active</span>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => switchRole('teacher')}
                  className="w-full"
                >
                  Switch to Teacher
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningMaterialsSection;
