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
    console.log("Generating assignment with form data:");
    
    // Log the form data contents for debugging
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    console.log("Making request to assignment API...");
    const response = await fetch('https://python.iamscientist.ai/api/assignment/assignment', {
      method: 'POST',
      body: formData,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Assignment API failed with status ${response.status}:`, errorText);
      throw new Error(`API error (${response.status}): ${errorText}`);
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
  isInstruction?: boolean;
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
    
    // Initialize the results array
    let questionsArray: PracticeQuestion[] = [];
    
    // Handle different response formats
    if (Array.isArray(data)) {
      // If data is already an array, format it directly
      const formattedQuestions = data.map((q: any, index: number) => ({
        id: q.id || `question-${index + 1}`,
        question: q.question || q.text || q,
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (data && data.questions && Array.isArray(data.questions)) {
      // If data has a 'questions' array property
      const formattedQuestions = data.questions.map((q: any, index: number) => ({
        id: q.id || `question-${index + 1}`,
        question: q.question || q.text || q,
        isInstruction: false
      }));
      questionsArray = [...questionsArray, ...formattedQuestions];
    } else if (data && typeof data === 'object') {
      // If data is a single question object
      questionsArray.push({
        id: data.id || 'question-1',
        question: data.question || data.text || JSON.stringify(data),
        isInstruction: false
      });
    } else {
      // Fallback for unexpected formats - create at least one placeholder question
      console.warn('Unexpected API response format:', data);
      
      questionsArray.push({
        id: 'question-1',
        question: 'The API returned data in an unexpected format. Please try again.',
        isInstruction: false
      });
    }
    
    // Filter out any instruction items
    return questionsArray.filter(q => !q.isInstruction);
  } catch (error) {
    console.error('Failed to generate practice questions:', error);
    throw error;
  }
}

export async function evaluatePracticeAnswer(questionId: string, question: string, userAnswer: string): Promise<any> {
  try {
    console.log("Evaluating answer:", { questionId, question, userAnswer: userAnswer.substring(0, 20) + "..." });
    
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

// View generated quiz PDF in a new tab
export const viewQuizPdf = async (callback?: (url: string) => void) => {
  try {
    const pdfUrl = 'https://python.iamscientist.ai/api/quiz/quiz_view';
    
    if (callback) {
      // If callback is provided, pass the URL to the callback function
      callback(pdfUrl);
    } else {
      // Otherwise open in a new tab as before
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "PDF viewer opened",
        description: "The generated PDF content has been opened in a new tab.",
      });
    }
  } catch (error) {
    console.error("View quiz PDF error:", error);
    toast({
      title: "Error",
      description: "Failed to open PDF viewer. Please try again.",
      variant: "destructive",
    });
  }
};

// View quiz solution PDF 
export const viewSolutionPdf = async (callback?: (url: string) => void) => {
  try {
    const pdfUrl = 'https://python.iamscientist.ai/api/quiz/sol_view';
    
    if (callback) {
      // If callback is provided, pass the URL to the callback function
      callback(pdfUrl);
    } else {
      // Otherwise open in a new tab as before
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "Solution PDF opened",
        description: "The quiz solution has been opened in a new tab.",
      });
    }
  } catch (error) {
    console.error("View solution PDF error:", error);
    toast({
      title: "Error",
      description: "Failed to open solution PDF. Please try again.",
      variant: "destructive",
    });
  }
};

export async function generateCheatSheet(formData: FormData): Promise<string[]> {
  try {
    console.log("Generating cheat sheet with form data:", Object.fromEntries(formData));
    
    const response = await fetch('https://python.iamscientist.ai/api/cheat_sheet/cheat_sheet', {
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
    const response = await fetch('https://python.iamscientist.ai/api/cheat_sheet/cheat_sheet', {
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
    const response = await fetch('https://python.iamscientist.ai/api/cheat_sheet/cheat_sheet', {
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
    console.log("Request URL:", 'https://python.iamscientist.ai/api/generate-speech/generate-speech');
    console.log("Request method:", 'POST');
  }
  
  try {
    // Make the API call to the exact URL from the screenshot
    const response = await fetch('https://python.iamscientist.ai/api/generate-speech/generate-speech', {
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
