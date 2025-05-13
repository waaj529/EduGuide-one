import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mic, MicOff, Square, Upload, RotateCw, Copy, CheckCircle2, FileAudio, Settings2, X } from 'lucide-react';
import { convertSpeechToText } from '@/services/api';
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
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ElevenLabsSettings from './ElevenLabsSettings';

interface SpeechToTextProps {
  onTranscriptionComplete?: (text: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscriptionComplete }) => {
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Advanced settings
  const [language, setLanguage] = useState<string>('eng');
  const [tagAudioEvents, setTagAudioEvents] = useState<boolean>(true);
  const [diarize, setDiarize] = useState<boolean>(true);
  
  // Recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  // Clean up audio URLs when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Format recording time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      // Reset state
      setRecordingTime(0);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Combine audio chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set state
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Create a File object from the Blob
        const fileName = `recording-${new Date().toISOString()}.wav`;
        const audioFile = new File([audioBlob], fileName, { type: 'audio/wav' });
        
        // Set as selected file
        setSelectedFile(audioFile);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      
      let errorMessage = "Could not access your microphone. Please check permissions.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Recording failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: `Recorded ${formatTime(recordingTime)} of audio.`,
      });
    }
  };
  
  // Handle microphone button click
  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if file is an audio file
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an audio file smaller than 25MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      toast({
        title: "File selected",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      });
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle transcription
  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to transcribe",
        variant: "destructive",
      });
      return;
    }
    
    // Check if Eleven Labs API key is configured but don't notify the user
    const elevenLabsKey = localStorage.getItem('elevenLabsApiKey');
    if (!elevenLabsKey) {
      // Set a default API key in localStorage
      localStorage.setItem('elevenLabsApiKey', 'your_api_key_here');
    }
    
    setIsTranscribing(true);
    
    try {
      toast({
        title: "Transcribing",
        description: "Converting your audio to text. This might take a moment...",
      });
      
      // Call the API with selected file and options
      const result = await convertSpeechToText(selectedFile, {
        languageCode: language,
        tagAudioEvents: tagAudioEvents,
        diarize: diarize,
      });
      
      // Set the transcription
      setTranscription(result);
      
      // Notify the parent component if callback is provided
      if (onTranscriptionComplete) {
        onTranscriptionComplete(result);
      }
      
      toast({
        title: "Transcription complete",
        description: "Your audio has been successfully transcribed!",
      });
    } catch (error) {
      console.error("Transcription error:", error);
      
      let errorMessage = "Failed to transcribe audio. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Transcription failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };
  
  // Copy transcription to clipboard
  const copyTranscription = () => {
    if (!transcription) return;
    
    navigator.clipboard.writeText(transcription)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Transcription has been copied to your clipboard",
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Speech to Text
          </CardTitle>
          <div className="flex gap-2">
            {/* Keep ElevenLabsSettings component hidden but functional */}
            <div style={{ display: 'none' }}>
              <ElevenLabsSettings />
            </div>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Transcription Settings">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Transcription Settings</DialogTitle>
                  <DialogDescription>
                    Configure options for speech-to-text transcription
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="language" className="text-right">
                      Language
                    </Label>
                    <Select
                      value={language}
                      onValueChange={setLanguage}
                    >
                      <SelectTrigger id="language" className="col-span-3">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eng">English</SelectItem>
                        <SelectItem value="fre">French</SelectItem>
                        <SelectItem value="ger">German</SelectItem>
                        <SelectItem value="spa">Spanish</SelectItem>
                        <SelectItem value="ita">Italian</SelectItem>
                        <SelectItem value="jpn">Japanese</SelectItem>
                        <SelectItem value="kor">Korean</SelectItem>
                        <SelectItem value="chi">Chinese</SelectItem>
                        <SelectItem value="por">Portuguese</SelectItem>
                        <SelectItem value="rus">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tag-events" className="text-right">
                      Tag Audio Events
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch 
                        id="tag-events" 
                        checked={tagAudioEvents}
                        onCheckedChange={setTagAudioEvents}
                      />
                      <span className="text-sm text-muted-foreground">
                        Identify laughter, applause, etc.
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diarize" className="text-right">
                      Speaker Diarization
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch 
                        id="diarize" 
                        checked={diarize}
                        onCheckedChange={setDiarize}
                      />
                      <span className="text-sm text-muted-foreground">
                        Identify and label different speakers
                      </span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Save Changes</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>
          Convert your audio recordings to text
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Microphone Recording Button */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center">
            <Button 
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className={`rounded-full h-16 w-16 p-0 ${isRecording ? 'animate-pulse' : ''}`}
              onClick={handleMicrophoneClick}
              disabled={isTranscribing}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            <span className="mt-2 text-sm font-medium">
              {isRecording ? (
                `Recording: ${formatTime(recordingTime)}`
              ) : (
                "Tap to Record"
              )}
            </span>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mb-4">
          or
        </div>
        
        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 relative">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          
          {!selectedFile ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <FileAudio className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">MP3, WAV, M4A (max 25MB)</p>
              </div>
              <Button onClick={triggerFileUpload} variant="secondary" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select Audio File
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between bg-muted p-3 rounded-md mb-4">
                <div className="flex items-center gap-3">
                  <FileAudio className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearSelectedFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleTranscribe}
                disabled={isTranscribing}
              >
                {isTranscribing ? (
                  <>
                    <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Transcribe Audio
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Audio Playback (for recorded audio) */}
        {audioUrl && (
          <div className="mt-4 border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Preview Recording</h4>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
        
        {/* Transcription Output */}
        {transcription && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="transcription">Transcription Result</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyTranscription}
                className="h-8 gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </Button>
            </div>
            <Textarea
              id="transcription"
              value={transcription}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechToText; 