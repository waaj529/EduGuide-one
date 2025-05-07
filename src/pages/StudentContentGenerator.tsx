import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileType,
  BookText,
  Lightbulb,
  PenBox,
  Sparkles,
} from "lucide-react";
import FlashcardIcon from "@/components/icons/FlashcardIcon";
import { toast } from "@/hooks/use-toast";
import GeneratedQuestions from "@/components/features/GeneratedQuestions";
import MaterialUploader from "@/components/features/MaterialUploader";
import QuestionAnswerInput from "@/components/features/QuestionAnswerInput";
import GeneratedFlashcards from "@/components/features/GeneratedFlashcards";
import GeneratedSummary from "@/components/features/GeneratedSummary";
import GeneratedKeyPoints from "@/components/features/GeneratedKeyPoints";
import { GeneratedQuestion } from "@/services/questionGeneration";
import questionGenerationService from "@/services/questionGeneration";
import { motion } from "framer-motion";
import { generateExam } from "@/services/api";

const StudentContentGenerator = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [generatedSummary, setGeneratedSummary] = useState<string>("");
  const [generatedKeyPoints, setGeneratedKeyPoints] = useState<string[]>([]);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<
    { question: string; answer: string; subject: string }[]
  >([]);
  const [isContentGenerated, setIsContentGenerated] = useState(false);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    toast({
      title: "File selected",
      description: `${file.name} is ready to process.`,
    });
  };

  const generateContent = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate questions
      // const questions = await questionGenerationService.uploadDocument(selectedFile);
      const form = new FormData();
      form.append("file", selectedFile);
      const questions = await generateExam(form);
      setGeneratedQuestions(questions);

      // For now, generate mock data for other content types
      // In a real application, you would have separate services for each content type
      setGeneratedSummary(
        "This is a generated summary of the uploaded document. In a real application, this would be a comprehensive summary of the key concepts and ideas presented in the document."
      );

      setGeneratedKeyPoints([
        "Key point 1: Important concept from the document",
        "Key point 2: Another critical idea worth remembering",
        "Key point 3: A mathematical formula or definition",
        "Key point 4: A practical application of the concept",
        "Key point 5: A common misconception clarified",
      ]);

      setGeneratedFlashcards([
        {
          question: "What is the main concept discussed in chapter 1?",
          answer:
            "The fundamental theorem that forms the basis for further exploration.",
          subject: "Chapter 1",
        },
        {
          question: "How do you apply the formula X in a real-world scenario?",
          answer: "The formula can be applied by following these steps...",
          subject: "Applications",
        },
        {
          question: "Define the key term Y and its significance.",
          answer: "Y is defined as... and is significant because...",
          subject: "Definitions",
        },
      ]);

      setIsContentGenerated(true);

      toast({
        title: "Content generated",
        description:
          "Your learning materials have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Animation variants for framer-motion
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
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2 text-gradient">
          My Study Materials
        </h1>
        <p className="text-muted-foreground">
          Generate personalized learning content from your uploaded materials
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="mb-8 shadow-soft hover:shadow-glow transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="md:col-span-1"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-xl font-semibold mb-4">Upload Material</h2>
                <MaterialUploader onFileSelected={handleFileSelected} />
              </motion.div>

              <div className="md:col-span-2">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-semibold"
                  >
                    Generate Study Content
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground"
                  >
                    Upload your study document and click generate to create
                    various learning materials
                  </motion.p>

                  {selectedFile && (
                    <motion.div
                      variants={itemVariants}
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
                        <span>{selectedFile.name}</span>
                      </div>
                      <Button
                        onClick={() => setSelectedFile(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Button
                      onClick={generateContent}
                      className="w-full md:w-auto relative overflow-hidden group"
                      disabled={!selectedFile || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Generate Learning Materials
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Content Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isGenerating || isContentGenerated ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "questions" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="questions"
                className="flex items-center w-full"
              >
                <PenBox className="h-4 w-4 mr-2" />
                Practice Questions
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "flashcards" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="flashcards"
                className="flex items-center w-full"
              >
                <FlashcardIcon className="h-4 w-4 mr-2" />
                Flashcards
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "summary" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger value="summary" className="flex items-center w-full">
                <BookText className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
            </motion.div>

            <motion.div
              variants={tabItemVariants}
              animate={activeTab === "keypoints" ? "active" : "inactive"}
              className="w-full"
            >
              <TabsTrigger
                value="keypoints"
                className="flex items-center w-full"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Key Points
              </TabsTrigger>
            </motion.div>
          </TabsList>

          <TabsContent value="questions" className="mt-0">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="transition-all duration-300 hover:shadow-md rounded-lg">
                <GeneratedQuestions
                  questions={generatedQuestions}
                  isLoading={isGenerating && activeTab === "questions"}
                />
              </div>
              <div className="transition-all duration-300 hover:shadow-md rounded-lg">
                <QuestionAnswerInput />
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="flashcards" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="transition-all duration-300 hover:shadow-md rounded-lg"
            >
              <GeneratedFlashcards
                flashcards={generatedFlashcards}
                isLoading={isGenerating && activeTab === "flashcards"}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="transition-all duration-300 hover:shadow-md rounded-lg"
            >
              <GeneratedSummary
                summary={generatedSummary}
                isLoading={isGenerating && activeTab === "summary"}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="keypoints" className="mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="transition-all duration-300 hover:shadow-md rounded-lg"
            >
              <GeneratedKeyPoints
                keyPoints={generatedKeyPoints}
                isLoading={isGenerating && activeTab === "keypoints"}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default StudentContentGenerator;
