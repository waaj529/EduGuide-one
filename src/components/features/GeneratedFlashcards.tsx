
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileType, Download } from 'lucide-react';
import Flashcard from "@/components/features/Flashcard";
import { toast } from "@/hooks/use-toast";

interface GeneratedFlashcardsProps {
  flashcards: { question: string; answer: string; subject: string }[];
  isLoading?: boolean;
}

const GeneratedFlashcards: React.FC<GeneratedFlashcardsProps> = ({ 
  flashcards,
  isLoading = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
  };

  const downloadFlashcards = () => {
    const content = flashcards.map(card => 
      `Question: ${card.question}\nAnswer: ${card.answer}\nSubject: ${card.subject}\n\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `flashcards-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Flashcards downloaded",
      description: "Your flashcards have been downloaded as a text file.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <FileType className="h-5 w-5 mr-2" />
          Generated Flashcards
        </CardTitle>
        
        {flashcards.length > 0 && (
          <Button variant="outline" size="sm" onClick={downloadFlashcards}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Generating flashcards...</p>
            <p>We're creating flashcards based on your document. This may take a moment.</p>
          </div>
        ) : flashcards.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Flashcard 
                question={flashcards[currentIndex].question} 
                answer={flashcards[currentIndex].answer} 
                subject={flashcards[currentIndex].subject} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileType className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No Flashcards Generated</p>
            <p className="max-w-md mx-auto">
              Upload a document and click "Generate Learning Materials" to create flashcards from your content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedFlashcards;
