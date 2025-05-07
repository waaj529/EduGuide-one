import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, Send, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { openaiService } from "@/services/openaiService";
import { evaluateAnswer } from "@/services/api";

const QuestionAnswerInput = () => {
  const [answer, setAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: string;
    feedback: string;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "Answer file uploaded",
        description: `${e.target.files[0].name} is ready for submission.`,
      });
    }
  };

  const submitAnswer = async () => {
    console.log("Nigggggger");

    if (!selectedQuestion) {
      toast({
        title: "No question selected",
        description: "Please select a question to answer first.",
        variant: "destructive",
      });
      return;
    }

    if (!answer && !file) {
      toast({
        title: "No answer provided",
        description: "Please write an answer or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      if (answer) {
        // Evaluate text answer
        // const result = await openaiService.evaluateAnswer(selectedQuestion, answer);
        console.log("Niveeeeee  ");
        const result = await evaluateAnswer({
          question: selectedQuestion,
          answer,
        });
        setFeedback(result);
      } else if (file) {
        // For file uploads, provide a placeholder response
        // In a real app, you would process the file and extract text
        setFeedback({
          score: "Not Evaluated",
          feedback:
            "File submission received. In a real application, we would process your file to extract and evaluate your answer.",
        });
      }

      toast({
        title: "Answer evaluated",
        description: "Your answer has been evaluated.",
      });
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast({
        title: "Evaluation failed",
        description: "Failed to evaluate your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="h-5 w-5 mr-2" />
          Submit Your Answer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedQuestion ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <p className="text-muted-foreground">
              Select a question from the list on the left to answer it
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-1">Selected Question:</h3>
              <p>{selectedQuestion}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Your Answer:</h3>
              <Textarea
                placeholder="Type your answer here..."
                className="min-h-[150px]"
                value={answer}
                onChange={handleAnswerChange}
                disabled={isEvaluating || !!file}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Or upload a file with your answer
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                disabled={isEvaluating || !!answer}
              >
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Answer
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={isEvaluating || !!answer}
                  />
                </label>
              </Button>
            </div>

            {file && (
              <div className="p-3 bg-muted rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  onClick={() => setFile(null)}
                  variant="ghost"
                  size="sm"
                  disabled={isEvaluating}
                >
                  Remove
                </Button>
              </div>
            )}
          </>
        )}

        {feedback && (
          <div
            className={`p-4 rounded-md ${
              feedback.score.includes("Not")
                ? "bg-amber-50 dark:bg-amber-950/20"
                : Number(feedback.score.replace(/\D/g, "")) > 70
                ? "bg-green-50 dark:bg-green-950/20"
                : "bg-red-50 dark:bg-red-950/20"
            }`}
          >
            <div className="flex items-start">
              {Number(feedback.score.replace(/\D/g, "")) > 70 ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-medium">Evaluation Result</h3>
                <div className="text-sm mt-1">
                  <p>
                    <strong>Score:</strong> {feedback.score}
                  </p>
                  <p className="mt-2">
                    <strong>Feedback:</strong> {feedback.feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={submitAnswer}
          disabled={(!answer && !file) || !selectedQuestion || isEvaluating}
        >
          {isEvaluating ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
              Evaluating...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Answer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionAnswerInput;
