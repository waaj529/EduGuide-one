
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for question types
interface GeneratedQuestion {
  id: string;
  question: string;
  questionType: 'conceptual' | 'numerical' | 'short-answer' | 'long-answer' | 'definition';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Gemini API key from environment variables
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.log('Gemini API key not found');
      return new Response(JSON.stringify({ error: 'Gemini API key not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Parse request body
    const { text } = await req.json();
    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Generating questions with Gemini from text. Text length:', text.length);
    console.log('First 100 chars of text:', text.substring(0, 100));

    if (text.length < 50) {
      console.log('WARNING: Very short text provided to Gemini, might not generate good questions');
      return new Response(JSON.stringify({ error: 'Insufficient text content to generate questions' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Determine if this is likely a CV/resume
    const isResume = text.toLowerCase().includes('resume') || 
                    text.toLowerCase().includes('cv') || 
                    text.toLowerCase().includes('work experience') || 
                    text.toLowerCase().includes('education') ||
                    text.toLowerCase().includes('skills') ||
                    text.toLowerCase().includes('qualification');

    // Create prompt for Gemini based on document type
    let prompt;
    
    if (isResume) {
      prompt = `
Based on the following document content (which appears to be a CV/resume), generate 10 high-quality learning questions that would help understand the person's background, skills, and experiences. Make sure to reference actual details from the document content in your questions.

Include a variety of question types:
- Conceptual questions about their experience and skills
- Questions about their education and qualifications
- Questions about their professional achievements
- Questions about their technical skills and competencies
- Questions about their roles and responsibilities

Format each question on a new line with no numbering or prefixes. Make sure the questions are specific to the content in the document, not generic questions or placeholders.

Document content:
${text}
`;
    } else {
      prompt = `
Based on the following document content, generate 10 high-quality learning questions that would help understand the key concepts and information presented. Make sure to reference actual details from the document content in your questions.

Include a variety of question types:
- Conceptual questions about key ideas and concepts in the document
- Numerical questions if there are numbers, statistics, or calculations in the document
- Definition questions for important terms in the document
- Short answer questions that can be answered briefly using facts from the document
- Long answer questions that require deeper analysis of the document content

Format each question on a new line with no numbering or prefixes. Make sure the questions are specific to the content in the document, not generic questions or placeholders.

Document content:
${text}
`;
    }

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to generate questions with Gemini' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Parse the response
    const data = await response.json();
    
    // Check if we have a valid response with content
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid response structure from Gemini:', data);
      return new Response(JSON.stringify({ error: 'Invalid response from Gemini API' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    const content = data.candidates[0].content.parts[0].text;
    console.log('Generated content from Gemini:', content.substring(0, 200) + '...');
    
    const questionStrings = content.split('\n').filter(line => line.trim().length > 0);
    
    // Log how many questions were found
    console.log(`Extracted ${questionStrings.length} questions from Gemini response`);
    
    // Clean up questions (remove numbering if present)
    const cleanedQuestions = questionStrings.map(q => {
      // Remove numbering if it exists (like "1. " or "1) ")
      const cleaned = q.replace(/^\d+[\.\)]\s+/, '');
      return cleaned;
    });

    // Determine question type for each question
    const questions: GeneratedQuestion[] = cleanedQuestions.map((question, index) => ({
      id: `gemini-q-${index}`,
      question: question,
      questionType: determineQuestionType(question)
    }));

    // Return the generated questions
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in generate-questions-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Helper function to determine question type based on content
function determineQuestionType(question: string): 'conceptual' | 'numerical' | 'short-answer' | 'long-answer' | 'definition' {
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
