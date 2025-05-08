import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
    const scorePercent = typeof score === 'number' ? score : 
                         typeof score === 'string' ? parseFloat(score) : 0;
    
    return (
      <div className="mt-4 p-4 rounded-md border bg-muted">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className="font-medium">
              Score: {typeof scorePercent === 'number' ? `${Math.round(scorePercent * 100)}%` : 'N/A'}
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