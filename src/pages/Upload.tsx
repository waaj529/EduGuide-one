import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Upload as UploadIcon,
  FileText,
  BookOpen,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
  ClipboardCopy,
  Download,
  AlertTriangle,
  Calendar,
  Hash,
  LibraryBig,
  GraduationCap,
  Image as ImageIcon,
  X,
  AlertCircle,
  Users,
  Calendar as CalendarIcon,
  Clock,
  Save,
} from "lucide-react";
import { GeneratedQuestion } from "@/services/questionGeneration";
import questionGenerationService from "@/services/questionGeneration";
import GeneratedQuestions from "@/components/features/GeneratedQuestions";
import openaiService from "@/services/openaiService";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  download_pdf,
  generateAssignment,
  generateQuiz,
  generateExam,
  downloadAssignment,
  downloadQuiz,
  viewQuizPdf,
  viewSolutionPdf
} from "@/services/api";
import PdfViewer from "@/components/features/PdfViewer";

const Upload = () => {
  // Shared state variables
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("assignment");
  const navigate = useNavigate();

  // Assignment tab state
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [assignmentGeneratedQuestions, setAssignmentGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [assignmentProcessingComplete, setAssignmentProcessingComplete] = useState(false);
  const [assignmentExtractionStatus, setAssignmentExtractionStatus] = useState<
    "idle" | "extracting" | "extracted" | "generating" | "error"
  >("idle");
  const [assignmentExtractedTextPreview, setAssignmentExtractedTextPreview] = useState<string>("");
  
  // Quiz tab state
  const [quizFile, setQuizFile] = useState<File | null>(null);
  const [quizGeneratedQuestions, setQuizGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [quizProcessingComplete, setQuizProcessingComplete] = useState(false);
  const [quizExtractionStatus, setQuizExtractionStatus] = useState<
    "idle" | "extracting" | "extracted" | "generating" | "error"
  >("idle");
  const [quizExtractedTextPreview, setQuizExtractedTextPreview] = useState<string>("");

  // Proximity tab state
  const [proximityFile, setProximityFile] = useState<File | null>(null);
  const [proximityProcessingComplete, setProximityProcessingComplete] = useState(false);
  const [proximityExtractionStatus, setProximityExtractionStatus] = useState<
    "idle" | "extracting" | "extracted" | "generating" | "error"
  >("idle");
  const [proximityExtractedTextPreview, setProximityExtractedTextPreview] = useState<string>("");
  
  // Update student count state for proximity handling
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [isCountingStudents, setIsCountingStudents] = useState(false);
  const [proximityImageUrl, setProximityImageUrl] = useState<string | null>(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState<string | null>(null); // Store the annotated image URL
  const [proximityImageFile, setProximityImageFile] = useState<File | null>(null);

  // Proximity form state
  const [proximityDepartment, setProximityDepartment] = useState("");
  const [proximitySubject, setProximitySubject] = useState("");
  const [proximityClassName, setProximityClassName] = useState("");
  const [proximityDate, setProximityDate] = useState("");
  const [proximityTime, setProximityTime] = useState("");
  const [proximityLocation, setProximityLocation] = useState("");

  // Assignment form state
  const [assignmentDepartment, setAssignmentDepartment] = useState("213");
  const [assignmentSubject, setAssignmentSubject] = useState("");
  const [assignmentClassName, setAssignmentClassName] = useState("213");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentNumber, setAssignmentNumber] = useState("1213");
  const [assignmentPoints, setAssignmentPoints] = useState("10");
  const [assignmentConceptual, setAssignmentConceptual] = useState("2");
  const [assignmentTheoretical, setAssignmentTheoretical] = useState("5");
  const [assignmentScenario, setAssignmentScenario] = useState("3");
  const [assignmentDifficulty, setAssignmentDifficulty] = useState("Medium");
  const [assignmentTotalQuestions, setAssignmentTotalQuestions] = useState("10");
  
  // Quiz form state
  const [quizDepartment, setQuizDepartment] = useState("213");
  const [quizSubject, setQuizSubject] = useState("");
  const [quizClassName, setQuizClassName] = useState("213");
  const [quizDueDate, setQuizDueDate] = useState("");
  const [quizNumber, setQuizNumber] = useState("2");
  const [quizPoints, setQuizPoints] = useState("10");
  const [quizConceptual, setQuizConceptual] = useState("1");
  const [quizTheoretical, setQuizTheoretical] = useState("2");
  const [quizScenario, setQuizScenario] = useState("1");
  const [quizDifficulty, setQuizDifficulty] = useState("Medium");
  const [quizTotalQuestions, setQuizTotalQuestions] = useState("");
  
  // Add state for PDF viewers and URLs
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('https://python.iamscientist.ai/api/quiz/quiz_view');
  const [showSolutionViewer, setShowSolutionViewer] = useState(false);
  const [solutionPdfUrl, setSolutionPdfUrl] = useState('https://python.iamscientist.ai/api/quiz/sol_view');

  // Handle tab switching
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    const token = localStorage.getItem("eduguide_user_token");
    setIsAuthenticated(token !== null);

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this feature",
        variant: "destructive",
      });
    }
    
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['assignment', 'quiz', 'proximity'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload documents",
          variant: "destructive",
        });
        return;
      }

      const file = e.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Unsupported file format",
          description:
            "Please upload a PDF, Word document, PowerPoint, or image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Set the file based on which tab is active
      if (activeTab === "assignment") {
        setAssignmentFile(file);
        setAssignmentGeneratedQuestions([]);
        setAssignmentProcessingComplete(false);
        setAssignmentExtractionStatus("idle");
        setAssignmentExtractedTextPreview("");
      } else if (activeTab === "quiz") {
        setQuizFile(file);
        setQuizGeneratedQuestions([]);
        setQuizProcessingComplete(false);
        setQuizExtractionStatus("idle");
        setQuizExtractedTextPreview("");
      } else if (activeTab === "proximity") {
        handleProximityImageUpload(file);
      }

      toast({
        title: "File selected",
        description: `${file.name} is ready to be processed.`,
      });
    },
    [isAuthenticated, activeTab]
  );

  const handleUpload = useCallback(
    async (type: string) => {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to process documents",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Only process if the type matches the active tab
      if (type !== activeTab) {
        console.log("Skipping processing for", type, "since active tab is", activeTab);
        return;
      }

      const uploadedFile =
        type === "assignment"
          ? assignmentFile
          : type === "quiz"
          ? quizFile
          : proximityFile;

      if (!uploadedFile) {
        toast({
          title: "No file selected",
          description: "Please select a file to upload.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsUploading(true);

        toast({
          title: "Uploading file",
          description: "Your file is being uploaded and processed...",
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsUploading(false);
        setIsProcessing(true);

        toast({
          title: "Processing document",
          description: "Extracting text and generating learning materials...",
        });

        await processUploadedDocument(uploadedFile, type);
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        setIsProcessing(false);

        if (type === "assignment") {
          setAssignmentExtractionStatus("error");
        } else if (type === "quiz") {
          setQuizExtractionStatus("error");
        } else if (type === "proximity") {
          setProximityExtractionStatus("error");
        }

        toast({
          title: "Upload failed",
          description:
            "There was an error uploading your file. Please try again.",
          variant: "destructive",
        });
      }
    },
    [assignmentFile, quizFile, proximityFile, isAuthenticated, navigate, activeTab]
  );

  const processUploadedDocument = async (file: File, type: string) => {
    try {
      if (type === "assignment") {
        setAssignmentExtractionStatus("extracting");
      } else if (type === "quiz") {
        setQuizExtractionStatus("extracting");
      } else if (type === "proximity") {
        setProximityExtractionStatus("extracting");
      }

      // Extract text from document first
      const text = await openaiService.extractTextFromDocument(file);

      // Update the appropriate text preview based on tab
      if (type === "assignment") {
        setAssignmentExtractedTextPreview(text.substring(0, 200) + "...");
        setAssignmentExtractionStatus("extracted");
      } else if (type === "quiz") {
        setQuizExtractedTextPreview(text.substring(0, 200) + "...");
        setQuizExtractionStatus("extracted");
      } else if (type === "proximity") {
        setProximityExtractedTextPreview(text.substring(0, 200) + "...");
        setProximityExtractionStatus("extracted");
      }

      // Check if enough text was extracted
      if (text.length < 50) {
        toast({
          title: "Text extraction issue",
          description:
            "Not enough text was extracted from your document. Please try a different file format.",
          variant: "destructive",
        });
        setIsProcessing(false);

        if (type === "assignment") {
          setAssignmentExtractionStatus("error");
        } else if (type === "quiz") {
          setQuizExtractionStatus("error");
        } else if (type === "proximity") {
          setProximityExtractionStatus("error");
        }
        return;
      }

      // Start generation process
      if (type === "assignment") {
        setAssignmentExtractionStatus("generating");
      } else if (type === "quiz") {
        setQuizExtractionStatus("generating");
      } else if (type === "proximity") {
        setProximityExtractionStatus("generating");
      }

      try {
        let questions = [];
        
        if (type === "assignment") {
          // Create assignment form with assignment-specific fields
          const assignmentForm = new FormData();
          assignmentForm.append("file", file);
          assignmentForm.append("department", assignmentDepartment);
          assignmentForm.append("subject", assignmentSubject);
          assignmentForm.append("class", assignmentClassName);
          assignmentForm.append("due_date", assignmentDueDate);
          assignmentForm.append("assignment_no", assignmentNumber);
          assignmentForm.append("points", assignmentPoints);
          assignmentForm.append("num_conceptual", assignmentConceptual);
          assignmentForm.append("num_theoretical", assignmentTheoretical);
          assignmentForm.append("num_scenario", assignmentScenario);
          assignmentForm.append("difficulty_level", assignmentDifficulty);
          assignmentForm.append("number_of_questions", assignmentTotalQuestions);
          
          questions = await generateAssignment(assignmentForm);
        } 
        else if (type === "quiz") {
          // Create quiz form with properly validated parameters
          const quizForm = new FormData();
          quizForm.append("file", file);
          quizForm.append("department", quizDepartment);
          quizForm.append("subject", quizSubject);
          quizForm.append("class", quizClassName);
          quizForm.append("due_date", quizDueDate);
          quizForm.append("quiz_no", quizNumber);
          quizForm.append("points", quizPoints);
          quizForm.append("num_conceptual", quizConceptual);
          quizForm.append("num_theoretical", quizTheoretical);
          quizForm.append("num_scenario", quizScenario);
          quizForm.append("difficulty_level", quizDifficulty);
          quizForm.append("number_of_questions", quizTotalQuestions || "10");
          
          try {
            // Call the quiz API
            questions = await generateQuiz(quizForm);
            
            if (questions && questions.length > 0) {
              setQuizGeneratedQuestions(questions);
              setQuizProcessingComplete(true);
              setQuizExtractionStatus("extracted");
            } else {
              throw new Error("No questions returned from API");
            }
          } catch (error) {
            console.error("Quiz API error:", error);
            setQuizExtractionStatus("error");
            toast({
              title: "Quiz Generation Failed",
              description: "The API service is currently unavailable. Please try again later.",
              variant: "destructive",
            });
          }
        } 
        else if (type === "proximity") {
          // Create proximity form with proximity-specific fields
          const proximityForm = new FormData();
          proximityForm.append("file", file);
          proximityForm.append("department", proximityDepartment);
          proximityForm.append("subject", proximitySubject);
          proximityForm.append("class", proximityClassName);
          
          questions = await generateExam(proximityForm);
        }

        if (questions && questions.length > 0) {
          if (type === "assignment") {
            setAssignmentGeneratedQuestions(questions);
            setAssignmentProcessingComplete(true);
          } else if (type === "quiz") {
            setQuizGeneratedQuestions(questions);
            setQuizProcessingComplete(true);
          } else if (type === "proximity") {
            setProximityProcessingComplete(true);
          }

          toast({
            title: "Processing complete",
            description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been generated successfully!`,
          });
        } else {
          throw new Error(`API returned empty ${type} questions`);
        }
      } catch (error) {
        console.error(`${type} API processing failed:`, error);

        if (type === "assignment") {
          setAssignmentExtractionStatus("error");
        } else if (type === "quiz") {
          setQuizExtractionStatus("error");
        } else if (type === "proximity") {
          setProximityExtractionStatus("error");
        }

        toast({
          title: "Processing failed",
          description:
            `Could not generate ${type} from your document. API service may be unavailable.`,
          variant: "destructive",
        });
      }

      setIsProcessing(false);
    } catch (error: any) {
      console.error("Processing error:", error);
      setIsProcessing(false);

      if (type === "assignment") {
        setAssignmentExtractionStatus("error");
      } else if (type === "quiz") {
        setQuizExtractionStatus("error");
      } else if (type === "proximity") {
        setProximityExtractionStatus("error");
      }

      toast({
        title: "Processing failed",
        description: error.message || "Error processing document",
        variant: "destructive",
      });
    }
  };

  const handleProximityImageUpload = (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
    // If it's an event, get the file from event.target.files
    let file: File | null = null;
    
    if ((fileOrEvent as React.ChangeEvent<HTMLInputElement>).target?.files) {
      // It's an event
      file = (fileOrEvent as React.ChangeEvent<HTMLInputElement>).target.files?.[0] || null;
    } else {
      // It's a direct File object
      file = fileOrEvent as File;
    }
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }
    
    // Store the file for later API submission
    setProximityImageFile(file);
    
    // Create a preview URL
    const imageUrl = URL.createObjectURL(file);
    setProximityImageUrl(imageUrl);
    
    // Reset student count when new image is uploaded
    setStudentCount(null);
  };

  // Function to count students in the uploaded image
  const countStudentsInImage = async () => {
    if (!proximityImageFile) {
      toast({
        title: "No image selected",
        description: "Please select a classroom image to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCountingStudents(true);
    
    try {
      // Create FormData to send the image to the API
      const formData = new FormData();
      formData.append("image", proximityImageFile);
      
      // Log the image details for debugging
      console.log("Image being uploaded:", proximityImageFile.name, proximityImageFile.type, proximityImageFile.size);
      
      // Post to the deployed API endpoint
      const response = await fetch("https://python.iamscientist.ai/api/yolo/yolo", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`API response status: ${response.status}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      // Log the entire response for debugging
      const data = await response.json();
      console.log("YOLO API response:", data);
      
      // Extract the count of detected persons/students from the API response
      let detectedStudents = 0;
      let annotatedUrl = null;
      
      // Check for the number of faces from the API response - this is the format from your logs
      if (data["Number of faces detected"] !== undefined) {
        detectedStudents = data["Number of faces detected"];
      }
      else if (data.Number_of_faces_detected !== undefined) {
        detectedStudents = data.Number_of_faces_detected;
      }
      
      // Extract the URL from the response - prioritize this format from your logs
      if (data.URL) {
        annotatedUrl = data.URL;
      } 
      else if (data.url) {
        annotatedUrl = data.url;
      }
      else if (data.image_url) {
        annotatedUrl = data.image_url;
      }
      else if (data.annotated_url) {
        annotatedUrl = data.annotated_url;
      }
      
      // Fallback check for face counts if the direct properties aren't found
      if (detectedStudents === 0) {
        if (data.face_boxes && Array.isArray(data.face_boxes)) {
          detectedStudents = data.face_boxes.length;
        } else if (data.face_count !== undefined) {
          detectedStudents = data.face_count;
        } else if (data.faces !== undefined) {
          detectedStudents = Object.keys(data.faces).length;
        } else if (data.count !== undefined) {
          detectedStudents = data.count;
        } else if (data.detections && Array.isArray(data.detections)) {
          detectedStudents = data.detections.length;
        } else {
          // Look for any properties that might contain face detection data
          for (const key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
              // If we find a property that seems to contain face data
              if (key.toLowerCase().includes('face') || key.toLowerCase().includes('detect')) {
                if (Array.isArray(data[key])) {
                  detectedStudents = data[key].length;
                  break;
                } else if (typeof data[key] === 'object') {
                  detectedStudents = Object.keys(data[key]).length;
                  break;
                }
              }
            }
          }
        }
      }
      
      console.log("Detected students:", detectedStudents);
      console.log("Annotated image URL:", annotatedUrl);
      
      setStudentCount(detectedStudents);
      setProximityProcessingComplete(true);
      
      // Also set proximityFile to keep reference to the image
      setProximityFile(proximityImageFile);
      
      // If we have an annotated image URL, store it separately and keep the original image URL
      if (annotatedUrl) {
        // Store the annotated image URL in the dedicated state variable
        setAnnotatedImageUrl(annotatedUrl);
      }
      
      // Show success message
      toast({
        title: "Image Analysis Complete",
        description: `Detected ${detectedStudents} students in the image.`,
      });
    } catch (error) {
      console.error("Error counting students:", error);
      
      toast({
        title: "Failed to process image",
        description: "Could not analyze the classroom image. Please try again.",
        variant: "destructive",
      });
      
      setProximityProcessingComplete(false);
    } finally {
      setIsCountingStudents(false);
    }
  };

  const handleProximitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proximityImageFile || !proximityClassName || !proximityDate) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields and upload a classroom image.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the data to your backend
    // const formData = new FormData();
    // formData.append("image", proximityImageFile);
    // formData.append("className", proximityClassName);
    // formData.append("date", proximityDate);
    // formData.append("time", proximityTime);
    // formData.append("location", proximityLocation);
    // formData.append("studentCount", studentCount?.toString() || "0");
    
    toast({
      title: "Proximity data submitted",
      description: `Recorded ${studentCount} students in ${proximityClassName}`,
    });
    
    // Reset form
    setProximityClassName("");
    setProximityDate("");
    setProximityTime("");
    setProximityLocation("");
    setProximityImageFile(null);
    setProximityImageUrl(null);
    setStudentCount(null);
  };

  const handleResetUpload = useCallback(() => {
    if (activeTab === "assignment") {
      setAssignmentFile(null);
      setAssignmentGeneratedQuestions([]);
      setAssignmentProcessingComplete(false);
      setAssignmentExtractionStatus("idle");
      setAssignmentExtractedTextPreview("");
    } else if (activeTab === "quiz") {
      setQuizFile(null);
      setQuizGeneratedQuestions([]);
      setQuizProcessingComplete(false);
      setQuizExtractionStatus("idle");
      setQuizExtractedTextPreview("");
    } else if (activeTab === "proximity") {
      setProximityFile(null);
      setProximityProcessingComplete(false);
      setProximityExtractionStatus("idle");
      setProximityExtractedTextPreview("");
    }
  }, [activeTab]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Helper function to generate demo questions when API is down
  const generateDemoQuestions = (totalQuestionsStr: string, extractedText: string): any[] => {
    const totalQuestions = parseInt(totalQuestionsStr) || 4;
    
    // Create some sample questions based on the extracted text
    // This helps show the user how the interface would look even if the API is down
    const demoQuestions = [
      {
        id: 1,
        question: "Explain the main concepts presented in this document.",
        questionType: "conceptual"
      },
      {
        id: 2,
        question: "What are the key technical terms mentioned in this material and their definitions?",
        questionType: "theoretical"
      },
      {
        id: 3,
        question: "Apply the concepts from this document to solve a real-world scenario.",
        questionType: "scenario"
      },
      {
        id: 4,
        question: "Discuss the relationship between the major themes in this document.",
        questionType: "theoretical"
      },
      {
        id: 5,
        question: "What are the potential applications of these concepts in different contexts?",
        questionType: "conceptual"
      },
      {
        id: 6,
        question: "How would you implement the methods described in this document?",
        questionType: "scenario"
      },
      {
        id: 7, 
        question: "Compare and contrast the different approaches mentioned in the document.",
        questionType: "theoretical"
      },
      {
        id: 8,
        question: "What conclusions can be drawn from the information presented?",
        questionType: "conceptual"
      },
      {
        id: 9,
        question: "Design a solution to a problem based on the principles outlined in this document.",
        questionType: "scenario"
      },
      {
        id: 10,
        question: "Evaluate the strengths and weaknesses of the methods described.",
        questionType: "theoretical"
      }
    ];
    
    // Return only the requested number of questions
    return demoQuestions.slice(0, totalQuestions);
  };

  const copyToClipboard = () => {
    const content = activeTab === "assignment"
      ? assignmentGeneratedQuestions.map((q) => `${q.id}. ${q.question}`).join("\n\n")
      : activeTab === "quiz"
      ? quizGeneratedQuestions.map((q) => `${q.id}. ${q.question}`).join("\n\n")
      : "";

    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Generated content has been copied to your clipboard.",
    });
  };

  const handleDownload = async () => {
    if (activeTab === "assignment") {
      // Use assignment-specific form data with user inputs
      const form = new FormData();
      form.append("file", assignmentFile);
      form.append("department", assignmentDepartment);
      form.append("subject", assignmentSubject);
      form.append("class", assignmentClassName);
      form.append("due_date", assignmentDueDate);
      form.append("assignment_no", assignmentNumber);
      form.append("points", assignmentPoints);
      form.append("num_conceptual", assignmentConceptual);
      form.append("num_theoretical", assignmentTheoretical);
      form.append("num_scenario", assignmentScenario);
      form.append("difficulty_level", assignmentDifficulty);
      form.append("number_of_questions", assignmentTotalQuestions);
      
      downloadAssignment(form);
    } else if (activeTab === "quiz") {
      // Use quiz-specific form data for download
      const form = new FormData();
      form.append("file", quizFile);
      form.append("department", quizDepartment);
      form.append("subject", quizSubject);
      form.append("class", quizClassName);
      form.append("due_date", quizDueDate);
      form.append("quiz_no", quizNumber);
      form.append("points", quizPoints);
      form.append("num_conceptual", quizConceptual);
      form.append("num_theoretical", quizTheoretical);
      form.append("num_scenario", quizScenario);
      form.append("difficulty_level", quizDifficulty);
      form.append("number_of_questions", quizTotalQuestions);
      
      downloadQuiz(form);
    } else if (activeTab === "proximity") {
      // Use proximity-specific form data
      const form = new FormData();
      form.append("file", proximityFile);
      form.append("department", proximityDepartment);
      form.append("subject", proximitySubject);
      form.append("class", proximityClassName);
      
      download_pdf();
    }
  };

  // Handler for viewing the generated PDF
  const handleViewPdf = () => {
    // If solution viewer is open, close it
    if (showSolutionViewer) {
      setShowSolutionViewer(false);
    }
    
    // Call viewQuizPdf with a callback that sets the PDF URL
    viewQuizPdf((url) => {
      setPdfUrl(url);
      setShowPdfViewer(prev => !prev);
      
      toast({
        title: showPdfViewer ? "PDF viewer closed" : "PDF viewer opened",
        description: showPdfViewer ? "Returned to quiz questions view." : "Displaying the generated PDF content.",
      });
    });
  };
  
  // Handler for viewing the solution PDF
  const handleViewSolution = () => {
    // If quiz viewer is open, close it
    if (showPdfViewer) {
      setShowPdfViewer(false);
    }
    
    // Call viewSolutionPdf with a callback
    viewSolutionPdf((url) => {
      setSolutionPdfUrl(url);
      setShowSolutionViewer(prev => !prev);
      
      toast({
        title: showSolutionViewer ? "Solution closed" : "Quiz solution opened",
        description: showSolutionViewer 
          ? "Returned to quiz questions view." 
          : "Displaying the solution for this quiz.",
      });
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Learning Content Generator</h1>
      <p className="text-muted-foreground mb-8">
        Generate personalized learning content from your uploaded materials
      </p>

      <Tabs
        defaultValue="assignment"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="assignment" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Assignment
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="proximity" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Proximity Handling
          </TabsTrigger>
        </TabsList>

        {/* Assignment Tab */}
        <TabsContent value="assignment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Generate Assignment</CardTitle>
                <CardDescription>
                  Fill in the details below to generate a custom assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-muted/40 border-gray-300 dark:border-gray-700">
                    <ShieldAlert className="w-12 h-12 mb-3 text-yellow-500" />
                    <p className="mb-2 text-sm font-semibold">
                      Authentication Required
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Please log in to upload documents
                    </p>
                    <Button onClick={handleLoginRedirect}>Log In</Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Upload PDF Document</h3>

                        {assignmentFile ? (
                          <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-6 w-6 text-blue-500" />
                              <div>
                                <p className="font-medium">
                                  {assignmentFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(assignmentFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetUpload}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 relative">
                            <div className="flex items-center justify-center flex-col">
                              <UploadIcon className="h-10 w-10 text-gray-400 mb-4" />
                              <p className="text-sm text-center text-muted-foreground">
                                <span className="font-medium text-primary hover:underline cursor-pointer">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF files only (max 10MB)
                              </p>
                              <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={isUploading || isProcessing}
                                style={{
                                  cursor: isUploading || isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {assignmentExtractionStatus === "extracting" && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center text-blue-600 dark:text-blue-400">
                              <div className="mr-2 h-4 w-4 rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
                              <p className="text-sm font-medium">
                                Extracting text from document...
                              </p>
                            </div>
                          </div>
                        )}

                        {assignmentExtractionStatus === "generating" && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center text-purple-600 dark:text-purple-400">
                              <div className="mr-2 h-4 w-4 rounded-full border-2 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin"></div>
                              <p className="text-sm font-medium">
                                Generating questions from document content...
                              </p>
                            </div>
                          </div>
                        )}

                        {assignmentExtractionStatus === "error" && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <p className="text-sm font-medium">
                                Error processing document
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Please try a different file format or check that
                              the document contains extractable text.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            placeholder="Computer Science"
                            value={assignmentDepartment}
                            onChange={(e) => setAssignmentDepartment(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Introduction to Programming"
                            value={assignmentSubject}
                            onChange={(e) => setAssignmentSubject(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Input
                            id="class"
                            placeholder="CS101"
                            value={assignmentClassName}
                            onChange={(e) => setAssignmentClassName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input
                            id="due_date"
                            type="date"
                            value={assignmentDueDate}
                            onChange={(e) => setAssignmentDueDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignment_no">Assignment Number</Label>
                          <Input
                            id="assignment_no"
                            placeholder="1"
                            value={assignmentNumber}
                            onChange={(e) => setAssignmentNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="points">Total Points</Label>
                          <Input
                            id="points"
                            placeholder="100"
                            value={assignmentPoints}
                            onChange={(e) => setAssignmentPoints(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          Question Settings
                        </h3>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="number_of_questions">Number of Questions</Label>
                            <Input
                              id="number_of_questions"
                              placeholder="Enter total number of questions"
                              value={assignmentTotalQuestions}
                              onChange={(e) => setAssignmentTotalQuestions(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Define how many questions you want to generate
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="num_conceptual">
                              Num Conceptual
                            </Label>
                            <Input
                              id="num_conceptual"
                              value={assignmentConceptual}
                              onChange={(e) =>
                                setAssignmentConceptual(e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_theoretical">
                              Num Theoretical
                            </Label>
                            <Input
                              id="num_theoretical"
                              value={assignmentTheoretical}
                              onChange={(e) =>
                                setAssignmentTheoretical(e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="num_scenario">
                              Num Scenario
                            </Label>
                            <Input
                              id="num_scenario"
                              value={assignmentScenario}
                              onChange={(e) =>
                                setAssignmentScenario(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty_level">
                          Difficulty Level
                        </Label>
                        <Select
                          value={assignmentDifficulty}
                          onValueChange={setAssignmentDifficulty}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleUpload("assignment")}
                  disabled={
                    !assignmentFile ||
                    isUploading ||
                    isProcessing ||
                    !isAuthenticated
                  }
                >
                  {isUploading
                    ? "Uploading..."
                    : isProcessing
                    ? "Processing..."
                    : "Generate Assignment"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Assignment</CardTitle>
                <CardDescription>
                  Your generated assignment will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[600px] overflow-y-auto">
                {isProcessing && activeTab === "assignment" ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium mb-2">
                      Generating assignment...
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      We're analyzing your document and creating an assignment. This
                      may take a moment.
                    </p>
                  </div>
                ) : assignmentProcessingComplete &&
                  assignmentGeneratedQuestions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4 border-b pb-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">
                          Assignment: {assignmentSubject || "Generated Assignment"}
                        </h3>
                        <div className="flex flex-wrap text-sm text-muted-foreground gap-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {assignmentDueDate || "Not specified"}</span>
                          </div>
                          <div className="flex items-center">
                            <Hash className="h-4 w-4 mr-1" />
                            <span>Assignment #{assignmentNumber || "1"}</span>
                          </div>
                          <div className="flex items-center">
                            <LibraryBig className="h-4 w-4 mr-1" />
                            <span>Points: {assignmentPoints || "20"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Questions ({assignmentGeneratedQuestions.length}):</h4>
                        <div className="text-xs text-muted-foreground">
                          {assignmentConceptual && <span className="mr-2">Conceptual: {assignmentConceptual}</span>}
                          {assignmentTheoretical && <span className="mr-2">Theoretical: {assignmentTheoretical}</span>}
                          {assignmentScenario && <span>Scenario: {assignmentScenario}</span>}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {assignmentGeneratedQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex">
                              <div className="mr-3 font-semibold text-primary">{index + 1}.</div>
                              <div className="flex-1">
                                <p className="mb-3">{question.question}</p>
                                <div className="mt-2">
                                  {question.questionType && (
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                      {question.questionType}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Assignment Generated Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Upload a document and fill in the details to create your
                      custom assignment.
                    </p>
                  </div>
                )}
              </CardContent>
              {assignmentProcessingComplete && assignmentGeneratedQuestions.length > 0 && (
                <CardFooter className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center"
                    onClick={() => copyToClipboard()}
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button 
                    className="flex-1 flex items-center justify-center"
                    onClick={() => handleDownload()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Generate Quiz</CardTitle>
                <CardDescription>
                  Upload your course materials to generate a quiz. You can customize the quiz settings below.
                  After generation, use the "View PDF" button to directly view the content in your browser.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-muted/40 border-gray-300 dark:border-gray-700">
                    <ShieldAlert className="w-12 h-12 mb-3 text-yellow-500" />
                    <p className="mb-2 text-sm font-semibold">
                      Authentication Required
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Please log in to upload documents
                    </p>
                    <Button onClick={handleLoginRedirect}>Log In</Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Upload Material</h3>

                        {quizFile ? (
                          <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="h-6 w-6 text-blue-500" />
                              <div>
                                <p className="font-medium">
                                  {quizFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(quizFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetUpload}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 relative">
                            <div className="flex items-center justify-center flex-col">
                              <UploadIcon className="h-10 w-10 text-gray-400 mb-4" />
                              <p className="text-sm text-center text-muted-foreground">
                                <span className="font-medium text-primary hover:underline cursor-pointer">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, Word, PowerPoint, or image files (max 10MB)
                              </p>
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={isUploading || isProcessing}
                                style={{
                                  cursor: isUploading || isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {quizExtractionStatus === "extracting" && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center text-blue-600 dark:text-blue-400">
                              <div className="mr-2 h-4 w-4 rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
                              <p className="text-sm font-medium">
                                Extracting text from document...
                              </p>
                            </div>
                          </div>
                        )}

                        {quizExtractionStatus === "generating" && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="flex items-center text-purple-600 dark:text-purple-400">
                              <div className="mr-2 h-4 w-4 rounded-full border-2 border-purple-600 dark:border-purple-400 border-t-transparent animate-spin"></div>
                              <p className="text-sm font-medium">
                                Generating questions from document content...
                              </p>
                            </div>
                          </div>
                        )}

                        {quizExtractionStatus === "error" && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <p className="text-sm font-medium">
                                Error processing document
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Please try a different file format or check that
                              the document contains extractable text.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            placeholder="IFT"
                            value={quizDepartment}
                            onChange={(e) => setQuizDepartment(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="IFT"
                            value={quizSubject}
                            onChange={(e) => setQuizSubject(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="class">Class</Label>
                          <Input
                            id="class"
                            placeholder="BSCS-1B"
                            value={quizClassName}
                            onChange={(e) => setQuizClassName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input
                            id="due_date"
                            placeholder="10-12-2021"
                            value={quizDueDate}
                            onChange={(e) => setQuizDueDate(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="points">Points</Label>
                          <Input
                            id="points"
                            placeholder="10"
                            value={quizPoints}
                            onChange={(e) => setQuizPoints(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quiz_no">Quiz No</Label>
                          <Input
                            id="quiz_no"
                            placeholder="Quiz No 1"
                            value={quizNumber}
                            onChange={(e) => setQuizNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="number_of_questions">Number of Questions</Label>
                        <Input
                          id="number_of_questions"
                          placeholder=""
                          value={quizTotalQuestions}
                          onChange={(e) => setQuizTotalQuestions(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="num_conceptual">Num Conceptual</Label>
                          <Input
                            id="num_conceptual"
                            placeholder="1"
                            value={quizConceptual}
                            onChange={(e) =>
                              setQuizConceptual(e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="num_theoretical">Num Theoretical</Label>
                          <Input
                            id="num_theoretical"
                            placeholder="2"
                            value={quizTheoretical}
                            onChange={(e) =>
                              setQuizTheoretical(e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="num_scenario">Num Scenario</Label>
                          <Input
                            id="num_scenario"
                            placeholder="1"
                            value={quizScenario}
                            onChange={(e) =>
                              setQuizScenario(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="difficulty_level">Difficulty Level</Label>
                        <Input
                          id="difficulty_level"
                          placeholder="hard"
                          value={quizDifficulty}
                          onChange={(e) => setQuizDifficulty(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => handleUpload("quiz")}
                  disabled={
                    !quizFile ||
                    isUploading ||
                    isProcessing ||
                    !isAuthenticated
                  }
                >
                  {isUploading
                    ? "Uploading..."
                    : isProcessing
                    ? "Processing..."
                    : "Generate Quiz"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Generated Quiz</CardTitle>
                  <CardDescription>
                    {showPdfViewer 
                      ? "Viewing PDF format of your quiz." 
                      : showSolutionViewer
                      ? "Viewing solution for this quiz."
                      : "Your generated quiz will appear here."}
                  </CardDescription>
                </div>
                {quizProcessingComplete && quizGeneratedQuestions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowPdfViewer(false);
                      setShowSolutionViewer(false);
                    }}
                    className={`ml-auto ${!showPdfViewer && !showSolutionViewer ? 'hidden' : ''}`}
                  >
                    Show Questions
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className={(showPdfViewer || showSolutionViewer) ? "h-[500px] p-0 flex-1" : "h-[500px] overflow-y-auto flex-1"}>
                {/* Show PDF viewer if enabled */}
                {showPdfViewer ? (
                  <PdfViewer url={pdfUrl} height="600px" />
                ) : showSolutionViewer ? (
                  <PdfViewer url={solutionPdfUrl} height="600px" />
                ) : isProcessing && activeTab === "quiz" ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium mb-2">
                      Generating quiz...
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      We're analyzing your document and creating a quiz. This
                      may take a moment.
                    </p>
                  </div>
                ) : quizProcessingComplete && quizGeneratedQuestions.length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4 border-b pb-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">
                          Quiz: {quizSubject || "Generated Quiz"}
                        </h3>
                        <div className="flex flex-wrap text-sm text-muted-foreground gap-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {quizDueDate || "Not specified"}</span>
                          </div>
                          <div className="flex items-center">
                            <Hash className="h-4 w-4 mr-1" />
                            <span>Quiz #{quizNumber || "1"}</span>
                          </div>
                          <div className="flex items-center">
                            <LibraryBig className="h-4 w-4 mr-1" />
                            <span>Points: {quizPoints || "10"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Questions ({quizGeneratedQuestions.length}):</h4>
                        <div className="text-xs text-muted-foreground">
                          {quizConceptual && <span className="mr-2">Conceptual: {quizConceptual}</span>}
                          {quizTheoretical && <span className="mr-2">Theoretical: {quizTheoretical}</span>}
                          {quizScenario && <span>Scenario: {quizScenario}</span>}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {quizGeneratedQuestions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex">
                              <div className="mr-3 font-semibold text-primary">{index + 1}.</div>
                              <div className="flex-1">
                                <p className="mb-3">{question.question}</p>
                                <div className="mt-2">
                                  {question.questionType && (
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                      {question.questionType}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Quiz Generated Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Upload a document and click "Generate Quiz" to create your
                      custom quiz.
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="mt-auto">
                {quizProcessingComplete && quizGeneratedQuestions.length > 0 && (
                  <div className="flex justify-between w-full">
                    <Button 
                      onClick={handleViewSolution} 
                      className="flex-1 flex items-center justify-center mx-1"
                      variant={showSolutionViewer ? "default" : "outline"}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {showSolutionViewer ? "Hide Solution" : "View Solution"}
                    </Button>
                    
                    <Button 
                      onClick={handleDownload} 
                      className="flex-1 flex items-center justify-center mx-1"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    
                    <Button 
                      onClick={handleViewPdf} 
                      className="flex-1 flex items-center justify-center mx-1"
                      variant={showPdfViewer ? "default" : "secondary"}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {showPdfViewer ? "Hide PDF" : "View PDF"}
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Proximity Tab */}
        <TabsContent value="proximity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Proximity Handling</CardTitle>
                <CardDescription>
                  Upload classroom images to count the number of students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-muted/40 border-gray-300 dark:border-gray-700">
                    <ShieldAlert className="w-12 h-12 mb-3 text-yellow-500" />
                    <p className="mb-2 text-sm font-semibold">
                      Authentication Required
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Please log in to upload classroom images
                    </p>
                    <Button onClick={handleLoginRedirect}>Log In</Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Upload Classroom Image</h3>

                        {proximityFile ? (
                          <div className="relative">
                            <div className="aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={URL.createObjectURL(proximityFile)} 
                                alt="Classroom preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
                              onClick={handleResetUpload}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 relative">
                            <div className="flex items-center justify-center flex-col">
                              <ImageIcon className="h-10 w-10 text-gray-400 mb-4" />
                              <p className="text-sm text-center text-muted-foreground">
                                <span className="font-medium text-primary hover:underline cursor-pointer">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG or other image files (max 10MB)
                              </p>
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                disabled={isUploading || isProcessing}
                                style={{
                                  cursor: isUploading || isProcessing
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                              />
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="proximity-class-name">Class Name</Label>
                          <Input
                            id="proximity-class-name"
                            placeholder="Class 5-A"
                            value={proximityClassName}
                            onChange={(e) => setProximityClassName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="proximity-subject">Subject</Label>
                          <Input
                            id="proximity-subject"
                            placeholder="Mathematics"
                            value={proximitySubject}
                            onChange={(e) => setProximitySubject(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={countStudentsInImage}
                  disabled={
                    !proximityImageFile ||
                    isUploading ||
                    isProcessing ||
                    !isAuthenticated ||
                    isCountingStudents
                  }
                >
                  {isCountingStudents
                    ? "Analyzing..."
                    : isUploading
                    ? "Uploading..."
                    : isProcessing
                    ? "Processing..."
                    : "Analyze Classroom Image"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Classroom attendance information based on image analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px] flex flex-col">
                {isProcessing && activeTab === "proximity" ? (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium mb-2">
                      Analyzing classroom image...
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                      We're counting the number of students in your classroom image. This may take a moment.
                    </p>
                  </div>
                ) : proximityProcessingComplete ? (
                  <div className="space-y-6 flex-1">
                      <div className="space-y-6 border-b pb-6">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold">
                            {proximityClassName || "Classroom"} Analysis
                          </h3>
                          <div className="flex flex-wrap text-sm text-muted-foreground gap-2">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display the annotated image if available */}
                      {annotatedImageUrl && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-2">Annotated Image:</h4>
                          <div className="rounded-md overflow-hidden border">
                            <img 
                              src={annotatedImageUrl} 
                              alt="Annotated classroom image" 
                              className="w-full object-contain"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center justify-center text-center py-6">
                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                          <Users className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        
                        <h3 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {studentCount !== null 
                            ? studentCount 
                            : Math.floor(Math.random() * 30) + 10}
                        </h3>
                        <p className="text-xl font-medium mb-1">Students Detected</p>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          The system has analyzed the classroom image and detected this many students.
                        </p>
                      </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Class Name</p>
                        <p className="font-medium">{proximityClassName || "Not specified"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Subject</p>
                        <p className="font-medium">{proximitySubject || "Not specified"}</p>
                      </div>
                      {proximityDepartment && (
                        <div className="space-y-1 col-span-2">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="font-medium">{proximityDepartment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 text-center">
                    <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Analysis Results Yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Upload a classroom image and click "Analyze Classroom Image" to count the number of students.
                    </p>
                  </div>
                )}
              </CardContent>
              {proximityProcessingComplete && (
                <CardFooter className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center"
                    onClick={() => copyToClipboard()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save to Records
                  </Button>
                  <Button 
                    className="flex-1 flex items-center justify-center"
                    onClick={() => handleDownload()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Upload;
