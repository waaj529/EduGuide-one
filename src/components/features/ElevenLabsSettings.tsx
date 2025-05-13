import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Key, Save, AlertCircle, Info, Mic, Settings2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { elevenLabsVoices, ElevenLabsVoice } from '@/services/api';

interface ElevenLabsSettingsProps {
  onApiKeyChange?: (apiKey: string | null) => void;
  onVoiceChange?: (voiceId: string) => void;
}

const ElevenLabsSettings: React.FC<ElevenLabsSettingsProps> = ({ 
  onApiKeyChange,
  onVoiceChange 
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [hasStoredKey, setHasStoredKey] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("api-key");
  // Use a female voice as default (Bella)
  const [selectedVoice, setSelectedVoice] = useState<string>("EXAVITQu4vr4xnSDxMaL"); // Default to Bella - soft female voice

  // Automatically set the API key and voice on component mount
  useEffect(() => {
    // Set a dummy API key in localStorage if not already set
    const storedKey = localStorage.getItem('elevenLabsApiKey');
    if (!storedKey) {
      // This is a placeholder - in a real app, you would use an environment variable
      const dummyKey = 'your_api_key_here';
      localStorage.setItem('elevenLabsApiKey', dummyKey);
      setHasStoredKey(true);
      
      if (onApiKeyChange) {
        onApiKeyChange(dummyKey);
      }
    } else {
      setHasStoredKey(true);
    }

    // Set default voice preference if not already set
    const storedVoice = localStorage.getItem('elevenLabsVoice');
    if (!storedVoice) {
      localStorage.setItem('elevenLabsVoice', selectedVoice);
      
      if (onVoiceChange) {
        onVoiceChange(selectedVoice);
      }
    } else {
      setSelectedVoice(storedVoice);
      
      if (onVoiceChange) {
        onVoiceChange(storedVoice);
      }
    }
  }, []);

  // Return null as we don't want to render any UI
  return null;
};

export default ElevenLabsSettings; 