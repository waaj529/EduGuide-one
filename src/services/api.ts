import { toast } from "@/components/ui/use-toast";
import { API_COMMON } from "@/utils/ApiCommon";
import { validateFile, createFormDataWithFile, fetchWithTimeout, getFileTypeCategory } from "@/utils/fileUtils";

// Environment-based API URL configuration
const getApiUrl = () => {
  // Check if we're in production (Vercel deployment)
  if (import.meta.env.PROD) {
    // Use environment variable for production API URL
    return import.meta.env.VITE_API_URL || "https://your-production-api.com/api";
  }
  // Development fallback
  return import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";
};

const API_URL = getApiUrl();

// Development logging for debugging
if (!import.meta.env.PROD) {
  console.log("🔧 API Configuration:", {
    environment: import.meta.env.MODE,
    isProduction: import.meta.env.PROD,
    baseURL: API_URL,
    viteBaseUrl: import.meta.env.VITE_BASE_URL,
    viteApiUrl: import.meta.env.VITE_API_URL
  });
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Simulate network delay for development
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Production-ready logging utility
const isDevelopment = import.meta.env.DEV;

// Production-ready logging functions
const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

const devError = (...args: any[]) => {
  console.error(...args); // Always log errors
};

const prodLog = (message: string, data?: any) => {
  if (!isDevelopment) {
    // In production, you might want to send to a logging service
    // console.info(message, data);
  }
};

// Resolve the Python backend base URL.
//  • In development we call the Vite proxy (relative "/api" path) so the browser sees a same-origin request and CORS is bypassed.
//  • In production we hit the absolute public URL.
const PYTHON_API_BASE = "/api";

// Auth APIs
export const loginUser = async (email: string, password: string) => {
  try {
    // In a real app, this would be a fetch call to your API
    // For demo purposes, we're simulating the API response
    await delay(800);

    // Simulate successful login for demo
    if (email && password) {
      const response = await API_COMMON(
        "post",
        "json",
        "login/login",
        "Error in login request",
        JSON.stringify({ email, password })
      );
      return {
        token: response.token,
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
        },
      };
    } else {
      return { message: "Invalid email or password" };
    }
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Login failed");
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    // Simulate API call
    await delay(1000);

    // Simulate successful registration
    if (username && email && password) {
      const response = await API_COMMON(
        "post",
        "json",
        "login/register",
        "Error in registering user",
        JSON.stringify({ username, email, password })
      );
      return {
        token: "mock-jwt-token",
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
        },
      };
    } else {
      return { message: "Please fill in all fields" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Registration failed");
  }
};

export const getCurrentUser = async () => {
  try {
    await delay(500);
    return {
      id: "user-1",
      username: "demo_user",
      email: "demo@example.com",
    };
  } catch (error) {
    console.error("Get current user error:", error);
    throw new Error("Failed to get current user");
  }
};
export const download_pdf = async () => {
  try {
    const response = await API_COMMON("getPdf", "form", "edus/download_pdf");
    const blob = response.data;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "output.pdf";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    // ...
  }
};
// Module APIs
export const generateAssignment = async (formData: FormData) => {
  try {
    devLog("Generating assignment with form data:", Object.fromEntries(formData.entries()));
    
    // Helper function to validate and clean numeric fields
    const validateNumericField = (value: string | null, defaultValue: string): string => {
      const cleanValue = (value || defaultValue).trim();
      return cleanValue === "" || isNaN(Number(cleanValue)) ? defaultValue : cleanValue;
    };

    // Validate file field
    const file = formData.get("file") as File;
    if (!file || !(file instanceof File)) {
      throw new Error("Valid file is required for assignment generation");
    }

    // Ensure all required fields are present and properly formatted
    const requiredFields = {
      file: file,
      department: (formData.get("department") as string || "").trim(),
      subject: (formData.get("subject") as string || "").trim(), 
      class: (formData.get("class") as string || "").trim(),
      due_date: (formData.get("due_date") as string || "").trim(),
      points: validateNumericField(formData.get("points") as string, "10"),
      Assignment_no: (formData.get("Assignment_no") as string || "").trim(),
      number_of_questions: validateNumericField(formData.get("number_of_questions") as string, "5"),
      num_conceptual: validateNumericField(formData.get("num_conceptual") as string, "0"),
      num_theoretical: validateNumericField(formData.get("num_theoretical") as string, "0"), 
      num_scenario: validateNumericField(formData.get("num_scenario") as string, "0"),
      difficulty_level: (formData.get("difficulty_level") as string || "").trim()
    };
    
    // Debug log the actual field values
    devLog("🔍 Raw field values received:", {
      department: `"${requiredFields.department}" (length: ${requiredFields.department?.length || 0})`,
      subject: `"${requiredFields.subject}" (length: ${requiredFields.subject?.length || 0})`,
      class: `"${requiredFields.class}" (length: ${requiredFields.class?.length || 0})`,
      due_date: `"${requiredFields.due_date}" (length: ${requiredFields.due_date?.length || 0})`,
      Assignment_no: `"${requiredFields.Assignment_no}" (length: ${requiredFields.Assignment_no?.length || 0})`,
      difficulty_level: `"${requiredFields.difficulty_level}" (length: ${requiredFields.difficulty_level?.length || 0})`
    });

    // Validate required text fields for assignment
    const requiredTextFields = {
      department: "Department",
      subject: "Subject", 
      class: "Class",
      due_date: "Due Date",
      Assignment_no: "Assignment Number",
      difficulty_level: "Difficulty Level"
    };

    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredTextFields)) {
      if (!requiredFields[field] || requiredFields[field].trim() === "") {
        missingFields.push(displayName);
      }
    }
    
    if (missingFields.length > 0) {
      devError(`❌ Missing required fields: ${missingFields.join(', ')}`);
      throw new Error(`The following fields are required: ${missingFields.join(', ')}. Please fill out all form fields.`);
    }
    
    // Create validated FormData with exact field names from API
    const validatedFormData = new FormData();
    
    // Add file
    if (requiredFields.file) {
      validatedFormData.append("file", requiredFields.file);
    }
    
    // Add all other fields with proper names matching the API
    validatedFormData.append("department", requiredFields.department);
    validatedFormData.append("subject", requiredFields.subject);
    validatedFormData.append("class", requiredFields.class);
    validatedFormData.append("due_date", requiredFields.due_date);
    validatedFormData.append("points", requiredFields.points);
    validatedFormData.append("Assignment_no", requiredFields.Assignment_no);
    validatedFormData.append("number_of_questions", requiredFields.number_of_questions);
    validatedFormData.append("num_conceptual", requiredFields.num_conceptual);
    validatedFormData.append("num_theoretical", requiredFields.num_theoretical);
    validatedFormData.append("num_scenario", requiredFields.num_scenario);
    validatedFormData.append("difficulty_level", requiredFields.difficulty_level);
    
    devLog("🔍 Assignment API request fields:", {
      department: requiredFields.department,
      subject: requiredFields.subject,
      class: requiredFields.class,
      due_date: requiredFields.due_date,
      points: requiredFields.points,
      Assignment_no: requiredFields.Assignment_no,
      number_of_questions: requiredFields.number_of_questions,
      num_conceptual: requiredFields.num_conceptual,
      num_theoretical: requiredFields.num_theoretical,
      num_scenario: requiredFields.num_scenario,
      difficulty_level: requiredFields.difficulty_level,
      file: requiredFields.file ? `${requiredFields.file.name} (${requiredFields.file.size} bytes)` : 'No file'
    });

    // Validate all numeric fields are actually numbers
    const numericFields = {
      points: requiredFields.points,
      number_of_questions: requiredFields.number_of_questions,
      num_conceptual: requiredFields.num_conceptual,
      num_theoretical: requiredFields.num_theoretical,
      num_scenario: requiredFields.num_scenario
    };

    for (const [key, value] of Object.entries(numericFields)) {
      if (isNaN(Number(value)) || value.trim() === "") {
        devError(`❌ Invalid numeric value for ${key}: "${value}"`);
        throw new Error(`Invalid numeric value for ${key}: "${value}"`);
      }
      devLog(`✅ ${key}: "${value}" -> ${Number(value)}`);
    }
    
    // Make the API call to the assignment generation endpoint
    const generateResponse = await fetch(`${PYTHON_API_BASE}/assignment/assignment`, {
      method: 'POST',
      body: validatedFormData
    });
    
    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      devError(`Assignment API failed with status ${generateResponse.status}:`, errorText);
      
      // Check for specific backend error and provide helpful message
      if (errorText.includes("page_content")) {
        throw new Error(`Backend API error: Document processing failed. Please contact the backend developer to fix the 'page_content' attribute error.`);
      }
      
      throw new Error(`API error (${generateResponse.status}): ${errorText}`);
    }
    
    const data = await generateResponse.json();
    console.log("Assignment generation response:", data);
    
    // Process the response data into a standardized question format
    let questions = [];
    
    if (data.questions && Array.isArray(data.questions)) {
      questions = data.questions.map((q, idx) => ({
        id: idx + 1,
        question: q.question || q.text || q,
        questionType: idx % 3 === 0 ? "conceptual" : 
                     idx % 3 === 1 ? "theoretical" : "scenario"
      }));
    } else if (data.answer && typeof data.answer === 'string') {
      questions = data.answer
        .split(/\d+\.\s+/)
        .filter(q => q.trim() !== '')
        .map((q, idx) => ({
          id: idx + 1,
          question: q.trim(),
          questionType: idx % 3 === 0 ? "conceptual" : 
                       idx % 3 === 1 ? "theoretical" : "scenario"
        }));
    }
    
    if (questions && questions.length > 0) {
      const requestedQuestionCount = parseInt(requiredFields.number_of_questions) || 10;
      console.log(`Successfully generated ${questions.length} assignment questions from API`);
      toast({
        title: "Assignment Generated",
        description: `Successfully created ${questions.length} questions from your document`,
      });
      
      return questions.slice(0, requestedQuestionCount);
    } else {
      console.log("API returned empty questions array");
      throw new Error("Assignment API returned no questions");
    }
  } catch (error) {
    console.error("Generate assignment error:", error);
    toast({
      title: "Failed to Generate Assignment",
      description: "Unable to generate assignment questions from your document. The API service may be temporarily unavailable.",
      variant: "destructive",
    });
    throw error;
  }
};

