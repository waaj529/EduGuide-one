import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, FileText, CheckCircle2, Star, BookOpen, ListChecks, 
  CircleCheck, ArrowRight, GraduationCap, PenTool, BookmarkCheck,
  Circle, ChevronRight, BookMarked, CircleDot, Volume2,
  Play, Pause, RotateCw, VolumeX, SkipBack, Settings, Volume1
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { generateSpeechFromText, generateElevenLabsSpeech } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ElevenLabsSettings from './ElevenLabsSettings';

interface GeneratedKeyPointsProps {
  keyPoints: string[];
  isLoading: boolean;
}

interface Section {
  header?: string;
  points: string[];
}

// Color variants for the bullet points and borders
const colorVariants = [
  "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300",
  "border-purple-500 bg-purple-50 text-purple-800 dark:bg-purple-950/20 dark:text-purple-300",
  "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300",
  "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300",
  "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-300",
  "border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/20 dark:text-teal-300",
];

// Bullet point icons for different items
const bulletIcons = [CircleDot, Star, CheckCircle2, BookMarked, ChevronRight];

// Icons for different types of points
const sectionIcons = {
  default: BookOpen,
  definition: BookmarkCheck,
  concept: PenTool, 
  process: ListChecks,
  key: GraduationCap,
  takeaway: CheckCircle2
};

// Get an icon based on the section title
const getSectionIcon = (title: string = ""): React.FC => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("concept")) return sectionIcons.concept;
  if (lowerTitle.includes("definition") || lowerTitle.includes("what is")) return sectionIcons.definition;
  if (lowerTitle.includes("process") || lowerTitle.includes("steps")) return sectionIcons.process;
  if (lowerTitle.includes("key") || lowerTitle.includes("important")) return sectionIcons.key;
  if (lowerTitle.includes("takeaway") || lowerTitle.includes("summary")) return sectionIcons.takeaway;
  
  return sectionIcons.default;
};

