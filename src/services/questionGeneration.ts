import axios from 'axios';
import openaiService from './openaiService';
import { toast } from "@/hooks/use-toast";

// Types for API responses and requests
export interface GeneratedQuestion {
  id: string;
  question: string;
  questionType: 'conceptual' | 'numerical' | 'theoretical' | 'scenario' | 'short-answer' | 'long-answer' | 'definition';
}

export interface QuestionGenerationResponse {
  questions: string[];
}

export interface AnswerEvaluationResponse {
  score: string;
  feedback: string;
}

// API URL - update with your Flask API URL if you want to switch back
export const API_URL = 'http://localhost:5000';  // Original Flask API URL

// Service for document processing and question generation
const questionGenerationService = {
  // Upload document and generate questions - using Gemini only
  uploadDocument: async (file: File): Promise<GeneratedQuestion[]> => {
    try {
      console.log('Uploading document for question generation:', file.name);
      
      // Extract text from document
      const text = await openaiService.extractTextFromDocument(file);
      console.log('Extracted text:', text.substring(0, 500) + '...');
      
      if (text.length < 50) {
        toast({
          title: "Text extraction issue",
          description: "Not enough text was extracted from your document. Please try a different format.",
          variant: "destructive",
        });
        throw new Error("Insufficient text extracted from document");
      }
      
      // Generate questions with Gemini
      try {
        console.log('Generating questions with Gemini');
        const questions = await openaiService.generateQuestionsWithGemini(text);
        
        if (questions && questions.length > 0) {
          toast({
            title: "Questions generated successfully",
            description: "Using Gemini to generate learning materials from your document",
            variant: "default",
          });
          
          return questions;
        } else {
          throw new Error("Gemini returned empty questions");
        }
      } catch (geminiError: any) {
        console.error('Gemini error:', geminiError);
        
        toast({
          title: "AI service failed",
          description: "Could not generate questions from your document. Please try again later.",
          variant: "destructive",
        });
        
        throw new Error(`Gemini API error: ${geminiError.message}`);
      }
    } catch (error: any) {
      console.error('Error generating questions:', error);
      
      toast({
        title: "Processing failed",
        description: "Could not generate questions from your document.",
        variant: "destructive",
      });
      
      throw error;
    }
  },
  
  // Evaluate user's answer to a question using OpenAI
  evaluateAnswer: async (question: string, answer: string): Promise<AnswerEvaluationResponse> => {
    try {
      console.log('Evaluating answer for question:', question);
      
      // Use OpenAI
      console.log('Using OpenAI for answer evaluation');
      try {
        // Use OpenAI to evaluate the answer
        const evaluation = await openaiService.evaluateAnswer(question, answer);
        return evaluation;
      } catch (error) {
        console.error('OpenAI evaluation error:', error);
        
        // Return placeholder response
        return {
          score: "N/A",
          feedback: "There was an error evaluating your answer with OpenAI. Please try again."
        };
      }
    } catch (error: any) {
      console.error('Error evaluating answer:', error);
      throw new Error('Failed to evaluate your answer. Please try again later.');
    }
  },
  
  // Check if OpenAI API is available (will always return true now)
  checkConnection: async (): Promise<boolean> => {
    console.log('Checking OpenAI API connection...');
    return true; // Since we have a hardcoded key, always return true
  }
};

// Function to determine question type based on content
function determineQuestionType(question: string): 'conceptual' | 'numerical' | 'theoretical' | 'scenario' | 'short-answer' | 'long-answer' | 'definition' {
  const lowerQuestion = question.toLowerCase();
  
  // Check for numerical question indicators
  if (
    lowerQuestion.includes('calculate') || 
    lowerQuestion.includes('how many') || 
    lowerQuestion.includes('percent') || 
    lowerQuestion.includes('ratio') ||
    lowerQuestion.includes('number') ||
    /\d+/.test(question)
  ) {
    return 'numerical';
  }
  
  // Check for definition question indicators
  if (
    lowerQuestion.includes('define') || 
    lowerQuestion.includes('what is') || 
    lowerQuestion.includes('meaning of') ||
    lowerQuestion.includes('definition')
  ) {
    return 'definition';
  }
  
  // Check for theoretical question indicators
  if (
    lowerQuestion.includes('theory') || 
    lowerQuestion.includes('principle') || 
    lowerQuestion.includes('concept') ||
    lowerQuestion.includes('framework') ||
    lowerQuestion.includes('theoretical')
  ) {
    return 'theoretical';
  }
  
  // Check for scenario-based question indicators
  if (
    lowerQuestion.includes('scenario') || 
    lowerQuestion.includes('situation') || 
    lowerQuestion.includes('case study') ||
    lowerQuestion.includes('imagine') ||
    lowerQuestion.includes('consider the following')
  ) {
    return 'scenario';
  }
  
  // Check for long-answer question indicators
  if (
    lowerQuestion.includes('explain') || 
    lowerQuestion.includes('discuss') || 
    lowerQuestion.includes('analyze') ||
    lowerQuestion.includes('evaluate') ||
    lowerQuestion.includes('describe in detail')
  ) {
    return 'long-answer';
  }
  
  // Check for short-answer question indicators
  if (
    lowerQuestion.includes('briefly') || 
    lowerQuestion.includes('list') || 
    lowerQuestion.includes('name') ||
    lowerQuestion.includes('identify')
  ) {
    return 'short-answer';
  }
  
  // Default to conceptual for other types of questions
  return 'conceptual';
}

export default questionGenerationService;
