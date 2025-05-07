
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
    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.log('OpenAI API key not found, using fallback questions');
      return new Response(JSON.stringify({ questions: generateFallbackQuestions() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Parse request body
    const { text } = await req.json();
    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Generating questions from text:', text.substring(0, 100) + '...');

    try {
      // Create prompt for OpenAI
      const prompt = `
You are an expert educator. Based on the following document content, generate 10 high-quality learning questions that would help students understand and retain the material.

Include a variety of question types:
- Conceptual questions that test understanding of key concepts
- Numerical questions if the content has quantitative information
- Definition questions for important terms
- Short-answer questions for recalling facts
- Long-answer questions for deeper analysis

Format each question on a new line with no numbering or prefixes.

Document content:
${text}
`;

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator who specializes in creating learning questions from documents.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        // If API request failed, return fallback questions
        console.log('Using fallback questions due to API error');
        return new Response(JSON.stringify({ questions: generateFallbackQuestions() }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      // Parse the response
      const data = await response.json();
      const content = data.choices[0].message.content;
      const questionStrings = content.split('\n').filter(line => line.trim().length > 0);
      
      // Determine question type for each question
      const questions: GeneratedQuestion[] = questionStrings.map((question, index) => ({
        id: `oai-q-${index}`,
        question: question,
        questionType: determineQuestionType(question)
      }));

      // Return the generated questions
      return new Response(JSON.stringify({ questions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      console.log('Using fallback questions due to API error');
      return new Response(JSON.stringify({ questions: generateFallbackQuestions() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in generate-questions function:', error);
    // Even with errors, provide fallback questions instead of error
    return new Response(JSON.stringify({ questions: generateFallbackQuestions() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
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

// Fallback questions generator for when OpenAI API is unavailable
function generateFallbackQuestions(): GeneratedQuestion[] {
  const fallbackQuestions = [
    "What are the key components of an AI model training pipeline?",
    "Define transfer learning and explain its advantages.",
    "How does model fine-tuning differ from training a model from scratch?",
    "Explain the concept of hyperparameter optimization.",
    "What metrics would you use to evaluate the performance of a classification model?",
    "Describe the process of data preprocessing for machine learning models.",
    "Compare and contrast supervised and unsupervised learning approaches.",
    "What are the ethical considerations when deploying AI models?",
    "Calculate the precision and recall for a model with 90 true positives, 10 false positives, and 20 false negatives.",
    "Explain how to address bias in AI model training."
  ];
  
  return fallbackQuestions.map((question, index) => ({
    id: `fallback-q-${index}`,
    question,
    questionType: determineQuestionType(question)
  }));
}