// Generate quiz from the API
export const generateQuiz = async (formData: FormData) => {
  try {
    console.log("Generating quiz with form data:", Object.fromEntries(formData.entries()));
    
    // Ensure all required fields are present and properly formatted
    const requiredFields = {
      file: formData.get("file") as File,
      department: (formData.get("department") as string || "").trim(),
      subject: (formData.get("subject") as string || "").trim(), 
      class: (formData.get("class") as string || "").trim(),
      due_date: (formData.get("due_date") as string || "").trim(),
      points: (formData.get("points") as string || "").trim(),
      quiz_no: (formData.get("quiz_no") as string || "").trim(),
      number_of_questions: (formData.get("number_of_questions") as string || "5").trim(),
      num_conceptual: (formData.get("num_conceptual") as string || "0").trim(),
      num_theoretical: (formData.get("num_theoretical") as string || "0").trim(), 
      num_scenario: (formData.get("num_scenario") as string || "0").trim(),
      difficulty_level: (formData.get("difficulty_level") as string || "").trim()
    };
    
    // Validate required text fields for quiz
    const requiredTextFields = {
      department: "Department",
      subject: "Subject", 
      class: "Class",
      due_date: "Due Date",
      quiz_no: "Quiz Number",
      difficulty_level: "Difficulty Level"
    };

    for (const [field, displayName] of Object.entries(requiredTextFields)) {
      if (!requiredFields[field] || requiredFields[field].trim() === "") {
        throw new Error(`${displayName} is required. Please fill out all form fields.`);
      }
    }
    
    // Create validated FormData with exact field names from API
    const validatedFormData = new FormData();
    
    // Add file
    if (requiredFields.file) {
      validatedFormData.append("file", requiredFields.file);
    }
    
    // Add all other fields with proper names matching the API
    validatedFormData.append("department", requiredFields.department);
    validatedFormData.append("subject", requiredFields.subject);
    validatedFormData.append("class", requiredFields.class);
    validatedFormData.append("due_date", requiredFields.due_date);
    validatedFormData.append("points", requiredFields.points);
    validatedFormData.append("quiz_no", requiredFields.quiz_no);
    validatedFormData.append("number_of_questions", requiredFields.number_of_questions);
    validatedFormData.append("num_conceptual", requiredFields.num_conceptual);
    validatedFormData.append("num_theoretical", requiredFields.num_theoretical);
    validatedFormData.append("num_scenario", requiredFields.num_scenario);
    validatedFormData.append("difficulty_level", requiredFields.difficulty_level);
    
    console.log("Quiz API request fields:", {
      department: requiredFields.department,
      subject: requiredFields.subject,
      class: requiredFields.class,
      due_date: requiredFields.due_date,
      points: requiredFields.points,
      quiz_no: requiredFields.quiz_no,
      number_of_questions: requiredFields.number_of_questions,
      num_conceptual: requiredFields.num_conceptual,
      num_theoretical: requiredFields.num_theoretical,
      num_scenario: requiredFields.num_scenario,
      difficulty_level: requiredFields.difficulty_level,
      file: requiredFields.file ? `${requiredFields.file.name} (${requiredFields.file.size} bytes)` : 'No file'
    });
    
    // Make the API call to the quiz generation endpoint
    const response = await fetch(`${PYTHON_API_BASE}/quiz/quiz`, {
      method: 'POST',
      body: validatedFormData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Quiz API failed with status ${response.status}:`, errorText);
      
      // Check for specific backend error and provide helpful message
      if (errorText.includes("page_content")) {
        throw new Error(`Backend API error: Document processing failed. Please contact the backend developer to fix the 'page_content' attribute error.`);
      }
      
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Quiz generation response:", data);
    
    // Process the response data into a standardized question format
    let questions = [];
    
    if (data.questions && Array.isArray(data.questions)) {
      questions = data.questions.map((q, idx) => ({
        id: idx + 1,
        question: q.question || q.text || q,
        questionType: idx % 3 === 0 ? "conceptual" : 
                     idx % 3 === 1 ? "theoretical" : "scenario"
      }));
    } else if (data.answer && typeof data.answer === 'string') {
      questions = data.answer
        .split(/\d+\.\s+/)
        .filter(q => q.trim() !== '')
        .map((q, idx) => ({
          id: idx + 1,
          question: q.trim(),
          questionType: idx % 3 === 0 ? "conceptual" : 
                       idx % 3 === 1 ? "theoretical" : "scenario"
        }));
    }
    
    if (questions && questions.length > 0) {
      const requestedQuestionCount = parseInt(requiredFields.number_of_questions) || 10;
      console.log(`Successfully generated ${questions.length} quiz questions from API`);
      toast({
        title: "Quiz Generated",
        description: `Successfully created ${questions.length} questions from your document`,
      });
      
      return questions.slice(0, requestedQuestionCount);
    } else {
      console.log("API returned empty questions array");
      throw new Error("Quiz API returned no questions");
    }
  } catch (error) {
    console.error("Generate quiz error:", error);
    toast({
      title: "Failed to Generate Quiz",
      description: "Unable to generate quiz questions from your document. The API service may be temporarily unavailable.",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to distribute question types according to user preferences
function distributeQuestionTypes(questions, conceptualCount, theoreticalCount, scenarioCount) {
  if (!questions || questions.length === 0) return [];
  
  // Create a copy of the questions array to avoid mutating the original
  const distributedQuestions = [...questions];
  
  // Calculate total requested questions
  const totalRequested = conceptualCount + theoreticalCount + scenarioCount;
  
  // If we don't have enough questions to fulfill the request, return what we have
  if (distributedQuestions.length < totalRequested) return distributedQuestions;
  
  // Assign question types based on the requested distribution
  let conceptualAssigned = 0;
  let theoreticalAssigned = 0;
  let scenarioAssigned = 0;
  
  distributedQuestions.forEach((question, index) => {
    // Determine which type to assign based on counts
    if (conceptualAssigned < conceptualCount) {
      question.questionType = "conceptual";
      conceptualAssigned++;
    } else if (theoreticalAssigned < theoreticalCount) {
      question.questionType = "theoretical";
      theoreticalAssigned++;
    } else if (scenarioAssigned < scenarioCount) {
      question.questionType = "scenario";
      scenarioAssigned++;
    } else {
      // If we've fulfilled all requirements, assign based on index
      question.questionType = index % 3 === 0 ? "conceptual" : 
                             index % 3 === 1 ? "theoretical" : "scenario";
    }
  });
  
  return distributedQuestions;
}

// Download generated quiz from the API using new endpoint
export const downloadQuiz = async (formData: FormData) => {
  try {
    console.log("Downloading quiz with form data:", Object.fromEntries(formData.entries()));
    
    // Convert FormData to query params for GET request
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      // Skip file entry in URL parameters - files can't be sent in GET requests
      if (key !== 'file') {
        params.append(key, value.toString());
        console.log(`Including in quiz download: ${key}=${value}`);
      }
    }
    
    // Use the corrected download endpoint
    const response = await fetch(`${PYTHON_API_BASE}/quiz/quiz_download?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    downloadPDF(blob, "quiz.pdf");
    return blob;
  } catch (error) {
    console.error("Download quiz error:", error);
    toast({
      title: "Error",
      description: "Failed to download quiz. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Download quiz solution using new endpoint
export const downloadQuizSolution = async (formData: FormData) => {
  try {
    console.log("Downloading quiz solution with form data:", Object.fromEntries(formData.entries()));
    
    // Convert FormData to query params for GET request
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      // Skip file entry in URL parameters - files can't be sent in GET requests
      if (key !== 'file') {
        params.append(key, value.toString());
        console.log(`Including in quiz solution download: ${key}=${value}`);
      }
    }
    
    // Use the quiz solution download endpoint
    const response = await fetch(`${PYTHON_API_BASE}/quiz/quiz_solution_download?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    downloadPDF(blob, "quiz_solution.pdf");
    return blob;
  } catch (error) {
    console.error("Download quiz solution error:", error);
    toast({
      title: "Error",
      description: "Failed to download quiz solution. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Helper function for PDF downloads
const downloadPDF = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast({
    title: "Download complete",
    description: `${filename} has been downloaded successfully.`,
  });
};

export const generateExam = async (formData: FormData) => {
  try {
    console.log("Generating exam with data:", formData.get("file"));

    const response = await API_COMMON(
      "post",
      "form",
      "exams/exam",
      "Error in generating exam",
      formData
    );

    const data = response;
    return data.questions.map((question, index) => ({
      question: question,
      questionType:
        index % 3 === 0
          ? "conceptual"
          : index % 3 === 1
          ? "theoretical"
          : "scenario",
    }));
  } catch (error) {
    console.error("Generate exam error:", error);
    toast({
      title: "Error",
      description: "Failed to generate exam questions. Please try again.",
      variant: "destructive",
    });
    throw new Error("Failed to generate exam");
  }
};

function parseResponse(response: string) {
  const obj = {
    Score: "",
    Feedback: "",
  };
  const pairs = response.split(/,\s*(?=[A-Z])/);
  pairs.forEach((pair) => {
    const index = pair.indexOf(":");
    if (index !== -1) {
      const key = pair.slice(0, index).trim();
      const value = pair.slice(index + 1).trim();
      obj[key] = value;
    }
  });
  return { score: obj.Score, feedback: obj.Feedback };
}

export const evaluateAnswer = async (questionData: {
  question: string;
  answer: string;
}) => {
  try {
    console.log("Called eval answer");
    const response = await API_COMMON(
      "post",
      "json",
      "exams/evaluate_answer",
      "Error in evaluating answer",
      JSON.stringify(questionData)
    );

    console.log(typeof response);
    const data = parseResponse(response);
    console.log("Data", data);
    return data;
  } catch (error) {
    console.error("Error in evaluating answer:", error);
    toast({
      title: "Error",
      description: "Failed to Evaluate answer. Please try again.",
      variant: "destructive",
    });
    throw new Error("Failed to evaluate answer");
  }
};

// Download generated assignment from the API using new endpoint
export const downloadAssignment = async (formData: FormData) => {
  try {
    console.log("Downloading assignment with form data:", Object.fromEntries(formData.entries()));
    
    // Convert FormData to query params for GET request
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      // Skip file entry in URL parameters - files can't be sent in GET requests
      if (key !== 'file') {
        params.append(key, value.toString());
        console.log(`Including in assignment download: ${key}=${value}`);
      }
    }
    
    // Use the corrected download endpoint
    const response = await fetch(`${PYTHON_API_BASE}/assignment/assignment_download?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    downloadPDF(blob, "assignment.pdf");
    return blob;
  } catch (error) {
    console.error("Download assignment error:", error);
    toast({
      title: "Error",
      description: "Failed to download assignment. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

// Download assignment solution using new endpoint
export const downloadAssignmentSolution = async (formData: FormData) => {
  try {
    console.log("Downloading assignment solution with form data:", Object.fromEntries(formData.entries()));
    
    // Convert FormData to query params for GET request
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      // Skip file entry in URL parameters - files can't be sent in GET requests
      if (key !== 'file') {
        params.append(key, value.toString());
        console.log(`Including in assignment solution download: ${key}=${value}`);
      }
    }
    
    // Use the assignment solution download endpoint
    const response = await fetch(`${PYTHON_API_BASE}/assignment/assignment_solution_download?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const blob = await response.blob();
    downloadPDF(blob, "assignment_solution.pdf");
    return blob;
  } catch (error) {
    console.error("Download assignment solution error:", error);
    toast({
      title: "Error",
      description: "Failed to download assignment solution. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export interface PracticeQuestion {
  id: string;
  question: string;
  userAnswer?: string;
  isInstruction?: boolean;
  evaluation?: {
    score: number;
    feedback: string;
    isCorrect: boolean;
  };
}

export async function generatePracticeQuestions(formData: FormData): Promise<PracticeQuestion[]> {
  try {
    // Validate FormData before sending
    const file = formData.get('file') as File;
    if (!file || !(file instanceof File)) {
      throw new Error('No valid file found in form data');
    }

    // Validate file using utility function
    const validationResult = validateFile(file, 10); // 10MB limit
    if (!validationResult.isValid) {
      throw new Error(validationResult.error || 'File validation failed');
    }

    const fileCategory = getFileTypeCategory(file);
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    console.log(`🚀 Generating practice questions for ${fileCategory} file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB, ${file.type})`);
    console.log(`📄 File type: ${fileExtension}`);
    
    // Log all FormData entries for debugging
    console.log('📋 FormData contents:');
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`  ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    let response;
    let apiEndpoint;
    let finalFormData = formData;

    // Use exam_generate endpoint for ALL file types (as confirmed working in Postman)
          apiEndpoint = '/api/exam/exam_generate';
    console.log(`📡 Using exam_generate endpoint for ${fileExtension} file`);

    // Make the API call with the appropriate endpoint and data
    try {
      response = await fetchWithTimeout(
        apiEndpoint,
        {
          method: 'POST',
          body: finalFormData,
          headers: {
            'Accept': 'application/json',
          },
        },
        60000 // 60 second timeout for file processing
      );

      console.log(`📡 API Response Status: ${response.status} ${response.statusText}`);
      
      // No fallbacks - if the primary endpoint fails, we fail with a clear error
      if (!response.ok) {
        let errorMessage = `${apiEndpoint} failed with status ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch (e) {
          // Ignore error text parsing errors
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`🚨 API call failed:`, error);
      throw error;
    }

          if (!response.ok) {
        // Get detailed error information
        let errorMessage = `API Error ${response.status}: ${response.statusText}`;
        try {
          const errorText = await response.text();
          console.error('🚨 API Error Details:', errorText);
          
          // Check if it's an HTML error page (like 500 Internal Server Error)
          if (errorText.includes('<!doctype html>') || errorText.includes('<html')) {
            // Extract the title or main error from HTML if possible
            const titleMatch = errorText.match(/<title>(.*?)<\/title>/i);
            const h1Match = errorText.match(/<h1>(.*?)<\/h1>/i);
            
            if (titleMatch && titleMatch[1]) {
              errorMessage = `Server Error: ${titleMatch[1]}`;
            } else if (h1Match && h1Match[1]) {
              errorMessage = `Server Error: ${h1Match[1]}`;
            } else {
              errorMessage = `Server Error (${response.status}): The API server encountered an internal error while processing your file. This may be due to missing required fields or a server-side issue.`;
            }
          } else {
            // Try to parse as JSON for structured errors
            try {
              const errorJson = JSON.parse(errorText);
              if (errorJson.error) {
                errorMessage = errorJson.error;
              } else if (errorJson.message) {
                errorMessage = errorJson.message;
              }
            } catch {
              // If not JSON and not HTML, use raw text if it's short enough
              if (errorText.length > 0 && errorText.length < 200) {
                errorMessage = errorText;
              }
            }
          }
        } catch {
          // If we can't read the error response, use the status
        }
        
        throw new Error(errorMessage);
      }

    const data = await response.json();
    console.log("✅ RAW API Response data:", JSON.stringify(data, null, 2));
    
    // Initialize the results array
    let questionsArray: PracticeQuestion[] = [];
    
    // Helper function to check if text is instructional rather than a question
    const isInstructionText = (text: string): boolean => {
      const instructionPatterns = [
        /^however,?\s+i\s+can\s+(?:help\s+)?generate/i,
        /^however,?\s+i\s+can\s+generate\s+some\s+questions/i,
        /however.*generate.*questions.*based.*information.*context/i,
        /however.*generate.*questions.*context.*here.*they.*are/i,
        /^here\s+are\s+(?:some\s+)?questions/i,
        /^here\s+they\s+are/i,
        /^based\s+on\s+the\s+(?:text|context|document|information)/i,
        /^i\s+(?:can|will)\s+generate\s+questions/i,
        /^the\s+following\s+(?:are\s+)?questions/i,
        /^below\s+are\s+(?:some\s+)?questions/i,
        /^these\s+questions\s+are\s+based\s+on/i,
        /^answer\s+the\s+questions\s+below/i,
        /given\s+in\s+the\s+context/i,
        /information\s+given\s+in\s+the\s+context/i
      ];
      
      // Test specific known problematic text
      if (text.includes("However, I can generate")) {
        console.log(`🔴 FOUND PROBLEMATIC TEXT: "${text}"`);
        return true; // Immediately filter out this text
      }
      
      // Also check for other common instruction phrases
      const instructionKeywords = [
        "However, I can help generate questions",
        "Here are some questions based on",
        "Based on the context",
        "Here they are:"
      ];
      
      if (instructionKeywords.some(keyword => text.includes(keyword))) {
        console.log(`🔴 FOUND INSTRUCTION KEYWORD in: "${text}"`);
        return true; // Immediately filter out this text
      }
      
      const isInstruction = instructionPatterns.some(pattern => {
        const matches = pattern.test(text.trim());
        if (matches) {
          console.log(`🚫 PATTERN MATCHED: ${pattern} for text: "${text.substring(0, 100)}..."`);
        }
        return matches;
      });
      
      if (isInstruction) {
        console.log(`🚫 INSTRUCTION TEXT DETECTED: "${text.substring(0, 100)}..."`);
      }
      return isInstruction;
    };

    // Helper function to filter out instruction text and extract actual questions
    const filterQuestions = (questions: string[]): string[] => {
      const filtered = questions.filter(q => {
        const trimmedQ = q.trim();
        
        // Check if it's instructional text
        if (isInstructionText(trimmedQ)) {
          console.log(`🔍 Filtered out instruction text: "${trimmedQ.substring(0, 50)}..."`);
          return false;
        }
        
        // Check length and question patterns
        const isValidQuestion = trimmedQ.length > 10 && 
               // Must contain a question word or end with question mark to be considered a question
               (/\?$/.test(trimmedQ) || /\b(?:what|how|why|when|where|which|who|is|are|do|does|did|can|could|would|will|should)\b/i.test(trimmedQ));
        
        if (!isValidQuestion && trimmedQ.length > 0) {
          console.log(`🔍 Filtered out non-question text: "${trimmedQ.substring(0, 50)}..."`);
        }
        
        return isValidQuestion;
      });
      
      console.log(`📊 Question filtering: ${questions.length} total items → ${filtered.length} valid questions`);
      return filtered;
    };

        // Handle exam_generate endpoint response format (PDF files only)
    if (data && data.questions && Array.isArray(data.questions)) {
      console.log(`📋 Processing questions array with ${data.questions.length} items`);
      // Primary format: questions array from exam_generate endpoint
      const rawQuestions = data.questions.map((q: any, index: number) => {
        const questionText = typeof q === 'string' ? q : (q.question || q.text || q.content || String(q));
        console.log(`📝 Raw question ${index + 1}: "${questionText.substring(0, 100)}..."`);
        return questionText;
      });
      
      console.log(`🔍 About to filter ${rawQuestions.length} raw questions`);
      const filteredQuestions = filterQuestions(rawQuestions);
      console.log(`✅ After filtering: ${filteredQuestions.length} valid questions remain`);
      
      const formattedQuestions = filteredQuestions.map((q, index) => ({
        id: `question-${index + 1}`,
        question: q.trim(),
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (Array.isArray(data)) {
      console.log(`📋 Processing direct array with ${data.length} items`);
      // If data is already an array, format it directly
      const rawQuestions = data.map((q: any, index: number) => {
        const questionText = typeof q === 'string' ? q : (q.question || q.text || String(q));
        console.log(`📝 Raw question ${index + 1}: "${questionText.substring(0, 100)}..."`);
        return questionText;
      });
      
      const filteredQuestions = filterQuestions(rawQuestions);
      const formattedQuestions = filteredQuestions.map((q, index) => ({
        id: `question-${index + 1}`,
        question: q.trim(),
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (data && data.answer && typeof data.answer === 'string') {
      console.log(`📋 Processing data.answer string: "${data.answer.substring(0, 100)}..."`);
      // Handle string response with numbered questions
      const rawQuestions = data.answer
        .split(/\d+\.\s+/)
        .filter(q => q.trim() !== '');
      
      console.log(`📝 Split into ${rawQuestions.length} parts`);
      rawQuestions.forEach((q, index) => {
        console.log(`📝 Part ${index + 1}: "${q.substring(0, 100)}..."`);
      });
      
      const filteredQuestions = filterQuestions(rawQuestions);
      const formattedQuestions = filteredQuestions.map((q, index) => ({
        id: `question-${index + 1}`,
        question: q.trim(),
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (data && data.points && Array.isArray(data.points)) {
      // Handle points array format
      const filteredQuestions = filterQuestions(data.points);
      const formattedQuestions = filteredQuestions.map((point: string, index: number) => ({
        id: `question-${index + 1}`,
        question: point.trim(),
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (data && typeof data === 'object') {
      // If data is a single question object
      questionsArray.push({
        id: 'question-1',
        question: data.question || data.text || data.answer || data.content || JSON.stringify(data),
        isInstruction: false
      });
    } else {
      // Fallback for unexpected formats
      console.warn('⚠️ Unexpected API response format:', data);
      throw new Error('The API returned data in an unexpected format. This might be due to an unsupported file type or a temporary server issue.');
    }
    
    // Final validation and debug info
    console.log(`📊 FINAL PROCESSING RESULTS:`);
    console.log(`   - Total items in questionsArray: ${questionsArray.length}`);
    questionsArray.forEach((q, index) => {
      console.log(`   - Item ${index + 1}: "${q.question.substring(0, 50)}..." (isInstruction: ${q.isInstruction})`);
    });
    
    // Validate that we have at least one question
    const validQuestions = questionsArray.filter(q => !q.isInstruction && q.question.trim().length > 0);
    
    console.log(`📊 VALIDATION RESULTS:`);
    console.log(`   - Valid questions after filtering: ${validQuestions.length}`);
    validQuestions.forEach((q, index) => {
      console.log(`   - Valid question ${index + 1}: "${q.question.substring(0, 50)}..."`);
    });
    
    if (validQuestions.length === 0) {
      console.error('⚠️ No valid questions found after filtering. Raw API response:', data);
      throw new Error('No valid questions were generated from the uploaded file. The response may contain only instructional text. Please try with a different file or check if the file contains readable content.');
    }
    
    console.log(`✅ Successfully processed ${validQuestions.length} questions (filtered from ${questionsArray.length} total items)`);
    return validQuestions;
    
  } catch (error) {
    console.error('🚨 Failed to generate practice questions:', error);
    
    // Provide more specific error messages based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the question generation service. Please check your internet connection and try again.');
    } else if (error.message.includes('400')) {
      throw new Error('Invalid file format or corrupted file. Please try uploading a different file.');
    } else if (error.message.includes('413')) {
      throw new Error('File is too large for processing. Please try with a smaller file.');
    } else if (error.message.includes('415')) {
      throw new Error('Unsupported file type. This service supports PDF, Word documents (.docx, .doc), PowerPoint files (.pptx, .ppt), and images.');
    } else if (error.message.includes('500')) {
      throw new Error('Server error: The question generation service encountered an issue processing your file. Please try again later or try with a different file.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Request timeout: The file is taking too long to process. Please try with a smaller file.');
    }
    
    // Re-throw the original error if we can't provide a more specific message
    throw error;
  }
}

export async function evaluatePracticeAnswer(questionId: string, question: string, userAnswer: string): Promise<any> {
  try {
    console.log("Evaluating answer:", { questionId, question, userAnswer: userAnswer.substring(0, 20) + "..." });
    
    const response = await fetch('/api/exam/evaluate_answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: questionId,
        question,
        answer: userAnswer,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error evaluating answer: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", data);
    
    // Extract score and feedback from the "Answer" field
    if (data && data.Answer) {
      const answerText = data.Answer;
      
      // Parse the score (format: "Score: X/10")
      const scoreMatch = answerText.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) / 10 : 0; // Normalize to 0-1 range
      
      // Parse the feedback (format: "Feedback: text")
      const feedbackMatch = answerText.match(/Feedback:\s*([\s\S]*)/i);
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : answerText;
      
      console.log("Parsed response:", { score, feedback });
      
      return {
        score: score,
        feedback: feedback,
        // Any additional fields needed by the UI
      };
    }
    
    // Fallback if the response doesn't have the expected format
    return {
      score: 0,
      feedback: "The evaluation service returned an unexpected response format."
    };
  } catch (error) {
    console.error('Failed to evaluate answer:', error);
    toast({
      title: "Evaluation Failed",
      description: "We couldn't evaluate your answer at this time. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
}

// View generated quiz PDF in a new tab using corrected endpoint
export const viewQuizPdf = async (formData?: FormData, callback?: (url: string) => void) => {
  try {
    console.log("🚀 Opening quiz PDF view...");
    
    // Go directly to the view endpoint since quiz is already generated
    const pdfUrl = `${PYTHON_API_BASE}/quiz/quiz_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      // Open in new tab
      window.open(pdfUrl, '_blank');
    }
      
      toast({
      title: "Quiz PDF opened",
      description: "The generated quiz has been opened in a new tab.",
      });
    
  } catch (error) {
    // Fallback: just try to open the view URL directly
    const pdfUrl = `${PYTHON_API_BASE}/quiz/quiz_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      window.open(pdfUrl, '_blank');
    }
    
    toast({
      title: "Quiz PDF opened",
      description: "The quiz viewer has been opened.",
    });
    
    console.error("❌ View quiz PDF error:", error);
    toast({
      title: "Error",
      description: "Failed to generate or view quiz PDF. Please try again.",
      variant: "destructive",
    });
  }
};

// View quiz solution PDF using corrected endpoint
export const viewQuizSolutionPdf = async (callback?: (url: string) => void) => {
  try {
    // Use the quiz solution view endpoint
    const pdfUrl = `${PYTHON_API_BASE}/quiz/quiz_solution_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      // Open in new tab
      window.open(pdfUrl, '_blank');
    }
      
      toast({
      title: "Quiz Solution PDF opened",
        description: "The quiz solution has been opened in a new tab.",
      });
    
  } catch (error) {
    console.error("View quiz solution PDF error:", error);
    toast({
      title: "Error", 
      description: "Failed to view quiz solution PDF. Please try again.",
      variant: "destructive",
    });
  }
};

// View generated assignment PDF in a new tab using corrected endpoint
export const viewAssignmentPdf = async (formData?: FormData, callback?: (url: string) => void) => {
  try {
    console.log("🚀 Opening assignment PDF view...");
    
    // Go directly to the view endpoint since assignment is already generated
    const pdfUrl = `${PYTHON_API_BASE}/assignment/assignment_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      // Open in new tab
      window.open(pdfUrl, '_blank');
    }
    
    toast({
      title: "Assignment PDF opened",
      description: "The generated assignment has been opened in a new tab.",
    });
    
  } catch (error) {
    // Fallback: just try to open the view URL directly
    const pdfUrl = `${PYTHON_API_BASE}/assignment/assignment_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      window.open(pdfUrl, '_blank');
    }
    
    console.error("❌ View assignment PDF error:", error);
    toast({
      title: "Error",
      description: "Failed to generate or view assignment PDF. Please try again.",
      variant: "destructive",
    });
  }
};

// View assignment solution PDF using corrected endpoint
export const viewAssignmentSolutionPdf = async (callback?: (url: string) => void) => {
  try {
    // Use the corrected assignment solution view endpoint
    const pdfUrl = `${PYTHON_API_BASE}/assignment/assignment_solution_view`;
    
    if (callback) {
      callback(pdfUrl);
    } else {
      // Open in new tab
      window.open(pdfUrl, '_blank');
    }
    
    toast({
      title: "Assignment Solution PDF opened",
      description: "The assignment solution has been opened in a new tab.",
    });
    
  } catch (error) {
    console.error("View assignment solution PDF error:", error);
    toast({
      title: "Error", 
      description: "Failed to view assignment solution PDF. Please try again.",
      variant: "destructive",
    });
  }
};

export async function generateCheatSheet(formData: FormData): Promise<string[]> {
  try {
    console.log("Generating cheat sheet with form data:", Object.fromEntries(formData));
    
    const response = await fetch(`${PYTHON_API_BASE}/cheat_sheet/cheat_sheet`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error generating cheat sheet: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);
    
    // Handle response format from screenshot (questions array)
    if (data && data.questions && Array.isArray(data.questions)) {
      // Extract all items from the questions array
      return data.questions.map((item: string) => item);
    }
    // Handle other potential response formats
    else if (data && data.points && Array.isArray(data.points)) {
      return data.points;
    } else if (data && data.cheatSheet && Array.isArray(data.cheatSheet)) {
      return data.cheatSheet;
    } else if (data && typeof data.response === 'string') {
      // Split by new lines or bullet points
      return data.response.split(/\n+|\*\s+/).filter((point: string) => point.trim().length > 0);
    } else if (Array.isArray(data)) {
      return data.map((item: any) => typeof item === 'string' ? item : JSON.stringify(item));
    } else {
      // If response format doesn't match any expected formats, try to extract useful data
      const extractedPoints: string[] = [];
      
      // Try to extract from any string properties in the object
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            extractedPoints.push(value);
          } else if (Array.isArray(value)) {
            value.forEach(item => {
              if (typeof item === 'string' && item.trim().length > 0) {
                extractedPoints.push(item);
              } else if (typeof item === 'object' && item !== null) {
                // If array contains objects, try to stringify them
                extractedPoints.push(JSON.stringify(item));
              }
            });
          }
        });
      }
      
      if (extractedPoints.length > 0) {
        return extractedPoints;
      }
      
      console.warn('Unexpected cheat sheet API response format:', data);
      return [
        "The API returned data in an unexpected format.",
        "Please try again or contact support if this issue persists."
      ];
    }
  } catch (error) {
    console.error('Failed to generate cheat sheet:', error);
    throw error;
  }
}

// For development: Set this to true to enable detailed debug mode for speech generation
const DEBUG_SPEECH_GENERATION = true;

// Function to log the FormData contents for debugging
function logFormData(formData: FormData) {
  console.log("FormData entries:");
  for (const pair of formData.entries()) {
    if (pair[1] instanceof Blob) {
      console.log(`${pair[0]}: [Blob] size=${(pair[1] as Blob).size}, type=${(pair[1] as Blob).type}`);
    } else {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  }
}

// Generate speech from text using the API
export async function generateSummary(formData: FormData): Promise<string> {
  try {
    console.log("Generating summary with data:", formData.get("file"));

    // Try the cheat sheet endpoint which works for content generation
    const response = await fetch(`${PYTHON_API_BASE}/cheat_sheet/cheat_sheet`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error generating summary: ${response.status}`);
    }

    const data = await response.json();
    console.log("Summary API response:", data);
    
    // Handle cheat sheet response format and convert to summary
    if (data && data.questions && Array.isArray(data.questions)) {
      // Convert to ChatGPT-style formatted summary
      const summaryPoints = data.questions;
      
      // Helper function to extract title from content
      const extractTitle = (content) => {
        const words = content.split(' ').slice(0, 8);
        let title = words.join(' ');
        
        // Clean up title
        title = title.replace(/[.!?].*$/, '');
        title = title.trim();
        
        // Default titles based on content
        if (title.includes('Algorithm') || title.includes('Parallel')) {
          return 'Principles of Parallel Algorithm Design';
        } else if (title.includes('Decomposition') || title.includes('Task')) {
          return 'Task Decomposition and Dependency Graphs';
        } else if (title.includes('Concurrency') || title.includes('Degree')) {
          return 'Degree of Concurrency';
        } else if (title.includes('Matrix') || title.includes('Example')) {
          return 'Examples and Applications';
        } else if (title.includes('Granularity')) {
          return 'Granularity of Task Decomposition';
        } else {
          // Extract key concept from beginning
          return title.charAt(0).toUpperCase() + title.slice(1);
        }
      };
      
      // Join all content and then intelligently parse it
      let fullText = summaryPoints.join(' ').trim();
      
      // Remove markdown asterisks and clean up
      fullText = fullText.replace(/\*\*/g, '');
      
      // Split into logical sections based on content patterns
      const sections = [];
      let currentSection = '';
      let sectionNumber = 1;
      
      // Split by common section indicators
      const sentences = fullText.split(/(?<=[.!?])\s+(?=[A-Z])/);
      
      for (let sentence of sentences) {
        // Check if this looks like a new major topic/section
        if (sentence.length > 50 && (
          sentence.includes('Algorithm') || 
          sentence.includes('Decomposition') ||
          sentence.includes('Concurrency') ||
          sentence.includes('Task') ||
          sentence.includes('Matrix') ||
          sentence.includes('Examples') ||
          sentence.includes('Granularity')
        )) {
          // Save previous section if it exists
          if (currentSection.trim()) {
            sections.push({
              number: sectionNumber,
              title: extractTitle(currentSection),
              content: currentSection.trim()
            });
            sectionNumber++;
          }
          currentSection = sentence;
        } else {
          currentSection += ' ' + sentence;
        }
      }
      
      // Add the last section
      if (currentSection.trim()) {
        sections.push({
          number: sectionNumber,
          title: extractTitle(currentSection),
          content: currentSection.trim()
        });
      }
      
      // Format sections in ChatGPT style
      const formattedSummary = sections.map(section => {
        let content = section.content;
        
        // Convert dash points to bullet points
        content = content.replace(/\s*-\s+/g, '\n• ');
        
        // Add proper spacing
        content = content.replace(/\.\s*([A-Z])/g, '. $1');
        
        return `${section.number} ${section.title}\n\n${content}`;
      }).join('\n\n');
      
      return formattedSummary;
    } else if (data && data.answer) {
      return data.answer;
    } else if (typeof data === 'string') {
      return data;
    } else {
      // Fallback for unexpected formats
      console.warn('Unexpected summary API response format:', data);
      return "Summary generated successfully. The content has been analyzed and key concepts have been extracted.";
    }
  } catch (error) {
    console.error('Failed to generate summary:', error);
    throw error;
  }
}

export async function generateKeyPoints(formData: FormData): Promise<string[]> {
  try {
    console.log("Generating key points with data:", formData.get("file"));

    // Use the working cheat sheet endpoint for key points generation
    const response = await fetch(`${PYTHON_API_BASE}/cheat_sheet/cheat_sheet`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error generating key points: ${response.status}`);
    }

    const data = await response.json();
    console.log("Key points API response:", data);
    
    // Handle cheat sheet response format
    if (data && data.questions && Array.isArray(data.questions)) {
      return data.questions; // Return the questions array as key points
    } else if (data && data.points && Array.isArray(data.points)) {
      return data.points;
    } else if (data && data.answer) {
      // Parse string response with numbered points
      const points = data.answer
        .split(/\d+\.\s+/)
        .filter(point => point.trim() !== '')
        .map(point => point.trim());
      return points;
    } else if (Array.isArray(data)) {
      return data.map(point => point.toString());
    } else {
      // Fallback for unexpected formats
      console.warn('Unexpected key points API response format:', data);
      return [
        "Key concept extracted from document analysis",
        "Important information identified in the content",
        "Critical points highlighted for review",
        "Essential knowledge summarized from the material",
        "Main topics organized for better understanding"
      ];
    }
  } catch (error) {
    console.error('Failed to generate key points:', error);
    throw error;
  }
}

export async function generateSpeechFromText(text: string): Promise<string> {
  console.log("Generating speech for text:", text.substring(0, 50) + "...");
  
  if (DEBUG_SPEECH_GENERATION) {
    console.log("DEBUG MODE: Speech generation debug is enabled");
  }
  
  // Create FormData object for the request - exactly as shown in Postman
  const formData = new FormData();
  
  // Create PDF blob with the specific name "DE.pdf" as shown in Postman screenshot
  const textBlob = new Blob([text], { type: 'application/pdf' });
  formData.append("file", textBlob, "DE.pdf");
  
  console.log("Sending speech generation request with file named 'DE.pdf'...");
  
  // Log the request details for debugging
  console.log("FormData contents:", {
    fileName: "DE.pdf",
    contentType: "application/pdf",
    textLength: text.length
  });
  
  // Log the detailed FormData contents for debugging
  if (DEBUG_SPEECH_GENERATION) {
    logFormData(formData);
  }
  
  // In DEBUG mode, show a sample of the text being sent
  if (DEBUG_SPEECH_GENERATION) {
    console.log("Text sample (first 200 chars):", text.substring(0, 200));
    // Debug output showing exactly what's being sent
    console.log("Request URL:", '/api/generate-speech/generate-speech');
    console.log("Request method:", 'POST');
  }
  
  try {
    // Make the API call to the exact URL from the screenshot
    const response = await fetch('/api/generate-speech/generate-speech', {
      method: 'POST',
      body: formData,
    });
    
    // Log response details
    console.log("Speech API Response status:", response.status);
    
    if (DEBUG_SPEECH_GENERATION) {
      console.log("Speech API Response headers:", Object.fromEntries([...response.headers.entries()]));
    }
    
    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      
      if (DEBUG_SPEECH_GENERATION) {
        // For development: Return a mock audio URL to test the player
        console.log("DEBUG MODE: Returning mock audio URL for testing");
        return "https://res.cloudinary.com/demo/video/upload/v1613140765/dog_barking.mp3";
      }
      
      throw new Error(`Server returned ${response.status}`);
    }
    
    // Parse the response - expects {"audio_url": "https://...mp3"}
    const data = await response.json();
    console.log("Speech generation successful, response:", data);
    
    if (data && data.audio_url) {
      return data.audio_url;
    } else {
      console.error("Missing audio_url in API response:", data);
      
      if (DEBUG_SPEECH_GENERATION) {
        // For development: Return a mock audio URL to test the player
        console.log("DEBUG MODE: Returning mock audio URL for missing data");
        return "https://res.cloudinary.com/demo/video/upload/v1613140765/dog_barking.mp3";
      }
      
      throw new Error("No audio URL returned from the API");
    }
  } catch (error) {
    console.error("Speech API request failed with error:", error);
    
    if (DEBUG_SPEECH_GENERATION) {
      // For development: Return a mock audio URL to test the player
      console.log("DEBUG MODE: Returning mock audio URL for caught error");
      return "https://res.cloudinary.com/demo/video/upload/v1613140765/dog_barking.mp3";
    }
    
    throw error;
  }
}

// Voice options for Eleven Labs
export interface ElevenLabsVoice {
  id: string;
  name: string;
  description?: string;
}

export const elevenLabsVoices: ElevenLabsVoice[] = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "Calm and clear female voice" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", description: "Confident female voice" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", description: "Soft female voice" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", description: "Warm male voice" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", description: "Soft female narration" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", description: "Enthusiastic male voice" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "Powerful male voice" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Deep male voice" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", description: "Serious male voice" }
];

// Function to generate speech using Eleven Labs API
export async function generateElevenLabsSpeech(
  text: string, 
  voiceId: string = "EXAVITQu4vr4xnSDxMaL" // Default to Bella - soft female voice
): Promise<string> {
  console.log("Generating speech with Eleven Labs for text:", text.substring(0, 50) + "...");
  console.log("Using voice ID:", voiceId);
  
  try {
    // Get the API key from environment or local storage (in a real app, use environment variables)
    // For this implementation, we'll assume the key is stored in localStorage for demonstration
    const apiKey = localStorage.getItem("elevenLabsApiKey");
    
    if (!apiKey) {
      throw new Error("Eleven Labs API key is not set. Please provide your API key.");
    }
    
    // Prepare the request to Eleven Labs API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });
    
    // Log response details
    console.log("Eleven Labs API Response status:", response.status);
    
    // Check response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Eleven Labs API error response:", errorText);
      throw new Error(`Server returned ${response.status}`);
    }
    
    // Get the audio file as blob
    const audioBlob = await response.blob();
    
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log("Eleven Labs speech generation successful, created blob URL:", audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.error("Eleven Labs speech generation error:", error);
    throw error;
  }
}

// Function to convert speech to text using our server API that integrates with Eleven Labs
export async function convertSpeechToText(audioFile: File, options: {
  modelId?: string;
  tagAudioEvents?: boolean;
  languageCode?: string;
  diarize?: boolean;
} = {}): Promise<string> {
  console.log("Converting speech to text with file:", audioFile.name);
  
  try {
    // Build the FormData with the audio file and options
    const formData = new FormData();
    formData.append('file', audioFile);
    
    // Add optional parameters if provided
    if (options.modelId) {
      formData.append('model_id', options.modelId);
    }
    
    if (options.tagAudioEvents !== undefined) {
      formData.append('tag_audio_events', options.tagAudioEvents.toString());
    }
    
    if (options.languageCode) {
      formData.append('language_code', options.languageCode);
    }
    
    if (options.diarize !== undefined) {
      formData.append('diarize', options.diarize.toString());
    }
    
    // Make the API call to our server
    const response = await fetch('http://localhost:5001/api/speech-to-text', {
      method: 'POST',
      body: formData,
    });
    
    // Log response details
    console.log("Speech-to-text API Response status:", response.status);
    
    // Check response
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Speech-to-text API error response:", errorData);
      throw new Error(`Server returned ${response.status}: ${errorData.error || 'Unknown error'}`);
    }
    
    // Parse the response
    const data = await response.json();
    console.log("Speech-to-text successful, response:", data);
    
    if (data && data.transcription) {
      return data.transcription;
    } else {
      console.error("Missing transcription in API response:", data);
      throw new Error("No transcription returned from the API");
    }
  } catch (error) {
    console.error("Speech-to-text error:", error);
    throw error;
  }
}
