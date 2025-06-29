import React, { useState, useCallback, memo } from "react";
import { logger } from "@/lib/console";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileType,
  BookText,
  Lightbulb,
  PenBox,
  Loader2,
  Send,
  MessagesSquare,
  UserCircle,
  BotIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import GeneratedQuestions from "@/components/features/GeneratedQuestions";
import MaterialUploader from "@/components/features/MaterialUploader";
import PracticeQuestionItem from "@/components/features/PracticeQuestionItem";
import GeneratedSummary from "@/components/features/GeneratedSummary";
import GeneratedKeyPoints from "@/components/features/GeneratedKeyPoints";
import { motion } from "framer-motion";
import {
  generatePracticeQuestions,
  evaluatePracticeAnswer,
  generateSummary as apiGenerateSummary,
  generateKeyPoints as apiGenerateKeyPoints,
  PracticeQuestion,
} from "@/services/api";
import axios from "axios";

const StudentContentGenerator = () => {
  const [activeTab, setActiveTab] = useState("questions");
  
  // Questions tab state
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  
  // Chat with PDF tab state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Summary tab state
  const [summaryFile, setSummaryFile] = useState<File | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string>("");

  // Key points tab state
  const [keyPointsFile, setKeyPointsFile] = useState<File | null>(null);
  const [isGeneratingKeyPoints, setIsGeneratingKeyPoints] = useState(false);
  const [generatedKeyPoints, setGeneratedKeyPoints] = useState<string[]>([]);

  const handleQuestionFileSelected = (file: File) => {
    setQuestionFile(file);
    toast({
      title: "File selected for questions",
      description: `${file.name} is ready to process for practice questions.`,
    });
  };

  const handleSummaryFileSelected = (file: File) => {
    setSummaryFile(file);
    toast({
      title: "File selected for summary",
      description: `${file.name} is ready to process for summary.`,
    });
  };

  const handleKeyPointsFileSelected = (file: File) => {
    setKeyPointsFile(file);
    toast({
      title: "File selected for key points",
      description: `${file.name} is ready to process for key points.`,
    });
  };

  const handlePdfFileSelected = (file: File) => {
    setPdfFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPdfUrl(fileUrl);
    toast({
      title: "PDF loaded for chat",
      description: `${file.name} is ready for your questions.`,
    });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !pdfFile) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Create form data for API request with exact parameter names from Postman example
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("text", currentMessage);  // Changed from "query" to "text" to match Postman
      
      logger.log("Sending request with:", {
        fileSize: pdfFile.size,
        fileName: pdfFile.name,
        fileType: pdfFile.type,
        text: currentMessage
      });

      try {
        // First try with the API
        const controller = new AbortController();
        // Set timeout of 30 seconds
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch("https://python.iamscientist.ai/api/chatpdf/chatpdf", {
          method: "POST",
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Log the response status for debugging
        logger.log("API Response status:", response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          logger.log("API Response data:", data);
          
          // Add bot response to chat - "Answer" is the key from your screenshot
          const botMessage = { 
            role: 'bot' as const, 
            content: data.Answer || data.answer || data.response || "I couldn't find an answer to your question." 
          };
          setChatMessages(prev => [...prev, botMessage]);
        } else {
          // Server error occurred - use fallback response
          logger.error(`API error: ${response.status} ${response.statusText}`);
          
          // Get error details if available
          let errorDetail = '';
          try {
            const errorText = await response.text();
            logger.error("API error details:", errorText);
            errorDetail = errorText.includes("<!doctype html>") 
              ? "The server encountered an internal error." 
              : errorText;
          } catch (e) {
            errorDetail = "Could not retrieve error details";
          }
          
          // Add user-friendly error message to chat
          const errorMessage = { 
            role: 'bot' as const, 
            content: "I'm sorry, I couldn't process the PDF at the moment. The server is experiencing technical difficulties. Please try again later or with a different document."
          };
          setChatMessages(prev => [...prev, errorMessage]);
          
          toast({
            title: "Server Error",
            description: "The PDF processing service is currently unavailable. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (apiError) {
        console.error("API request failed:", apiError);
        
        let errorMessage = "Network error occurred. Please check your connection.";
        if (apiError instanceof Error) {
          if (apiError.name === 'AbortError') {
            errorMessage = "Request timed out. The server took too long to respond.";
          } else {
            errorMessage = apiError.message;
          }
        }
        
        // Add user-friendly error message to chat
        setChatMessages(prev => [
          ...prev,
          {
            role: 'bot' as const,
            content: "I'm having trouble connecting to the server. Please check your internet connection and try again."
          }
        ]);
        
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unhandled error in chat with PDF:", error);
      
      // Add error message to chat
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'bot' as const, 
          content: "Sorry, something went wrong. Please try again later."
        }
      ]);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async () => {
    if (!questionFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate questions.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingQuestions(true);

    try {
      // Create FormData with all required fields that exam_generate endpoint expects
      const form = new FormData();
      form.append("file", questionFile);
      
      // Add required fields with proper values matching successful endpoints
      form.append("department", "Computer Science");
      form.append("subject", "General Studies");
      form.append("class", "Practice Session");
      form.append("due_date", new Date().toISOString().split('T')[0]); // Today's date
      form.append("points", "10");
      form.append("exam_no", "PRACTICE001");
      form.append("number_of_questions", "10");
      form.append("num_conceptual", "4");
      form.append("num_theoretical", "3");
      form.append("num_scenario", "3");
      form.append("difficulty_level", "Medium");
      
      console.log("🚀 Sending FormData with fields:");
      for (const pair of form.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }
      
      // Call the API to generate practice questions
      const questions = await generatePracticeQuestions(form);
      setPracticeQuestions(questions);

      toast({
        title: "Questions generated",
        description: "Your practice questions have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string, question: string, userAnswer: string) => {
    try {
      // Call the API to evaluate the answer
      const evaluation = await evaluatePracticeAnswer(questionId, question, userAnswer);
      
      // Update the question with evaluation results
      setPracticeQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === questionId 
            ? { 
                ...q, 
                userAnswer,
                evaluation: {
                  score: evaluation.score || 0,
                  feedback: evaluation.feedback || "No feedback provided",
                  isCorrect: evaluation.score > 0.7 // Consider > 70% as correct
                }
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error evaluating answer:", error);
      throw error;
    }
  };

  const generateSummary = async () => {
    if (!summaryFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate a summary.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSummary(true);

    try {
      const form = new FormData();
      form.append("file", summaryFile);
      
      // Call the API to generate summary
      const summary = await apiGenerateSummary(form);
      setGeneratedSummary(summary);

      toast({
        title: "Summary generated",
        description: "Your summary has been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateKeyPoints = async () => {
    if (!keyPointsFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate key points.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingKeyPoints(true);

    try {
      const form = new FormData();
      form.append("file", keyPointsFile);
      
      // Call the API to generate key points
      const keyPoints = await apiGenerateKeyPoints(form);
      setGeneratedKeyPoints(keyPoints);

      toast({
        title: "Key points generated",
        description: "Your key points have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating key points:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate key points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeyPoints(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const tabItemVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gradient">
          My Study Materials
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Generate personalized learning content from your uploaded materials
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 mb-6 md:mb-8 h-auto p-1">
            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "questions" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="questions"
                className="flex items-center justify-center w-full text-xs sm:text-sm py-2 px-1 sm:px-3"
              >
                <PenBox className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Practice Questions</span>
                <span className="sm:hidden">Practice</span>
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "chatpdf" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="chatpdf"
                className="flex items-center justify-center w-full text-xs sm:text-sm py-2 px-1 sm:px-3"
              >
                <MessagesSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Chat With PDF</span>
                <span className="sm:hidden">Chat PDF</span>
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "summary" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger 
                value="summary" 
                className="flex items-center justify-center w-full text-xs sm:text-sm py-2 px-1 sm:px-3"
              >
                <BookText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>Summary</span>
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "keypoints" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="keypoints"
                className="flex items-center justify-center w-full text-xs sm:text-sm py-2 px-1 sm:px-3"
              >
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Key Points</span>
                <span className="sm:hidden">Key Points</span>
              </TabsTrigger>
            </motion.div>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="mt-0">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-soft hover:shadow-glow transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Upload Material for Questions</h2>
                    <MaterialUploader onFileSelected={handleQuestionFileSelected} />
                    
                    {questionFile && (
                      <motion.div
                        className="p-3 bg-muted rounded-md flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center">
                          <FileType className="h-5 w-5 mr-2 text-primary" />
                          <span>{questionFile.name}</span>
                        </div>
                        <Button
                          onClick={() => setQuestionFile(null)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    )}

                    <Button
                      onClick={generateQuestions}
                      className="w-full relative overflow-hidden group"
                      disabled={!questionFile || isGeneratingQuestions}
                    >
                      {isGeneratingQuestions ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <PenBox className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Generate Practice Questions
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Questions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {practiceQuestions.length > 0 ? 'Practice Questions' : 'Generated Questions'}
                  </h2>
                  {practiceQuestions.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      Answer the questions below and submit to get feedback
                    </span>
                  )}
                </div>
                
                {isGeneratingQuestions ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-lg font-medium">Generating your practice questions...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                  </div>
                ) : practiceQuestions.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    {practiceQuestions.map((question) => (
                      <motion.div key={question.id} variants={itemVariants}>
                        <PracticeQuestionItem
                          question={question}
                          onAnswerSubmit={handleAnswerSubmit}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg border border-dashed">
                    <PenBox className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Questions Generated Yet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Upload a document and click "Generate Practice Questions" to create interactive questions
                      that you can answer and get feedback on.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>

          {/* Chat with PDF Tab */}
          <TabsContent value="chatpdf" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Left side: PDF upload and viewer */}
                                  <Card className="shadow-soft hover:shadow-glow transition-shadow duration-300 h-[600px] lg:h-[800px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <FileType className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      PDF Document
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
                    {!pdfFile ? (
                      <div className="flex flex-col flex-1 items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6">
                        <FileType className="h-16 w-16 text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No PDF Uploaded</h3>
                        <p className="text-sm text-muted-foreground text-center mb-6">
                          Upload a PDF document to start chatting with it
                        </p>
                        <MaterialUploader onFileSelected={handlePdfFileSelected} />
                      </div>
                    ) : (
                      <div className="relative flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <FileType className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-medium truncate max-w-[250px]">{pdfFile.name}</span>
                          </div>
                          <Button
                            onClick={() => {
                              setPdfFile(null);
                              setPdfUrl(null);
                              setChatMessages([]);
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex-1 bg-muted rounded-md overflow-hidden">
                          {pdfUrl && (
                            <iframe 
                              src={pdfUrl} 
                              className="w-full h-full border-0"
                              title="PDF Viewer"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Right side: Chat interface */}
                <Card className="shadow-soft hover:shadow-glow transition-shadow duration-300 h-[600px] lg:h-[800px] flex flex-col overflow-hidden">
                  <CardHeader className="border-b pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <MessagesSquare className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                      Chat with your PDF
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    <ScrollArea className="flex-1 p-6 pb-0">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessagesSquare className="h-16 w-16 text-muted-foreground/40 mb-4" />
                          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Upload a PDF document and ask questions about its content
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 pb-4">
                          {chatMessages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {message.role === 'user' ? (
                                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-primary text-primary-foreground shadow-sm">
                                  <div className="text-base break-words">{message.content}</div>
                                </div>
                              ) : (
                                <div className="max-w-[80%] rounded-lg px-4 py-2 shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                  <div className="flex items-center gap-2 mb-1">
                                    <BotIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium">AI Assistant</span>
                                  </div>
                                  <div className="text-base whitespace-pre-wrap break-words overflow-hidden">{message.content}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="p-4 border-t mt-auto bg-background">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                        className="flex gap-2"
                      >
                        <Input
                          placeholder={pdfFile ? "Ask a question about your document..." : "Upload a PDF first..."}
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          disabled={!pdfFile || isLoading}
                          className="flex-1"
                        />
                        <Button 
                          type="submit" 
                          disabled={!currentMessage.trim() || !pdfFile || isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          <span className="sr-only">Send message</span>
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 shadow-soft hover:shadow-glow transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Upload Material for Summary</h2>
                    <MaterialUploader onFileSelected={handleSummaryFileSelected} />
                    
                    {summaryFile && (
                      <motion.div
                        className="p-3 bg-muted rounded-md flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center">
                          <FileType className="h-5 w-5 mr-2 text-primary" />
                          <span>{summaryFile.name}</span>
                        </div>
                        <Button
                          onClick={() => setSummaryFile(null)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    )}

                    <Button
                      onClick={generateSummary}
                      className="w-full relative overflow-hidden group"
                      disabled={!summaryFile || isGeneratingSummary}
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Summary...
                        </>
                      ) : (
                        <>
                          <BookText className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Generate Summary
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="transition-all duration-300 hover:shadow-md rounded-lg">
                <GeneratedSummary
                  summary={generatedSummary}
                  isLoading={isGeneratingSummary}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Key Points Tab */}
          <TabsContent value="keypoints" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 shadow-soft hover:shadow-glow transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Upload Material for Key Points</h2>
                    <MaterialUploader onFileSelected={handleKeyPointsFileSelected} />
                    
                    {keyPointsFile && (
                      <motion.div
                        className="p-3 bg-muted rounded-md flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="flex items-center">
                          <FileType className="h-5 w-5 mr-2 text-primary" />
                          <span>{keyPointsFile.name}</span>
                        </div>
                        <Button
                          onClick={() => setKeyPointsFile(null)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </motion.div>
                    )}

                    <Button
                      onClick={generateKeyPoints}
                      className="w-full relative overflow-hidden group"
                      disabled={!keyPointsFile || isGeneratingKeyPoints}
                    >
                      {isGeneratingKeyPoints ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Key Points...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Generate Key Points
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="transition-all duration-300 hover:shadow-md rounded-lg">
                <GeneratedKeyPoints
                  keyPoints={generatedKeyPoints}
                  isLoading={isGeneratingKeyPoints}
                />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default StudentContentGenerator;
