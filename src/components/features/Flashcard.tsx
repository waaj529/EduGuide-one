
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FlashcardProps {
  question: string;
  answer: string;
  subject: string;
}

const Flashcard = ({ question, answer, subject }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-full max-w-md h-64 sm:h-80 cursor-pointer perspective relative"
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front side (Question) */}
        <Card className="absolute w-full h-full backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
          <CardContent className="flex flex-col justify-between h-full p-6">
            <div className="text-xs font-medium text-muted-foreground">{subject}</div>
            <div className="text-center my-auto">
              <p className="text-xl font-medium">{question}</p>
            </div>
            <div className="text-xs text-muted-foreground text-center">Click to flip</div>
          </CardContent>
        </Card>

        {/* Back side (Answer) */}
        <Card 
          className="absolute w-full h-full backface-hidden" 
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardContent className="flex flex-col justify-between h-full p-6">
            <div className="text-xs font-medium text-muted-foreground">{subject}</div>
            <div className="text-center my-auto">
              <p className="text-lg">{answer}</p>
            </div>
            <div className="text-xs text-muted-foreground text-center">Click to flip back</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Flashcard;
