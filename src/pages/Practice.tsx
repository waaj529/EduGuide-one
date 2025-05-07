import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import ShareButton from '@/components/features/ShareButton';
import { CheckCircle, XCircle, BarChart2, Filter, Save, RotateCcw, AlertTriangle } from "lucide-react";
import useMediaQuery, { breakpoints } from '@/hooks/useMediaQuery';

// Define the question type and difficulty level types
type QuestionType = "multiple-choice" | "short-answer" | "calculation";
type DifficultyLevel = "basic" | "intermediate" | "advanced";

// Define the Question interface
interface Question {
  id: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl: string | null;
}

// Sample questions data with proper typing - updated to focus on programming topics
const sampleQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "basic",
    topic: "Programming Fundamentals",
    question: "What is the correct syntax for a 'for' loop in JavaScript?",
    options: [
      "for (i = 0; i < 5; i++)", 
      "for i = 1 to 5", 
      "for (i < 5; i++)", 
      "loop for i = 0 to 5"
    ],
    correctAnswer: "for (i = 0; i < 5; i++)",
    explanation: "In JavaScript, a for loop is constructed with three parts: initialization (i = 0), condition (i < 5), and increment expression (i++).",
    imageUrl: null
  },
  {
    id: 2,
    type: "multiple-choice",
    difficulty: "basic",
    topic: "Data Structures",
    question: "Which data structure operates on a LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack",
    explanation: "A stack is a linear data structure that follows the LIFO principle - the last element added is the first one to be removed.",
    imageUrl: null
  },
  {
    id: 3,
    type: "multiple-choice",
    difficulty: "intermediate",
    topic: "Object-Oriented Programming",
    question: "What is encapsulation in OOP?",
    options: [
      "The ability of a class to inherit properties from another class", 
      "The process of hiding implementation details and showing only functionality", 
      "The ability of a class to take on many forms", 
      "The grouping of related functions"
    ],
    correctAnswer: "The process of hiding implementation details and showing only functionality",
    explanation: "Encapsulation is one of the four fundamental principles of OOP. It involves bundling data and methods that operate on that data within a single unit (class) and restricting access to some of the object's components.",
    imageUrl: null
  },
  {
    id: 4,
    type: "multiple-choice",
    difficulty: "basic",
    topic: "Database Systems",
    question: "Which SQL command is used to retrieve data from a database?",
    options: ["UPDATE", "INSERT", "SELECT", "ALTER"],
    correctAnswer: "SELECT",
    explanation: "The SELECT statement is used to select data from a database. The data returned is stored in a result table, called the result-set.",
    imageUrl: null
  },
  {
    id: 5,
    type: "short-answer",
    difficulty: "intermediate",
    topic: "Algorithms",
    question: "What is the time complexity of binary search algorithm?",
    correctAnswer: "O(log n)",
    explanation: "Binary search is a divide and conquer algorithm that has a logarithmic time complexity. In each step, it halves the search space, resulting in O(log n) time complexity.",
    imageUrl: null
  },
  {
    id: 6,
    type: "calculation",
    difficulty: "advanced",
    topic: "Computational Complexity",
    question: "If an algorithm takes 2 seconds to process 1000 items, approximately how long will it take to process 4000 items if its complexity is O(n²)?",
    correctAnswer: "32 seconds",
    explanation: "For an O(n²) algorithm, when the input size increases by a factor of 4, the processing time increases by a factor of 4² = 16. So 2 seconds × 16 = 32 seconds.",
    imageUrl: null
  }
];

interface AnswerHistory {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  topic: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
}

