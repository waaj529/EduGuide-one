
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Check, Server, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface APIKeyInputProps {
  className?: string;
}

const APIKeyInput: React.FC<APIKeyInputProps> = ({ className }) => {
  const { toast } = useToast();
  const [isCheckingGemini, setIsCheckingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');

  const checkGeminiApiKey = async () => {
    setIsCheckingGemini(true);
    try {
      // Call the Supabase Edge Function to test Gemini API
      const { data, error } = await supabase.functions.invoke('generate-questions-gemini', {
        body: { text: "This is a test document to verify the API key is working." }
      });
      
      if (error || (data && data.error)) {
        setGeminiStatus('invalid');
        toast({
          title: "Gemini API Key issue detected",
          description: (data && data.error) || error?.message || "There may be an issue with your Gemini API key.",
          variant: "destructive",
        });
      } else {
        setGeminiStatus('valid');
        toast({
          title: "Gemini API Key is valid",
          description: "Your Gemini API key is working correctly.",
          variant: "default",
        });
      }
    } catch (error: any) {
      setGeminiStatus('invalid');
      toast({
        title: "Connection error",
        description: "Could not verify the Gemini API key: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setIsCheckingGemini(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="h-5 w-5 mr-2 text-green-500" />
          AI Configuration
        </CardTitle>
        <CardDescription>
          Configuration for Google Gemini AI used to generate learning materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">Gemini API Key is securely stored</span>
          </div>
          {geminiStatus === 'valid' && (
            <span className="flex items-center text-xs text-green-500">
              <Check className="h-4 w-4 mr-1" /> Valid
            </span>
          )}
          {geminiStatus === 'invalid' && (
            <span className="flex items-center text-xs text-amber-500">
              <AlertTriangle className="h-4 w-4 mr-1" /> Issues detected
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkGeminiApiKey}
            disabled={isCheckingGemini}
          >
            {isCheckingGemini ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>Test Gemini Connection</>
            )}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Gemini is Google's AI model used for generating educational questions from your uploaded documents.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyInput;
