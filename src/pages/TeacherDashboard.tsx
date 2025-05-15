import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, GraduationCap, Upload, ArrowRight, PlusCircle, ChevronRight, ExternalLink, X, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { viewQuizPdf, viewSolutionPdf } from '@/services/api';
import PdfViewer from '@/components/features/PdfViewer';

// Add a simple modal component with proper TypeScript types
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [currentQuizTitle, setCurrentQuizTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState('https://python.iamscientist.ai/api/quiz/quiz_view');
  const [solutionPdfUrl, setSolutionPdfUrl] = useState('https://python.iamscientist.ai/api/quiz/sol_view');
  
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

  const handleViewQuizPdf = (quizTitle) => {
    // Use the callback version of viewQuizPdf to get the URL
    viewQuizPdf((url) => {
      setPdfUrl(url);
      setCurrentQuizTitle(quizTitle);
      setIsPdfModalOpen(true);
      
      toast({
        title: "Viewing Quiz PDF",
        description: `Displaying PDF for "${quizTitle}"`,
      });
    });
  };
  
  const handleViewSolutionPdf = (quizTitle) => {
    // Use the callback version of viewSolutionPdf to get the URL
    viewSolutionPdf((url) => {
      setSolutionPdfUrl(url);
      setCurrentQuizTitle(quizTitle);
      setIsSolutionModalOpen(true);
      
      toast({
        title: "Viewing Solution PDF",
        description: `Displaying solution for "${quizTitle}"`,
      });
    });
  };

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      {/* PDF Viewer Modal */}
      <Modal 
        isOpen={isPdfModalOpen} 
        onClose={() => setIsPdfModalOpen(false)} 
        title={`Quiz: ${currentQuizTitle}`}
      >
        <PdfViewer url={pdfUrl} height="70vh" />
      </Modal>
      
      {/* Solution Viewer Modal */}
      <Modal 
        isOpen={isSolutionModalOpen} 
        onClose={() => setIsSolutionModalOpen(false)} 
        title={`Solution for: ${currentQuizTitle}`}
      >
        <PdfViewer url={solutionPdfUrl} height="70vh" />
      </Modal>

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
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
            <TabsTrigger value="assignments" className="text-center">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes" className="text-center">Quizzes</TabsTrigger>
            <TabsTrigger value="exams" className="text-center">Proximity Handling</TabsTrigger>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="w-full bg-blue-50 dark:bg-blue-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-blue-600 mb-5">
                    <FileText className="h-6 w-6" />
                    <span className="text-xl font-semibold">Assignment Generator</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-12">
                    Create customized assignments from your uploaded content with specific learning objectives and difficulty levels.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=assignment" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-8 py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200">Get Started</span>
                          <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1" />
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
                  <CardHeader>
                    <CardTitle>Recent Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-4">
                        {recentAssignments.map(assignment => (
                          <div key={assignment.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                            <div>
                              <h3 className="font-medium">{assignment.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-3">{assignment.subject}</span>
                                <span>Created {assignment.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-4 text-sm">{assignment.students} students</span>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="w-full bg-purple-50 dark:bg-purple-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-purple-600 mb-5">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-xl font-semibold">Quiz Generator</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-12">
                    Generate interactive quizzes with multiple difficulty levels and question types based on your materials.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=quiz" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-8 py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200">Get Started</span>
                          <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1" />
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
                  <CardHeader>
                    <CardTitle>Recent Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-4">
                        {recentQuizzes.map(quiz => (
                          <div key={quiz.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                            <div>
                              <h3 className="font-medium">{quiz.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-3">{quiz.subject}</span>
                                <span>Created {quiz.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="mr-2 text-sm">{quiz.questions} questions</span>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewSolutionPdf(quiz.title)}
                                className="flex items-center px-2"
                              >
                                <BookOpenCheck className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Solution</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewQuizPdf(quiz.title)}
                                className="flex items-center px-2"
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              
                              <Button variant="ghost" size="sm" className="flex items-center px-2">
                                <ChevronRight className="h-4 w-4" />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="w-full bg-amber-50 dark:bg-amber-950/30 border-0 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-amber-600 mb-5">
                    <GraduationCap className="h-6 w-6" />
                    <span className="text-xl font-semibold">Proximity Handling</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-12">
                    Upload classroom images to automatically count student attendance and track proximity data.
                  </p>
                  <div className="w-full mt-auto">
                    <Link to="/upload?tab=proximity" className="w-full block">
                      <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-300 group">
                        <div className="flex items-center justify-between px-8 py-5">
                          <span className="font-medium text-gray-800 dark:text-gray-200">Get Started</span>
                          <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform group-hover:translate-x-1" />
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
                  <CardHeader>
                    <CardTitle>Recent Proximity Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-4">
                        {recentExams.map(exam => (
                          <div key={exam.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors">
                            <div>
                              <h3 className="font-medium">{exam.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <span className="mr-3">{exam.subject}</span>
                                <span>Created {exam.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-4 text-sm">{exam.questions} questions</span>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
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