const Practice = () => {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(sampleQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [score, setScore] = useState(0);
  
  // Filters
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<QuestionType | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | null>(null);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = !useMediaQuery(breakpoints.lg);

  // Analytics data
  const [weakTopics, setWeakTopics] = useState<{topic: string, correctPercent: number}[]>([]);
  const [typePerformance, setTypePerformance] = useState<{type: QuestionType, correctPercent: number}[]>([]);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...questions];
    
    if (topicFilter) {
      filtered = filtered.filter(q => q.topic === topicFilter);
    }
    
    if (typeFilter) {
      filtered = filtered.filter(q => q.type === typeFilter);
    }
    
    if (difficultyFilter) {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }
    
    setFilteredQuestions(filtered);
    // Reset to the first question when filters change
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTextAnswer("");
    setIsAnswerSubmitted(false);
  }, [topicFilter, typeFilter, difficultyFilter, questions]);
  
  // Generate weak topics analytics
  useEffect(() => {
    if (answerHistory.length === 0) return;
    
    // Calculate performance by topic
    const topicStats = answerHistory.reduce<Record<string, {correct: number, total: number}>>((acc, answer) => {
      if (!acc[answer.topic]) {
        acc[answer.topic] = { correct: 0, total: 0 };
      }
      
      acc[answer.topic].total += 1;
      if (answer.isCorrect) {
        acc[answer.topic].correct += 1;
      }
      
      return acc;
    }, {});
    
    const topicsAnalysis = Object.entries(topicStats)
      .map(([topic, stats]) => ({
        topic,
        correctPercent: (stats.correct / stats.total) * 100
      }))
      .sort((a, b) => a.correctPercent - b.correctPercent);
    
    setWeakTopics(topicsAnalysis);
    
    // Calculate performance by question type
    const typeStats = answerHistory.reduce<Record<QuestionType, {correct: number, total: number}>>((acc, answer) => {
      if (!acc[answer.type]) {
        acc[answer.type] = { correct: 0, total: 0 };
      }
      
      acc[answer.type].total += 1;
      if (answer.isCorrect) {
        acc[answer.type].correct += 1;
      }
      
      return acc;
    }, {} as Record<QuestionType, {correct: number, total: number}>);
    
    const typeAnalysis = Object.entries(typeStats)
      .map(([type, stats]) => ({
        type: type as QuestionType,
        correctPercent: (stats.correct / stats.total) * 100
      }))
      .sort((a, b) => a.correctPercent - b.correctPercent);
    
    setTypePerformance(typeAnalysis);
  }, [answerHistory]);

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };
  
  const handleTextAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAnswerSubmitted) {
      setTextAnswer(e.target.value);
    }
  };

  const handleSubmitAnswer = () => {
    const currentQ = filteredQuestions[currentQuestion];
    const answer = currentQ.type === "multiple-choice" ? selectedAnswer : textAnswer;
    
    if (!answer) {
      toast({
        title: "No answer provided",
        description: "Please select or enter an answer",
        variant: "destructive"
      });
      return;
    }
    
    const isCorrect = 
      currentQ.type === "multiple-choice" 
        ? answer === currentQ.correctAnswer
        : answer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
    
    // Record answer in history
    setAnswerHistory([...answerHistory, {
      questionId: currentQ.id,
      userAnswer: answer,
      isCorrect,
      topic: currentQ.topic,
      type: currentQ.type,
      difficulty: currentQ.difficulty
    }]);
    
    setIsAnswerSubmitted(true);
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Great job! Your answer is correct.",
        variant: "default"
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer is: ${currentQ.correctAnswer}`,
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTextAnswer("");
      setIsAnswerSubmitted(false);
    } else {
      toast({
        title: "Practice session complete!",
        description: `You scored ${score} out of ${filteredQuestions.length}`,
        variant: "default"
      });
    }
  };
  
  const regenerateQuestions = () => {
    setIsLoading(true);
    
    // Simulate API call to generate new questions
    setTimeout(() => {
      // In a real app, this would be an API call to generate new questions
      setIsLoading(false);
      
      // Reset state
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setTextAnswer("");
      setIsAnswerSubmitted(false);
      
      toast({
        title: "Questions Regenerated",
        description: "New practice questions have been generated based on your materials.",
        variant: "default"
      });
    }, 1500);
  };
  
  const saveQuestionSet = () => {
    toast({
      title: "Question Set Saved",
      description: "This question set has been saved to your library for later use.",
      variant: "default"
    });
  };

  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
  
  // Get unique topics for filter
  const topics = Array.from(new Set(questions.map(q => q.topic)));
  const currentQ = filteredQuestions[currentQuestion];
  
  if (filteredQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-8">No questions match your current filter criteria. Try adjusting your filters or generate new questions.</p>
          <Button onClick={() => {
            setTopicFilter(null);
            setTypeFilter(null);
            setDifficultyFilter(null);
          }}>
            Clear Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Practice Questions</h1>
            <p className="text-muted-foreground mt-2">Test your knowledge with these practice questions</p>
          </div>
          
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" onClick={regenerateQuestions} disabled={isLoading}>
              <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
            <Button variant="outline" onClick={saveQuestionSet}>
              <Save className="w-4 h-4 mr-2" />
              Save Set
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 p-4 bg-muted rounded-lg animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={topicFilter || ""}
                  onChange={(e) => setTopicFilter(e.target.value || null)}
                >
                  <option value="">All Topics</option>
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Question Type</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={typeFilter || ""}
                  onChange={(e) => setTypeFilter((e.target.value || null) as QuestionType | null)}
                >
                  <option value="">All Types</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="calculation">Calculation</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <select 
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={difficultyFilter || ""}
                  onChange={(e) => setDifficultyFilter((e.target.value || null) as DifficultyLevel | null)}
                >
                  <option value="">All Levels</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-1">
                    <Badge className="mr-2" variant={
                      currentQ.difficulty === "basic" ? "outline" :
                      currentQ.difficulty === "intermediate" ? "secondary" : "default"
                    }>
                      {currentQ.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQ.topic}</Badge>
                  </div>
                  <CardTitle>Question {currentQuestion + 1} of {filteredQuestions.length}</CardTitle>
                </div>
                <ShareButton />
              </div>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-6">{currentQ.question}</h2>
                
                {currentQ.type === "multiple-choice" && (
                  <RadioGroup value={selectedAnswer || ""} className="space-y-3">
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={isAnswerSubmitted}
                          className="data-[state=checked]:border-primary data-[state=checked]:border-2"
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className={`flex-1 p-3 rounded-md hover:bg-muted cursor-pointer transition-colors ${
                            isAnswerSubmitted && option === currentQ.correctAnswer
                              ? "bg-green-100 dark:bg-green-900/20"
                              : isAnswerSubmitted && selectedAnswer === option && option !== currentQ.correctAnswer
                              ? "bg-red-100 dark:bg-red-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {isAnswerSubmitted && option === currentQ.correctAnswer && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                            {isAnswerSubmitted && selectedAnswer === option && option !== currentQ.correctAnswer && (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {(currentQ.type === "short-answer" || currentQ.type === "calculation") && (
                  <div className="mt-4">
                    <label htmlFor="text-answer" className="block text-sm font-medium mb-2">
                      Your Answer:
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        id="text-answer"
                        value={textAnswer}
                        onChange={handleTextAnswerChange}
                        disabled={isAnswerSubmitted}
                        placeholder={currentQ.type === "calculation" ? "Enter numerical answer..." : "Type your answer..."}
                        className="flex-1 h-10 rounded-md border border-input px-3 py-2"
                      />
                    </div>
                    
                    {isAnswerSubmitted && (
                      <div className={`mt-3 p-3 rounded-md ${textAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim() ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                        <div className="flex items-center">
                          {textAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim() ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <span className="text-sm font-medium">
                            {textAnswer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim() 
                              ? "Correct!" 
                              : `Incorrect. Correct answer: ${currentQ.correctAnswer}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAnswerSubmitted && (
                <div className="p-4 rounded-lg bg-muted mt-4 animate-fade-in">
                  <h3 className="font-medium mb-2">Explanation:</h3>
                  <p className="text-sm">{currentQ.explanation}</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {!isAnswerSubmitted ? (
                <Button onClick={handleSubmitAnswer} disabled={currentQ.type === "multiple-choice" ? !selectedAnswer : !textAnswer}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} disabled={currentQuestion === filteredQuestions.length - 1}>
                  {currentQuestion === filteredQuestions.length - 1 ? "Finish" : "Next Question"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="col-span-1">
          <Tabs defaultValue="progress">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold">{score}</div>
                    <div className="text-muted-foreground">Correct out of {isAnswerSubmitted ? currentQuestion + 1 : currentQuestion}</div>
                    
                    {answerHistory.length > 0 && (
                      <div className="mt-4 mb-6">
                        <Progress 
                          value={(score / answerHistory.length) * 100}
                          className="h-2.5"
                        />
                        <div className="text-sm text-muted-foreground mt-1 text-right">
                          {Math.round((score / answerHistory.length) * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Question History</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {answerHistory.map((record, index) => {
                        return (
                          <div key={index} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${record.isCorrect ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                              {record.isCorrect ? '✓' : '✗'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="truncate text-sm">Question {index + 1}</div>
                              <div className="text-xs text-muted-foreground">{record.topic} · {record.type}</div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {answerHistory.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          No questions answered yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {answerHistory.length > 0 ? (
                    <>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Areas to Review</h3>
                        {weakTopics.length > 0 ? (
                          <div className="space-y-2">
                            {weakTopics.slice(0, 3).map((topic, index) => (
                              <div key={index} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{topic.topic}</span>
                                  <span>{Math.round(topic.correctPercent)}%</span>
                                </div>
                                <Progress 
                                  value={topic.correctPercent} 
                                  className="h-2"
                                  color={topic.correctPercent < 50 ? "bg-red-500" : topic.correctPercent < 70 ? "bg-yellow-500" : "bg-green-500"}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Not enough data yet
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Performance by Question Type</h3>
                        {typePerformance.length > 0 ? (
                          <div className="space-y-2">
                            {typePerformance.map((type, index) => (
                              <div key={index} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{type.type.replace('-', ' ')}</span>
                                  <span>{Math.round(type.correctPercent)}%</span>
                                </div>
                                <Progress 
                                  value={type.correctPercent} 
                                  className="h-2"
                                  color={type.correctPercent < 50 ? "bg-red-500" : type.correctPercent < 70 ? "bg-yellow-500" : "bg-green-500"}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Not enough data yet
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <h3 className="text-sm font-medium mb-2">Suggested Next Steps</h3>
                        {weakTopics.length > 0 && weakTopics[0].correctPercent < 70 ? (
                          <div className="text-sm">
                            <p className="mb-2">Review materials on: <span className="font-medium">{weakTopics[0].topic}</span></p>
                            <Button size="sm" variant="outline" className="w-full">
                              Generate Focused Questions
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Keep practicing to generate personalized suggestions
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <BarChart2 className="h-12 w-12 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium mb-1">No Analysis Yet</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Answer more questions to see your performance analytics
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Practice;
