
import axios from 'axios';
import { GeneratedQuestion } from './questionGeneration';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Add types declarations for PDF.js and mammoth.js
declare global {
  interface Window {
    pdfjsLib: any;
    mammoth: any;
  }
}

class OpenAIService {
  // Method to check if API key is set (now uses Supabase)
  hasApiKey(): boolean {
    return true; // We now use a server-side key, so this is always true
  }
  
  // Extract text from a document (PDF, DOCX, etc.)
  async extractTextFromDocument(file: File): Promise<string> {
    try {
      console.log(`Extracting text from ${file.name} (${file.type})`);
      
      // For PDF files we'll use PDF.js
      if (file.type === 'application/pdf') {
        return await this.extractPdfText(file);
      } 
      // For DOCX files
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.type === 'application/msword') {
        return await this.extractDocxText(file);
      }
      // For plain text files
      else if (file.type === 'text/plain') {
        const text = await file.text();
        console.log(`Extracted ${text.length} characters from text file`);
        return text;
      }
      // For images, we'll need to use OCR, but for now we'll extract what we can
      else if (file.type.startsWith('image/')) {
        const base64Data = await this.fileToBase64(file);
        console.log('File converted to base64 for OCR processing');
        
        // For now, return image information to help with context
        return `Image document: ${file.name}. This is an image that may contain text requiring OCR processing. Image size: ${file.size} bytes.`;
      }
      
      // For other file types, return information about the file
      console.log(`Unhandled file type: ${file.type}`);
      return `Document: ${file.name} (${file.type}). File size: ${file.size} bytes.`;
    } catch (error) {
      console.error('Error extracting text from document:', error);
      return `Error extracting text from ${file.name}: ${error.message}`;
    }
  }
  
  // Extract text from PDF file using PDF.js
  private async extractPdfText(file: File): Promise<string> {
    try {
      console.log('Extracting text from PDF file');
      
      // Load PDF.js library dynamically if needed
      if (!window.pdfjsLib) {
        console.log('Loading PDF.js library');
        await this.loadPdfJsLibrary();
      }
      
      // Get file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        // Load PDF document
        const loadingTask = window.pdfjsLib.getDocument({data: arrayBuffer});
        const pdf = await loadingTask.promise;
        console.log(`PDF loaded with ${pdf.numPages} pages`);
        
        // Extract text from all pages
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
          console.log(`Extracted text from page ${i}/${pdf.numPages}`);
        }
        
        console.log(`Extracted ${fullText.length} characters from PDF`);
        return fullText;
      } catch (pdfError) {
        console.error('PDF.js extraction error:', pdfError);
        
        // If PDF.js fails, use a more basic approach (convert to base64)
        const base64 = await this.fileToBase64(file);
        return `PDF document: ${file.name}. PDF has ${Math.round(file.size / 1024)} KB. Unable to extract full text content.`;
      }
    } catch (error) {
      console.error('Error in PDF extraction:', error);
      toast({
        title: "PDF extraction issue",
        description: "Could not fully extract text from PDF. Please try a different document format if possible.",
        variant: "destructive",
      });
      return `PDF document: ${file.name}. File size: ${file.size} bytes. Unable to extract text content due to error: ${error.message}.`;
    }
  }
  
  // Helper method to load PDF.js library
  private async loadPdfJsLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      script.onload = () => {
        // Set worker source
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js library'));
      document.head.appendChild(script);
    });
  }
  
  // Extract text from DOCX file using mammoth.js
  private async extractDocxText(file: File): Promise<string> {
    try {
      console.log('Extracting text from DOCX file');
      
      // Load mammoth.js library dynamically if needed
      if (!window.mammoth) {
        console.log('Loading mammoth.js library');
        await this.loadMammothLibrary();
      }
      
      try {
        // Get file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Extract text using mammoth.js
        const result = await window.mammoth.extractRawText({arrayBuffer});
        const text = result.value;
        
        console.log(`Extracted ${text.length} characters from DOCX`);
        return text;
      } catch (mammothError) {
        console.error('Mammoth.js extraction error:', mammothError);
        
        // If mammoth fails, return basic info
        return `DOCX document: ${file.name}. Document has ${Math.round(file.size / 1024)} KB. Unable to extract full text content.`;
      }
    } catch (error) {
      console.error('Error in DOCX extraction:', error);
      toast({
        title: "DOCX extraction issue",
        description: "Could not extract text from DOCX. Please try a different document format if possible.",
        variant: "destructive",
      });
      return `DOCX document: ${file.name}. File size: ${file.size} bytes. Unable to extract text content due to error: ${error.message}.`;
    }
  }
  
  // Helper method to load mammoth.js library
  private async loadMammothLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load mammoth.js library'));
      document.head.appendChild(script);
    });
  }
  
  // Helper method to convert a file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Generate questions from text using OpenAI via Supabase Edge Function
  async generateQuestionsFromText(text: string, numQuestions: number = 10): Promise<GeneratedQuestion[]> {
    try {
      console.log('Sending text to generate questions using OpenAI');
      console.log('Text length:', text.length);
      console.log('First 100 chars:', text.substring(0, 100));
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: { text }
      });
      
      if (error) {
        console.error('Supabase Edge Function error:', error);
        throw new Error(`Failed to generate questions with OpenAI: ${error.message}`);
      }
      
      console.log('Generated questions with OpenAI:', data.questions);
      return data.questions;
      
    } catch (error: any) {
      console.error('Error generating questions with OpenAI:', error);
      throw error;
    }
  }
  
  // Generate questions using Gemini
  async generateQuestionsWithGemini(text: string): Promise<GeneratedQuestion[]> {
    try {
      console.log('Sending text to generate questions using Gemini');
      console.log('Text length:', text.length);
      console.log('First 100 chars:', text.substring(0, 100));
      
      if (text.length < 50) {
        console.warn('Warning: Text is very short. Document extraction may have failed.');
      }
      
      // Call the Supabase Edge Function for Gemini
      const { data, error } = await supabase.functions.invoke('generate-questions-gemini', {
        body: { text }
      });
      
      if (error) {
        console.error('Gemini Edge Function error:', error);
        throw new Error(`Failed to generate questions with Gemini: ${error.message}`);
      }
      
      if (!data || !data.questions || data.questions.length === 0) {
        throw new Error('No questions returned from Gemini API');
      }
      
      console.log('Generated questions with Gemini:', data.questions);
      return data.questions;
      
    } catch (error: any) {
      console.error('Error generating questions with Gemini:', error);
      throw error;
    }
  }
  
  // Evaluate an answer using OpenAI via Supabase Edge Function
  async evaluateAnswer(question: string, answer: string): Promise<{ score: string; feedback: string }> {
    try {
      console.log('Sending answer for evaluation');
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('evaluate-answer', {
        body: { question, answer }
      });
      
      if (error) {
        console.error('Supabase Edge Function error:', error);
        throw new Error(`Failed to evaluate answer: ${error.message}`);
      }
      
      return { 
        score: data.score, 
        feedback: data.feedback 
      };
    } catch (error) {
      console.error('Error evaluating answer:', error);
      return {
        score: "N/A",
        feedback: "There was an error evaluating your answer. Please try again later."
      };
    }
  }
  
  // Check if OpenAI API is available (uses Supabase now)
  checkConnection = async (): Promise<boolean> => {
    console.log('Checking OpenAI API connection via Supabase...');
    return true; // We're using the backend key, so always return true
  }
}

export const openaiService = new OpenAIService();
export default openaiService;
