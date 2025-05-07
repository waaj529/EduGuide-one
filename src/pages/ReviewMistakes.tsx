
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Define interfaces
interface Question {
  id: number;
  question: string;
  answer?: string;
  feedback?: string;
  score?: number;
  type: 'long-answer' | 'short-answer' | 'calculation';
  isCalculation?: boolean;
}

interface PerformanceData {
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentCorrect: number;
  percentIncorrect: number;
  percentAttempted: number;
}

const ReviewMistakes = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("questions");
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data for the questions and performance
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "Define the head to tail rule and provide an example of its application.",
      type: "long-answer",
      feedback: "Good explanation of the head-to-tail rule. You correctly identified that it's used for vector addition, but your example lacked detail on how the resultant vector is calculated.",
      answer: "The head to tail rule is a graphical method for adding vectors. To add vectors using the head to tail rule, place the tail of the second vector at the head of the first vector. The resultant vector is drawn from the tail of the first vector to the head of the last vector.",
      score: 8
    },
    {
      id: 2,
      question: "What is gravitational field strength? Explain how it varies with distance from Earth's center.",
      type: "long-answer"
    },
    {
      id: 3,
      question: "Calculate the kinetic energy of a 2kg object moving at 5m/s.",
      type: "calculation",
      isCalculation: true
    }
  ]);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    total: 25,
    attempted: 18,
    correct: 12,
    incorrect: 6,
    percentCorrect: 48,
    percentIncorrect: 24,
    percentAttempted: 72
  });

  const pieChartData = [
    { name: 'Correct', value: performanceData.correct, color: '#4ade80' },
    { name: 'Incorrect', value: performanceData.incorrect, color: '#f87171' },
    { name: 'Unattempted', value: performanceData.total - performanceData.attempted, color: '#94a3b8' }
  ];

  const barChartData = [
    { name: 'Total', value: performanceData.total },
    { name: 'Attempted', value: performanceData.attempted },
    { name: 'Correct', value: performanceData.correct },
    { name: 'Incorrect', value: performanceData.incorrect }
  ];

  useEffect(() => {
    // API Integration Point: Fetch mistake questions from backend
    // In a real implementation, this would fetch the user's incorrect answers for review
    /*
    const fetchMistakes = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT/user/mistakes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch mistakes');
        }
        
        const data = await response.json();
        setQuestions(data.questions);
        setPerformanceData(data.performance);
      } catch (error) {
        console.error('Error fetching mistakes:', error);
        toast({
          title: "Failed to load review content",
          description: "There was a problem loading your review materials. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMistakes();
    */
    
    // For demo purposes
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    console.log("Review mistakes page loaded with simplified content and performance visualization");
  }, []);

  const handleAnswerChange = (text: string) => {
    setAnswerText(text);
  };

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) {
      toast({
        title: "Empty answer",
        description: "Please enter an answer before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // API Integration Point: Submit the answer for evaluation
    /*
    fetch('YOUR_API_ENDPOINT/evaluate_answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_id: questions[currentQuestionIndex].id,
        answer: answerText
      })
    })
    .then(response => response.json())
    .then(data => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        answer: answerText,
        feedback: data.feedback,
        score: data.score
      };
      
      setQuestions(updatedQuestions);
      
      // Update performance data
      setPerformanceData(prevData => {
        const isCorrect = data.score >= 7;
        return {
          ...prevData,
          correct: isCorrect ? prevData.correct + 1 : prevData.correct,
          incorrect: !isCorrect ? prevData.incorrect + 1 : prevData.incorrect,
          percentCorrect: ((isCorrect ? prevData.correct + 1 : prevData.correct) / prevData.total) * 100,
          percentIncorrect: ((!isCorrect ? prevData.incorrect + 1 : prevData.incorrect) / prevData.total) * 100
        };
      });
      
      setIsSubmitting(false);
      
      toast({
        title: "Answer evaluated",
        description: `Your answer received a score of ${data.score}/10`,
        variant: "default"
      });
    })
    .catch(error => {
      console.error('Error evaluating answer:', error);
      setIsSubmitting(false);
      toast({
        title: "Evaluation failed",
        description: "There was a problem evaluating your answer. Please try again.",
        variant: "destructive"
      });
    });
    */
    
    // For demo purposes
    setTimeout(() => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...updatedQuestions[currentQuestionIndex],
        answer: answerText,
        feedback: "Good attempt. You've covered the main concepts but missed some details about how the principle applies in real-world scenarios.",
        score: 7
      };
      
      setQuestions(updatedQuestions);
      setIsSubmitting(false);
      
      toast({
        title: "Answer evaluated",
        description: "Your answer received a score of 7/10",
        variant: "default"
      });
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerText('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswerText('');
    }
  };
  
  const handleUploadAnswerSheet = () => {
    // For demo purposes
    toast({
      title: "Upload feature",
      description: "Answer sheet upload functionality would be integrated here",
      variant: "default"
    });
  };

  // If there are no questions to review
  if (questions.length === 0 && !isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-10">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Review Mistakes</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No mistakes to review</AlertTitle>
              <AlertDescription>
                You haven't answered any questions incorrectly yet, or you haven't practiced enough.
                Try practicing more to generate review materials.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={() => navigate('/practice')}>
                Go to Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Review Mistakes</h1>
          <p className="text-muted-foreground mt-2">Review your previous mistakes to improve your understanding</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Tabs defaultValue="questions" onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-10 h-10 border-t-2 border-brand-blue border-solid rounded-full animate-spin mb-4"></div>
                    <p>Loading your review questions...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                        Previous
                      </Button>
                      <Button variant="outline" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                        Next
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-lg font-medium">{questions[currentQuestionIndex].question}</p>
                  </div>
                  
                  {questions[currentQuestionIndex].answer ? (
                    <div className="space-y-4">
                      <div className="border p-4 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Your Answer:</h3>
                        <p>{questions[currentQuestionIndex].answer}</p>
                      </div>
                      
                      {questions[currentQuestionIndex].feedback && (
                        <div className="border p-4 rounded-md bg-muted">
                          <h3 className="text-sm font-medium mb-2">Feedback:</h3>
                          <p>{questions[currentQuestionIndex].feedback}</p>
                        </div>
                      )}
                      
                      {questions[currentQuestionIndex].score !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Score:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            questions[currentQuestionIndex].score! >= 7 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          }`}>
                            {questions[currentQuestionIndex].score}/10
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <textarea
                          className="w-full min-h-[200px] p-4 border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          placeholder="Type your answer here..."
                          value={answerText}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button onClick={handleUploadAnswerSheet} variant="outline">
                          Upload Answer Sheet
                        </Button>
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Answer"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm">Total Questions</p>
                    <p className="text-3xl font-bold mt-2">{performanceData.total}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm">Attempted</p>
                    <p className="text-3xl font-bold mt-2">{performanceData.attempted}</p>
                    <p className="text-sm mt-1">({performanceData.percentAttempted}%)</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
                    <p className="text-green-800 dark:text-green-100 text-sm">Correct</p>
                    <p className="text-3xl font-bold mt-2 text-green-800 dark:text-green-100">{performanceData.correct}</p>
                    <p className="text-sm mt-1 text-green-800 dark:text-green-100">({performanceData.percentCorrect}%)</p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900 rounded-lg p-4 text-center">
                    <p className="text-red-800 dark:text-red-100 text-sm">Incorrect</p>
                    <p className="text-3xl font-bold mt-2 text-red-800 dark:text-red-100">{performanceData.incorrect}</p>
                    <p className="text-sm mt-1 text-red-800 dark:text-red-100">({performanceData.percentIncorrect}%)</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{performanceData.percentAttempted}%</span>
                    </div>
                    <Progress value={performanceData.percentAttempted} className="h-2" />
                    
                    <div className="flex justify-between text-sm mt-4">
                      <span>Success Rate</span>
                      <span>{performanceData.attempted > 0 ? Math.round((performanceData.correct / performanceData.attempted) * 100) : 0}%</span>
                    </div>
                    <Progress value={performanceData.attempted > 0 ? (performanceData.correct / performanceData.attempted) * 100 : 0} className="h-2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Question Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Question Metrics</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Improvement Suggestions</h3>
                  <div className="space-y-2">
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">Focus on concept understanding</p>
                      <p className="text-sm text-muted-foreground mt-1">Your answers show a need to strengthen fundamental concepts. Try reviewing basic principles before moving to complex problems.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">Practice calculation problems</p>
                      <p className="text-sm text-muted-foreground mt-1">You scored lower on calculation-type questions. Dedicate more time to practicing step-by-step problem solving.</p>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="font-medium">Use flashcards for key definitions</p>
                      <p className="text-sm text-muted-foreground mt-1">Create flashcards for important definitions and formulas to improve recall during exams.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewMistakes;
