import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedQuestion } from "@/services/questionGeneration";
import QuestionItem from "./QuestionItem";
import { FileQuestion, Server, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface GeneratedQuestionsProps {
  questions: GeneratedQuestion[];
  isLoading?: boolean;
  error?: string | null;
}

const GeneratedQuestions: React.FC<GeneratedQuestionsProps> = ({
  questions,
  isLoading = false,
  error = null,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Group questions by type
  const questionsByType = questions.reduce<Record<string, GeneratedQuestion[]>>(
    (acc, question) => {
      const type = question.questionType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(question);
      return acc;
    },
    {}
  );

  // Filter questions based on the active filter
  const filteredQuestions = activeFilter
    ? questions.filter(q => q.questionType === activeFilter)
    : questions;

  const copyToClipboard = () => {
    const content = filteredQuestions
      .map((q) => `${q.id}. ${q.question}`)
      .join("\n\n");
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Questions have been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const content = filteredQuestions
      .map((q) => `${q.id}. ${q.question}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `generated-questions-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    toast({
      title: "Questions downloaded",
      description: "Your questions have been downloaded as a text file.",
    });
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="flex items-center">
          <FileQuestion className="h-5 w-5 mr-2 text-primary" />
          Generated Questions
        </CardTitle>

        {questions.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Generating questions...</p>
            <p>
              We're analyzing your document and creating questions. This may
              take a moment.
            </p>
          </div>
        ) : questions.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b sticky top-0 bg-card z-10">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                All ({questions.length})
              </button>

              {Object.entries(questionsByType).map(([type, typeQuestions]) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("-", " ")}{" "}
                  ({typeQuestions.length})
                </button>
              ))}
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-5">
                {filteredQuestions.map((question) => (
                  <QuestionItem key={question.id} question={question} />
                ))}
              </div>
            </ScrollArea>
          </>
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            <Server className="h-12 w-12 mx-auto mb-4 text-red-500/50" />
            <p className="text-lg font-medium mb-2 text-red-500">Error Generating Questions</p>
            <p className="max-w-md mx-auto mb-4">
              {error}
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Server className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No Questions Generated</p>
            <p className="max-w-md mx-auto mb-4">
              We couldn't generate questions from your document. Please try
              uploading a different document or check your API connection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedQuestions;
