
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Bell } from "lucide-react";

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer reached zero
      const message = timerType === 'focus' 
        ? `Focus time complete! Take a ${breakDuration} minute break.`
        : `Break time complete! Start a new ${focusDuration} minute focus session.`;
      
      toast({
        title: "Timer Complete",
        description: message,
      });
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed: ', e));
      
      // Switch timer type
      setTimerType(timerType === 'focus' ? 'break' : 'focus');
      setTimeLeft(timerType === 'focus' ? breakDuration * 60 : focusDuration * 60);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, timerType, focusDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerType === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFocusChange = (value: number[]) => {
    setFocusDuration(value[0]);
    if (timerType === 'focus' && !isRunning) {
      setTimeLeft(value[0] * 60);
    }
  };

  const handleBreakChange = (value: number[]) => {
    setBreakDuration(value[0]);
    if (timerType === 'break' && !isRunning) {
      setTimeLeft(value[0] * 60);
    }
  };

  // Calculate progress percentage for the circular progress
  const progress = timerType === 'focus'
    ? (timeLeft / (focusDuration * 60)) * 100
    : (timeLeft / (breakDuration * 60)) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          {timerType === 'focus' ? 'Focus Time' : 'Break Time'}
        </h2>
        <p className="text-muted-foreground">
          {timerType === 'focus' 
            ? 'Concentrate on your work' 
            : 'Take a break and relax'}
        </p>
      </div>
      
      <div className="relative w-64 h-64 mb-8">
        {/* Timer Circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-muted opacity-20"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className={timerType === 'focus' ? 'text-primary' : 'text-accent'}
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {timerType === 'focus' ? `Focus: ${focusDuration}min` : `Break: ${breakDuration}min`}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mb-8">
        <Button
          onClick={toggleTimer}
          variant={isRunning ? "outline" : "default"}
          size="lg"
          className="w-24"
        >
          {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className="w-24"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm font-medium">Focus Duration</div>
                  <div className="text-sm text-muted-foreground">{focusDuration} minutes</div>
                </div>
                <Slider
                  defaultValue={[focusDuration]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={handleFocusChange}
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm font-medium">Break Duration</div>
                  <div className="text-sm text-muted-foreground">{breakDuration} minutes</div>
                </div>
                <Slider
                  defaultValue={[breakDuration]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={handleBreakChange}
                  disabled={isRunning}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyTimer;