const GeneratedKeyPoints: React.FC<GeneratedKeyPointsProps> = ({ keyPoints, isLoading }) => {
  // All state hooks - maintain the same order
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // All ref hooks
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Add a state variable for the selected voice
  const [selectedVoice, setSelectedVoice] = useState<string>("21m00Tcm4TlvDq8ikWAM"); // Default to Rachel
  
  // All useEffect hooks - these must always be in the same order
  // Check if speech synthesis is available
  useEffect(() => {
    // Check if speech synthesis is available in the browser
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
    
    // Cleanup speech synthesis on unmount
    return () => {
      if (hasSpeechSynthesis && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  // Update audio element event listeners - this must always be here, even if not used
  useEffect(() => {
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else {
        audioRef.current.src = audioUrl;
      }
      
      const audio = audioRef.current;
      
      // Set initial values
      audio.playbackRate = playbackRate;
      audio.volume = volume;
      
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      // Add event listeners
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      // Clean up
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
    // Return an empty cleanup function when the condition is not met
    return () => {};
  }, [audioUrl, playbackRate, volume]);

  // Cleanup effect for Web Speech API - this must always be here
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Load the voice preference on component mount
  useEffect(() => {
    const storedVoice = localStorage.getItem('elevenLabsVoice');
    if (storedVoice) {
      setSelectedVoice(storedVoice);
    }
  }, []);

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle voice change from settings
  const handleVoiceChange = (voiceId: string) => {
    console.log("Voice changed to:", voiceId);
    setSelectedVoice(voiceId);
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generating Cheat Sheet...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!keyPoints || keyPoints.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Cheat Sheet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No cheat sheet generated yet. Upload a document and generate a cheat sheet to see results here.</p>
        </CardContent>
      </Card>
    );
  }

  // Process keyPoints to clean up and format if needed
  const processedPoints = keyPoints.map(point => {
    // Handle potential JSON strings
    if (point.startsWith('{') && point.endsWith('}')) {
      try {
        const parsed = JSON.parse(point);
        return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
      } catch {
        // If it's not valid JSON, just return the original
        return point;
      }
    }
    
    // Remove all leading markers like "-", "*", "•", "**", numbers, etc.
    let cleanedPoint = point;
    
    // Remove numbered bullets like "1. " or "1) "
    cleanedPoint = cleanedPoint.replace(/^\d+[\.\)]\s+/, '');
    
    // Remove markdown style bullets and other symbols (allow optional leading whitespace)
    cleanedPoint = cleanedPoint.replace(/^\s*[-*•→★✓✔︎☑︎☐☑️✅•◦◆◇○●⚫︎▪︎▫︎□■⬜︎⬛︎♦︎]\s+/, '');
    cleanedPoint = cleanedPoint.replace(/^\*\*\s+/, '');
    
    return cleanedPoint.trim();
  });

  // Detect section headers (uppercase text followed by ":" or all caps)
  const hasHeaders = processedPoints.some(point => {
    return /^[A-Z\s]{3,}:/.test(point.trim()) || 
           /^[*•-]\s+[A-Z\s]{3,}:/.test(point.trim()) ||
           point.toUpperCase() === point && point.length > 3;
  });

  // Group points by sections if headers are detected
  let organizedPoints: Section[] = [];
  
  if (hasHeaders) {
    let currentSection: Section = { points: [] };
    
    processedPoints.forEach(point => {
      // Check if this point looks like a header
      if (/^[A-Z\s]{3,}:/.test(point.trim()) || 
          /^[*•-]\s+[A-Z\s]{3,}:/.test(point.trim()) ||
          (point.toUpperCase() === point && point.length > 3)) {
        
        // Save previous section if it has points
        if (currentSection.points.length > 0) {
          organizedPoints.push(currentSection);
        }
        
        // Start a new section
        currentSection = { 
          header: point.trim(),
          points: []
        };
      } 
      // Otherwise this is a regular point for the current section
      else if (point.trim()) {
        currentSection.points.push(point.trim());
      }
    });
    
    // Add the last section if it has content
    if (currentSection.points.length > 0 || currentSection.header) {
      organizedPoints.push(currentSection);
    }
  } else {
    // No headers detected, try to organize by content patterns
    if (processedPoints.some(p => /^\d+\.\s/.test(p))) {
      // Numbered points format detected - convert to non-numbered
      let currentPoints: string[] = [];
      
      processedPoints.forEach(point => {
        // Remove any numbering and just keep the content
        const cleanPoint = point.replace(/^\d+[\.\)]\s+/, '').trim();
        if (cleanPoint) {
          currentPoints.push(cleanPoint);
        }
      });
      
      if (currentPoints.length > 0) {
        organizedPoints.push({ points: currentPoints });
      }
    } else {
      // Just use all points in one section
      organizedPoints = [{ points: processedPoints.filter(p => p.trim()) }];
    }
  }

  // Function to generate the full text content for the speech API
  const generateTextContent = () => {
    let fullText = "Study Cheat Sheet.\n\n";
    
    organizedPoints.forEach(section => {
      if (section.header) {
        fullText += section.header + "\n";
      }
      
      section.points.forEach(point => {
        fullText += "• " + point + "\n";
      });
      
      fullText += "\n";
    });
    
    return fullText;
  };

  // Function to generate speech from the cheat sheet content
  const handleGenerateSpeech = async () => {
    if (isGeneratingAudio || isPlaying) {
      return;
    }

    setIsGeneratingAudio(true);

    try {
      // Generate text content from organized points
      const textContent = generateTextContent();
      
      // Format the text to be more digestible
      const formattedText = textContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      console.log("Processing cheat sheet content for audio...");
      console.log("Text length:", formattedText.length, "bytes");
      
      // Check if we have content to process
      if (formattedText.length < 10) {
        throw new Error("Not enough content to process. Please add more text to your cheat sheet.");
      }
      
      // Show initial toast
      toast({
        title: "Generating audio",
        description: "Sending request to server for speech generation...",
      });
      
      // Check if Eleven Labs API key exists
      const hasElevenLabsKey = localStorage.getItem('elevenLabsApiKey');
      
      let audioUrl;
      if (hasElevenLabsKey) {
        // Use Eleven Labs API if key exists, using the selected voice
        console.log("Using Eleven Labs for high-quality speech generation");
        console.log("Selected voice ID:", selectedVoice);
        audioUrl = await generateElevenLabsSpeech(formattedText, selectedVoice);
      } else {
        // Fall back to the default API
        console.log("Using default API for speech generation");
        audioUrl = await generateSpeechFromText(formattedText);
      }
      
      console.log("Speech generation successful, received audio URL:", audioUrl);
      
      // Check if the URL is valid (basic validation)
      if (!audioUrl || typeof audioUrl !== 'string') {
        throw new Error('Invalid audio URL received from server');
      }
      
      // Store the audio URL in state
      setAudioUrl(audioUrl);
      
      // Create or update audio element
      if (audioRef.current) {
        // If we already have an audio element, clean it up first
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      
      // Create a new audio element
      audioRef.current = new Audio(audioUrl);
      
      // Set up event listeners
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        console.log("Audio duration:", audioRef.current?.duration, "seconds");
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio element error:", e);
        const audioElement = e.target as HTMLAudioElement;
        
        let errorMessage = "There was an error playing the audio.";
        if (audioElement.error) {
          // Provide more specific error based on the code
          switch(audioElement.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorMessage = "Audio playback was aborted.";
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorMessage = "Network error while loading audio.";
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMessage = "Audio decoding error. The format may be unsupported.";
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = "Audio format or source is not supported.";
              break;
          }
        }
        
        toast({
          title: "Audio playback error",
          description: errorMessage,
          variant: "destructive",
        });
      });
      
      // Preload the audio
      audioRef.current.load();
      
      toast({
        title: "Audio generated successfully",
        description: hasElevenLabsKey 
          ? "Your cheat sheet has been converted to high-quality speech using Eleven Labs. Press play to listen."
          : "Your cheat sheet has been converted to speech. Press play to listen.",
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      
      let errorMsg = "There was an error generating the audio. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid audio URL')) {
          errorMsg = "The server returned an invalid audio URL. Please try again.";
        } else if (error.message.includes('500')) {
          errorMsg = "The server encountered an internal error. Please try again later.";
        } else if (error.message.includes('Not enough content')) {
          errorMsg = error.message;
        } else if (error.message.includes('API key')) {
          errorMsg = "There was an issue with your Eleven Labs API key. Please check that it's valid.";
        }
      }
      
      toast({
        title: "Audio generation failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Function to play/pause the audio - totally rewritten for simplicity and reliability
  const togglePlayPause = () => {
    console.log("Toggle play/pause called, isPlaying:", isPlaying);
    
    // If we don't have audio yet, suggest generating it
    if (!audioUrl) {
      toast({
        title: "No audio available",
        description: "Please generate audio first by clicking the 'Generate Audio' button.",
      });
      return;
    }
    
    // If we're already in the process of generating audio, don't allow play/pause
    if (isGeneratingAudio) {
      toast({
        title: "Generating audio",
        description: "Please wait while audio is being generated...",
      });
      return;
    }

    // Make sure we have an audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      
      // Add event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        console.log("Audio metadata loaded, duration:", audioRef.current?.duration);
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        
        toast({
          title: "Audio playback error",
          description: "There was an error playing the audio. Try regenerating the audio.",
          variant: "destructive",
        });
      });
    }
    
    // Toggle playback
    if (isPlaying) {
      console.log("Pausing audio");
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log("Playing audio");
      
      // Set volume and playback rate
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      
      // Attempt to play
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started");
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Play failed:", error);
            
            // Check for autoplay restrictions
            const isAutoplayBlocked = error.name === 'NotAllowedError';
            
            if (isAutoplayBlocked) {
              toast({
                title: "Interaction required",
                description: "Please click play again. Your browser requires user interaction to play audio.",
              });
            } else {
              toast({
                title: "Playback failed",
                description: "Unable to play audio. Try regenerating the audio.",
                variant: "destructive",
              });
            }
          });
      }
    }
  };
  
  // Update audio playback rate
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    
    toast({
      title: `Playback speed: ${rate}x`,
      description: `Audio will now play at ${rate}x speed.`,
    });
  };
  
  // Update volume
  const changeVolume = (vol: number) => {
    setVolume(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };
  
  // Restart audio from beginning
  const restartAudio = () => {
    if (!audioRef.current || !audioUrl) {
      toast({
        title: "No audio available",
        description: "Please generate audio first by clicking the 'Generate Audio' button.",
      });
      return;
    }
    
    audioRef.current.currentTime = 0;
    
    if (!isPlaying) {
      // Start playing if not already playing
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Play failed on restart:", error);
          toast({
            title: "Playback failed",
            description: "Unable to restart audio. Your browser may require interaction first.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl">
            <GraduationCap className="h-6 w-6 mr-3 text-primary" />
            Study Cheat Sheet
          </CardTitle>
          <div className="flex space-x-2">
            <ElevenLabsSettings onVoiceChange={handleVoiceChange} />
            <Button 
              variant="outline" 
              size="sm"
              disabled={isGeneratingAudio}
              onClick={handleGenerateSpeech}
              className="flex items-center gap-1"
            >
              {isGeneratingAudio ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span>Generate Audio</span>
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Essential concepts and key points for quick review
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <ScrollArea className="h-[700px] pr-4">
          <div className="space-y-6">
            {organizedPoints.map((section, sectionIndex) => {
              const sectionNumber = sectionIndex + 1;
              return (
                <div key={sectionIndex} className="space-y-3">
                  {section.header && (
                    <div className="mt-8 mb-4 first:mt-0 flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                        {sectionNumber}
                      </span>
                      <h3 className="text-xl font-bold text-primary">
                        {section.header.replace(/[:]*$/,'')}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-2 ml-6">
                    {section.points.map((point, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-primary mr-3 mt-1.5 flex-shrink-0">•</span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      
      {audioUrl && (
        <CardFooter className="border-t flex flex-col gap-4 pt-4">
          {/* Playback controls */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                title="Restart"
                onClick={restartAudio}
                disabled={isGeneratingAudio}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={togglePlayPause}
                disabled={isGeneratingAudio}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.5)}>
                    0.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(0.75)}>
                    0.75x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.0)}>
                    1.0x (Normal)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.25)}>
                    1.25x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(1.5)}>
                    1.5x
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changePlaybackRate(2.0)}>
                    2.0x
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2 ml-4">
                <Volume1 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  className="w-20"
                  defaultValue={[volume]}
                  max={1}
                  step={0.1}
                  min={0}
                  onValueChange={(value) => changeVolume(value[0])}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {!isNaN(duration) && duration > 0 ? 
                  `${formatTime(currentTime)} / ${formatTime(duration)}` : 
                  (isPlaying ? "Playing..." : "Ready")}
              </span>
            </div>
          </div>
          
          {/* Playback progress bar */}
          {(!isNaN(duration) && duration > 0) && (
            <div className="w-full mt-1">
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                min={0}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = value[0];
                    setCurrentTime(value[0]);
                  }
                }}
              />
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default GeneratedKeyPoints;
