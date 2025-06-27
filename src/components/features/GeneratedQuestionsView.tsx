import React from "react";
import { Button } from "@/components/ui/button";
import QuestionItem from "./QuestionItem";
import { downloadAssignment, downloadQuiz, downloadQuizSolution, viewQuizSolutionPdf } from "@/services/api";
import { BookOpen, Download } from "lucide-react";

interface GeneratedQuestionsViewProps {
  title: string;
  type: "quiz" | "assignment" | "exam";
  questions: Array<{
    id?: number;
    question: string;
    questionType?: string;
  }>;
}

const GeneratedQuestionsView: React.FC<GeneratedQuestionsViewProps> = ({
  title,
  type,
  questions,
}) => {
  const downloadContent = async () => {
    try {
      // Create a FormData object with minimal required data
      const formData = new FormData();
      
      if (type === "quiz") {
        await downloadQuiz(formData);
      } else if (type === "assignment") {
        await downloadAssignment(formData);
      }
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">
          {questions.length > 1 
            ? `Answer the following ${questions.length} questions based on the material.`
            : "Answer the following question based on the material."}
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => (
          <QuestionItem
            key={item.id || index}
            number={index + 1}
            text={item.question}
            type={item.questionType || "conceptual"}
          />
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button onClick={downloadContent} className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-download"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Download {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </div>
    </div>
  );
};

export default GeneratedQuestionsView;
