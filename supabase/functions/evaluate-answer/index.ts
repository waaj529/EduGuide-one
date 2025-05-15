
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variables
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Parse request body
    const { question, answer } = await req.json();
    if (!question || !answer) {
      throw new Error('Question and answer are required');
    }

    console.log('Evaluating answer for question:', question);

    // If no API key or if answer is too short, use fallback evaluation
    if (!openAIApiKey || answer.trim().length < 5) {
      console.log('Using fallback evaluation (no API key or answer too short)');
      return new Response(JSON.stringify(generateFallbackEvaluation(question, answer)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const prompt = `
As an expert educator, evaluate the following answer to the given question. 
Provide a score out of 10 and detailed feedback to help the student improve.

Question: ${question}

Student's Answer: ${answer}

Provide your response in the format:
Score: X/10
Feedback: Your detailed feedback here
`;

    try {
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
              content: 'You are an expert educator who evaluates student answers.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          temperature: 0.3,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        return new Response(JSON.stringify(generateFallbackEvaluation(question, answer)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      // Parse the response
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Extract score and feedback using regex
      const scoreMatch = content.match(/Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const score = scoreMatch ? scoreMatch[1] : "5";
      
      const feedbackMatch = content.match(/Feedback:\s*([\s\S]*)/i);
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : content;
      
      // Return the evaluation
      return new Response(JSON.stringify({ score, feedback }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return new Response(JSON.stringify(generateFallbackEvaluation(question, answer)), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error in evaluate-answer function:', error);
    return new Response(JSON.stringify({ 
      score: "N/A", 
      feedback: "There was an error evaluating your answer. Please try again later." 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate a fallback evaluation when OpenAI API is unavailable
function generateFallbackEvaluation(question: string, answer: string) {
  const answerLength = answer.trim().length;
  
  // Very simple scoring based on answer length
  let score = "5";
  let feedback = "This is an automated evaluation as our AI evaluation system is currently unavailable.";
  
  if (answerLength < 10) {
    score = "3";
    feedback += " Your answer is very brief. Consider providing more details and examples to demonstrate your understanding.";
  } else if (answerLength < 50) {
    score = "5";
    feedback += " Your answer provides basic information but could benefit from more depth and specific examples.";
  } else if (answerLength < 100) {
    score = "7";
    feedback += " You've provided a good answer with some detail. To improve further, consider adding more specific examples or theoretical context.";
  } else {
    score = "8";
    feedback += " You've provided a comprehensive answer with good detail. Keep up the good work!";
  }
  
  return { score, feedback };
}
