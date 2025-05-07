
import React, { useState } from 'react';
import Flashcard from '@/components/features/Flashcard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FlashcardData {
  id: number;
  question: string;
  answer: string;
  subject: string;
}

const FlashcardPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample flashcard data
  const flashcards: FlashcardData[] = [
    {
      id: 1,
      question: "What is the law of conservation of energy?",
      answer: "Energy cannot be created or destroyed, only transformed from one form to another.",
      subject: "Physics"
    },
    {
      id: 2,
      question: "What is the formula for the area of a circle?",
      answer: "A = πr², where r is the radius of the circle.",
      subject: "Mathematics"
    },
    {
      id: 3,
      question: "What is photosynthesis?",
      answer: "The process by which green plants and certain other organisms transform light energy into chemical energy.",
      subject: "Biology"
    },
    {
      id: 4,
      question: "What are the main components of DNA?",
      answer: "DNA consists of nucleotides, each containing a phosphate group, a sugar group, and a nitrogen base (adenine, thymine, guanine, or cytosine).",
      subject: "Biology"
    },
    {
      id: 5,
      question: "Who wrote 'To Kill a Mockingbird'?",
      answer: "Harper Lee",
      subject: "Literature"
    }
  ];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flashcards</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Study with Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Flashcard 
                question={flashcards[currentIndex].question}
                answer={flashcards[currentIndex].answer}
                subject={flashcards[currentIndex].subject}
              />
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {flashcards.length}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                <span>Test yourself regularly with flashcards to improve retention</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                <span>Focus on cards you find difficult</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                <span>Review cards in different orders</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">4</span>
                <span>Explain answers out loud to reinforce learning</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardPage;
