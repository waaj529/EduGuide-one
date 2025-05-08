import { toast } from "@/components/ui/use-toast";
import { API_COMMON } from "@/utils/ApiCommon";
// Base API URL
const API_URL = "http://127.0.0.1:5000/api";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Simulate network delay for development
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    console.log(
      "Generating assignment with data:",
      Object.fromEntries(formData)
    );

    const response = await fetch('https://python.iamscientist.ai/api/assignment/assignment', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Assignment API response:", responseData);
    
    const requestedQuestionCount = parseInt(formData.get("number_of_questions") as string) || 10;
    const numConceptual = parseInt(formData.get("num_conceptual") as string) || 0;
    const numTheoretical = parseInt(formData.get("num_theoretical") as string) || 0;
    const numScenario = parseInt(formData.get("num_scenario") as string) || 0;
    
    console.log("User requested params:", {
      totalQuestions: requestedQuestionCount,
      conceptual: numConceptual,
      theoretical: numTheoretical,
      scenario: numScenario
    });
    
    const questions = [];
    
    let apiQuestions = [];
    if (responseData && responseData.questions && Array.isArray(responseData.questions)) {
      apiQuestions = responseData.questions;
    } else if (responseData && responseData.answer) {
      apiQuestions = responseData.answer
        .split(/\d+\.\s+/)
        .filter(q => q.trim() !== '')
        .map(q => q.trim());
    }
    
    apiQuestions = apiQuestions.slice(0, requestedQuestionCount);
    
    let questionCounter = 1;
    let conceptualCount = 0;
    let theoreticalCount = 0;
    let scenarioCount = 0;
    
    apiQuestions.forEach((question, index) => {
      let questionType = "conceptual";
      
      if (conceptualCount < numConceptual) {
        questionType = "conceptual";
        conceptualCount++;
      } else if (theoreticalCount < numTheoretical) {
        questionType = "theoretical";
        theoreticalCount++;
      } else if (scenarioCount < numScenario) {
        questionType = "scenario";
        scenarioCount++;
      } else {
        questionType = index % 3 === 0 ? "conceptual" : 
                       index % 3 === 1 ? "theoretical" : "scenario";
      }
      
      questions.push({
        id: questionCounter++,
        question: question,
        questionType: questionType
      });
    });
    
    if (questions.length === 0) {
      questions.push({
        id: 1,
        question: "Assignment Successfully Generated",
        questionType: "conceptual"
      });
    }
    
    return questions;
  } catch (error) {
    console.error("Generate assignment error:", error);
    toast({
      title: "Error",
      description: "Failed to generate assignment. Please try again.",
      variant: "destructive",
    });
    throw new Error("Failed to generate assignment");
  }
};

