import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { PracticeQuestion } from '@/services/api';
import { toast } from "@/hooks/use-toast";

interface PracticeQuestionItemProps {
  question: PracticeQuestion;
  onAnswerSubmit: (questionId: string, question: string, answer: string) => Promise<void>;
}

const PracticeQuestionItem: React.FC<PracticeQuestionItemProps> = ({ 
  question, 
  onAnswerSubmit 
}) => {
  const [userAnswer, setUserAnswer] = useState(question.userAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If this is an instruction item, render a special notification style
  if (question.isInstruction) {
    return (
      <Card className="mb-6 overflow-hidden border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <CardContent className="py-3">
          <div className="flex items-center space-x-3">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <p className="text-blue-600 dark:text-blue-300 text-sm">
              {question.question}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please provide an answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAnswerSubmit(question.id, question.question, userAnswer);
      toast({
        title: "Answer submitted",
        description: "Your answer has been evaluated",
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Submission failed",
        description: "Failed to evaluate your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEvaluation = () => {
    if (!question.evaluation) return null;
    
    const { score, feedback, isCorrect } = question.evaluation;
    
    // Handle different score formats (normalized or not)
    // If score is between 0-1, it's normalized; if > 1, it's the raw score
    const scoreValue = typeof score === 'number' 
      ? (score <= 1 ? score : score / 10) // Normalize any value > 1 assuming it's out of 10
      : typeof score === 'string' 
        ? parseFloat(score) / (parseFloat(score) > 1 ? 10 : 1) 
        : 0;
    
    // Format as percentage for display
    const scorePercent = Math.round(scoreValue * 100);
    
    return (
      <div className="mt-4 p-4 rounded-md border bg-muted">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isCorrect || scoreValue >= 0.7 ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className="font-medium">
              Score: {scorePercent}%
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{feedback}</p>
      </div>
    );
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{question.question}</h3>
          </div>
          
          <div>
            <Textarea 
              placeholder="Type your answer here..." 
              className="min-h-[100px]"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={!!question.evaluation}
            />
          </div>
          
          {renderEvaluation()}
        </div>
      </CardContent>
      
      <CardFooter className={question.evaluation ? "text-right" : "justify-end"}>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !!question.evaluation}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Evaluating...
            </>
          ) : question.evaluation ? (
            'Evaluated'
          ) : (
            'Submit Answer'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PracticeQuestionItem;