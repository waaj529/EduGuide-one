
import React from 'react';
import StudyTimer from '@/components/features/StudyTimer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudyTimerPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Study Timer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Focus Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyTimer />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
            </p>
            
            <h3 className="font-medium text-lg mt-4">How it works:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                <span>Work for 25 minutes (one "Pomodoro")</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                <span>Take a 5-minute break</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                <span>After 4 Pomodoros, take a longer 15-30 minute break</span>
              </li>
            </ul>
            
            <h3 className="font-medium text-lg mt-4">Benefits:</h3>
            <ul className="space-y-2">
              <li>• Improves focus and concentration</li>
              <li>• Reduces mental fatigue</li>
              <li>• Increases productivity</li>
              <li>• Creates a better work/break balance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyTimerPage;
