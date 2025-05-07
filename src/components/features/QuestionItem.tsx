import React, { useState } from "react";
import { GeneratedQuestion } from "@/services/questionGeneration";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  HelpCircle,
  Save,
  Download,
  Copy,
  BookOpen,
} from "lucide-react";
import { Card } from "../ui/card";
import { toast } from "@/hooks/use-toast";
import { evaluateAnswer } from "@/services/api";

// Original props
type QuestionItemPropsOriginal = {
  question: GeneratedQuestion;
  isTeacher?: boolean;
};

// New props for compatibility with GeneratedQuestionsView
export type QuestionItemProps = QuestionItemPropsOriginal | {
  number: number;
  text: string;
  type: string;
  isTeacher?: boolean;
};

const QuestionItem: React.FC<QuestionItemProps> = (props) => {
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: string;
    feedback: string;
  } | null>(null);

  // Determine if we're using the original props or the new props
  const isOriginalProps = 'question' in props;
  
  // Extract question data regardless of props format
  const questionData = isOriginalProps
    ? props.question
    : {
        id: props.number,
        question: props.text,
        questionType: props.type
      };
  
  const isTeacher = 'isTeacher' in props ? props.isTeacher : false;

  const getTypeColor = () => {
    const questionType = questionData.questionType;
    switch (questionType) {
      case "conceptual":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "numerical":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "theoretical":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "scenario":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "short-answer":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "long-answer":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      case "definition":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleAnswerStart = () => {
    setIsAnswering(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call to evaluate answer
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await evaluateAnswer({
        question: questionData.question,
        answer,
      });

      setFeedback(result);
      setIsAnswering(false);
      setIsSubmitting(false);

      toast({
        title: "Answer evaluated",
        description: `Your answer received a score of ${result.score}`,
      });
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);

      toast({
        title: "Evaluation failed",
        description:
          "There was a problem evaluating your answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsAnswering(false);
    setAnswer("");
  };

  const handleCopyQuestion = () => {
    navigator.clipboard.writeText(questionData.question);
    toast({
      title: "Copied",
      description: "Question copied to clipboard",
    });
  };

  const handleSaveQuestion = () => {
    // In a real app, this would save to a database
    toast({
      title: "Saved",
      description: "Question saved to your collection",
    });
  };

  return (
    <Card className="p-5 group hover:shadow-md transition-all border">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <span className="font-bold text-primary mr-1 mt-0.5">
                {typeof questionData.id === 'number' ? questionData.id : isOriginalProps ? props.question.id : props.number}.
              </span>
              <div className="flex-1">
                <p className="font-medium leading-relaxed text-gray-800 dark:text-gray-100">{questionData.question}</p>
                <div className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor()}`}>
                  <BookOpen className="w-3 h-3 mr-1" />
                  {questionData.questionType.charAt(0).toUpperCase() + questionData.questionType.slice(1).replace('-', ' ')}
                </div>
              </div>
            </div>
          </div>

          {isTeacher && (
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleCopyQuestion} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSaveQuestion} className="h-8 w-8 p-0">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {!isTeacher && !isAnswering && !feedback && (
          <div className="flex justify-end">
            <Button
              onClick={handleAnswerStart}
              variant="outline"
              size="sm"
              className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4 mr-2" />
              Answer Question
            </Button>
          </div>
        )}

        {!isTeacher && isAnswering && (
          <div className="space-y-3 mt-2">
            <Textarea
              placeholder="Type your answer here..."
              className="w-full min-h-[120px] focus:border-primary"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!answer.trim() || isSubmitting}
                onClick={handleSubmitAnswer}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </div>
        )}

        {!isTeacher && feedback && (
          <div className="mt-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border">
            <div className="flex items-center mb-3">
              {parseInt(feedback.score.split("/")[0]) > 7 ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : parseInt(feedback.score.split("/")[0]) > 4 ? (
                <HelpCircle className="h-5 w-5 text-amber-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="font-medium text-lg">Score: {feedback.score}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.feedback}</p>
            <div className="flex justify-end mt-3">
              <Button variant="ghost" size="sm" onClick={() => setFeedback(null)}>
                Try Again
              </Button>
            </div>
          </div>
        )}

        {isTeacher && (
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionItem;
