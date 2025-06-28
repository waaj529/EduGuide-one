import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, GraduationCap, Upload, ArrowRight, PlusCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in as teacher
    const userRole = localStorage.getItem('eduguide_user_role');
    
    if (userRole !== 'teacher') {
      // Set user role to teacher (for development purposes)
      localStorage.setItem('eduguide_user_role', 'teacher');
      localStorage.setItem('eduguide_user_token', 'teacher-token');
      
      // Show notification
      toast({
        title: "Teacher mode activated",
        description: "You now have access to teacher features",
      });
    }
    
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Sample data for recent resources
  const recentAssignments = [
    { id: 1, title: "Introduction to Algebra", createdAt: "2 days ago", subject: "Mathematics", students: 32 },
    { id: 2, title: "Programming Fundamentals", createdAt: "5 days ago", subject: "Computer Science", students: 28 },
  ];
  
  const recentQuizzes = [
    { id: 1, title: "Data Structures Quiz", createdAt: "1 day ago", subject: "Computer Science", questions: 15 },
    { id: 2, title: "Introduction to Physics", createdAt: "3 days ago", subject: "Physics", questions: 20 },
  ];
  
  const recentExams = [
    { id: 1, title: "Midterm Examination", createdAt: "6 days ago", subject: "Computer Science", questions: 30 },
    { id: 2, title: "Final Assessment", createdAt: "2 weeks ago", subject: "Mathematics", questions: 40 },
  ];

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      <section className="mb-10">
        <div className="w-full rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4" style={{ color: "white" }}>
              <GraduationCap className="w-4 h-4 mr-2 text-white" />
              <span className="text-white">Teacher Dashboard</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Create Educational <span className="text-white">Content</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 max-w-2xl">
              Generate assignments, quizzes, and exam papers with AI. Upload your syllabus or course materials
              to create comprehensive educational content for your students.
            </p>
            
            <Button 
              variant="default"
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
            >
              <Link to="/upload" className="flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Materials
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-lg mx-auto">
            <TabsTrigger value="assignments" className="text-center px-2 sm:px-3">
              <span className="text-xs sm:text-sm truncate">Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="text-center px-2 sm:px-3">
              <span className="text-xs sm:text-sm truncate">Quizzes</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="text-center px-1 sm:px-3">
              <span className="text-xs sm:text-sm truncate">
                <span className="sm:hidden">Proximity</span>
                <span className="hidden sm:inline">Proximity Handling</span>
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-2xl font-bold">Assignment Generator</h2>
              <Link 
                to="/upload?tab=assignment" 
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center group"
              >
                Create New Assignment
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="w-full bg-blue-50 dark:bg-blue-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 md:gap-3 text-blue-600 mb-4 md:mb-5">
                    <FileText className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-semibold">Assignment Generator</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-12 text-sm md:text-base">
                    Create customized assignments from your uploaded content with specific learning objectives and difficulty levels.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=assignment" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">Get Started</span>
                          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {isLoading ? (
                <div className="space-y-4 col-span-2">
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : recentAssignments.length > 0 ? (
                <Card className="col-span-1 md:col-span-2 shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl">Recent Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {recentAssignments.map(assignment => (
                          <div key={assignment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md hover:bg-muted transition-colors gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm md:text-base truncate">{assignment.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-muted-foreground gap-1 sm:gap-3">
                                <span>{assignment.subject}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Created {assignment.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                              <span className="text-xs md:text-sm font-medium">{assignment.students} students</span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card className="col-span-1 md:col-span-2">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[220px] text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No assignments yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your teaching materials to create your first assignment
                    </p>
                    <Button asChild>
                      <Link to="/upload" className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="quizzes" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-2xl font-bold">Quiz Generator</h2>
              <Link 
                to="/upload?tab=quiz" 
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center group"
              >
                Create New Quiz
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="w-full bg-purple-50 dark:bg-purple-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 md:gap-3 text-purple-600 mb-4 md:mb-5">
                    <BookOpen className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-semibold">Quiz Generator</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-12 text-sm md:text-base">
                    Generate interactive quizzes with multiple difficulty levels and question types based on your materials.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=quiz" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">Get Started</span>
                          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {isLoading ? (
                <div className="space-y-4 col-span-2">
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : recentQuizzes.length > 0 ? (
                <Card className="col-span-1 md:col-span-2 shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl">Recent Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {recentQuizzes.map(quiz => (
                          <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md hover:bg-muted transition-colors gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm md:text-base truncate">{quiz.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-muted-foreground gap-1 sm:gap-3">
                                <span>{quiz.subject}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Created {quiz.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                              <span className="text-xs md:text-sm font-medium">{quiz.questions} questions</span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card className="col-span-1 md:col-span-2">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[220px] text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No quizzes yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload your teaching materials to create your first quiz
                    </p>
                    <Button asChild>
                      <Link to="/upload" className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Quiz
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="exams" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-2xl font-bold">Proximity Handling</h2>
              <Link 
                to="/upload?tab=proximity" 
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center group"
              >
                Create New Proximity Session
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="w-full bg-amber-50 dark:bg-amber-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 md:gap-3 text-amber-600 mb-4 md:mb-5">
                    <GraduationCap className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                    <span className="text-lg md:text-xl font-semibold">Proximity Handling</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-12 text-sm md:text-base">
                    Upload classroom images to automatically count student attendance and track proximity data.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=proximity" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm md:text-base">Get Started</span>
                          <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {isLoading ? (
                <div className="space-y-4 col-span-2">
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                  <div className="w-full h-16 bg-muted animate-pulse rounded-md"></div>
                </div>
              ) : recentExams.length > 0 ? (
                <Card className="col-span-1 md:col-span-2 shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg md:text-xl">Recent Proximity Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        {recentExams.map(exam => (
                          <div key={exam.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md hover:bg-muted transition-colors gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm md:text-base truncate">{exam.title}</h3>
                              <div className="flex flex-col sm:flex-row sm:items-center text-xs md:text-sm text-muted-foreground gap-1 sm:gap-3">
                                <span>{exam.subject}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Created {exam.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                              <span className="text-xs md:text-sm font-medium">{exam.questions} questions</span>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card className="col-span-1 md:col-span-2">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[220px] text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No proximity sessions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload classroom images to track your first attendance session
                    </p>
                    <Button asChild>
                      <Link to="/upload?tab=proximity" className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Proximity Session
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-all glow-on-hover h-full">
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4 elastic-bounce">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Assignment</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                Generate customized assignments with learning objectives
              </p>
              <Button variant="outline" asChild className="w-full shimmer">
                <Link to="/upload?tab=assignment">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all glow-on-hover h-full">
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4 elastic-bounce">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Quiz</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                Generate multiple-choice and short answer quizzes
              </p>
              <Button variant="outline" asChild className="w-full shimmer">
                <Link to="/upload?tab=quiz">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-all glow-on-hover h-full">
            <CardContent className="p-6 flex flex-col items-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4 elastic-bounce">
                <GraduationCap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Proximity Handling</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">
                Upload classroom images to automatically track student attendance
              </p>
              <Button variant="outline" asChild className="w-full shimmer">
                <Link to="/upload?tab=proximity">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