// Generate quiz from the API
export const generateQuiz = async (formData: FormData) => {
  try {
    console.log("Generating quiz with form data:", Object.fromEntries(formData.entries()));
    
    // Ensure all numeric fields have valid values
    const requestedQuestionCount = parseInt(formData.get("number_of_questions") as string) || 10;
    const numConceptual = parseInt(formData.get("num_conceptual") as string) || 3;
    const numTheoretical = parseInt(formData.get("num_theoretical") as string) || 4;
    const numScenario = parseInt(formData.get("num_scenario") as string) || 3;
    
    // Create a new FormData with validated numeric values
    const validatedFormData = new FormData();
    
    // Copy file
    if (formData.get("file")) {
      validatedFormData.append("file", formData.get("file") as File);
    }
    
    // Add validated numeric fields with proper string values
    validatedFormData.append("number_of_questions", requestedQuestionCount.toString());
    validatedFormData.append("num_conceptual", numConceptual.toString());
    validatedFormData.append("num_theoretical", numTheoretical.toString());
    validatedFormData.append("num_scenario", numScenario.toString());
    
    // Copy remaining fields
    for (const [key, value] of formData.entries()) {
      if (!["file", "number_of_questions", "num_conceptual", "num_theoretical", "num_scenario"].includes(key)) {
        validatedFormData.append(key, value);
      }
    }
    
    console.log("User requested quiz params:", {
      totalQuestions: requestedQuestionCount,
      conceptual: numConceptual,
      theoretical: numTheoretical,
      scenario: numScenario
    });
    
    // Create a log of what we're sending to the API for debugging
    const fileDetails = formData.get("file") ? {
      fileName: (formData.get("file") as File).name,
      fileSize: (formData.get("file") as File).size,
      fileType: (formData.get("file") as File).type
    } : "No file provided";
    console.log("Sending to quiz API:", fileDetails);
    
    // Make the API call to ONLY the specified endpoint
    const response = await fetch('https://python.iamscientist.ai/api/quiz/quiz', {
      method: 'POST',
      body: validatedFormData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Quiz API failed with status ${response.status}:`, errorText);
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
      console.log(`Successfully generated ${questions.length} quiz questions from API`);
      toast({
        title: "Quiz Generated",
        description: `Successfully created ${questions.length} questions from your document`,
      });
      
      // Distribute questions by type according to user specifications
      let questionCounter = 1;
      let conceptualCount = 0;
      let theoreticalCount = 0;
      let scenarioCount = 0;
      
      const typedQuestions = questions.map((question, index) => {
        let questionType = "conceptual";
        
        if (conceptualCount < numConceptual) {
          questionType = "conceptual";
          conceptualCount++;
        } else if (theoreticalCount < numTheoretical) {
          questionType = "theoretical";
          theoreticalCount++;
        } else if (scenarioCount < numScenario) {
          questionType = "scenario";
          scenarioCount++;
        } else {
          questionType = index % 3 === 0 ? "conceptual" : 
                        index % 3 === 1 ? "theoretical" : "scenario";
        }
        
        return {
          id: questionCounter++,
          question: question.question || question,
          questionType: questionType
        };
      });
      
      return typedQuestions.slice(0, requestedQuestionCount);
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

// Download generated quiz from the API
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
    
    // Only use GET method since the server doesn't accept POST for this endpoint
    const response = await fetch(`https://python.iamscientist.ai/api/quiz/quiz_download?${params.toString()}`, {
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
// Download generated assignment from the API
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
    
    // Only use GET method since the server doesn't accept POST for this endpoint
    const response = await fetch(`https://python.iamscientist.ai/api/assignment/assignment_download?${params.toString()}`, {
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

export interface PracticeQuestion {
  id: string;
  question: string;
  userAnswer?: string;
  evaluation?: {
    score: number;
    feedback: string;
    isCorrect: boolean;
  };
}

export async function generatePracticeQuestions(formData: FormData): Promise<PracticeQuestion[]> {
  try {
    const response = await fetch('https://python.iamscientist.ai/api/exam/exam_generate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error generating questions: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      // If data is already an array, format it directly
      return data.map((q: any, index: number) => ({
        id: q.id || `question-${index + 1}`,
        question: q.question || q.text || q,
      }));
    } else if (data && data.questions && Array.isArray(data.questions)) {
      // If data has a 'questions' array property
      return data.questions.map((q: any, index: number) => ({
        id: q.id || `question-${index + 1}`,
        question: q.question || q.text || q,
      }));
    } else if (data && typeof data === 'object') {
      // If data is a single question object
      return [{
        id: data.id || 'question-1',
        question: data.question || data.text || JSON.stringify(data),
      }];
    } else {
      // Fallback for unexpected formats - create at least one placeholder question
      console.warn('Unexpected API response format:', data);
      return [{
        id: 'question-1',
        question: 'The API returned data in an unexpected format. Please try again.',
      }];
    }
  } catch (error) {
    console.error('Failed to generate practice questions:', error);
    throw error;
  }
}

export async function evaluatePracticeAnswer(questionId: string, question: string, userAnswer: string): Promise<any> {
  try {
    const response = await fetch('https://python.iamscientist.ai/api/exam/evaluate_answer', {
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

    return await response.json();
  } catch (error) {
    console.error('Failed to evaluate answer:', error);
    throw error;
  }
}
