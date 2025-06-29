
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface MaterialUploaderProps {
  onFileSelected: (file: File) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  helpText?: string;
}

const MaterialUploader: React.FC<MaterialUploaderProps> = ({ 
  onFileSelected, 
  maxSize = 10, // Default 10MB
  allowedTypes = [
    '.pdf', '.docx', '.doc', '.pptx', '.ppt', 
    '.txt', '.rtf', '.odt', '.odp',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff',
    '.mp3', '.wav', '.m4a', '.aac'
  ],
  helpText = "Supports PDF, Word, PowerPoint, Images, Text files & Audio"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB.`);
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB.`,
        variant: "destructive",
      });
      return false;
    }

    // Define comprehensive MIME type mappings
    const mimeTypeMap = {
      // Document types
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt'],
      'application/rtf': ['.rtf'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
      'application/vnd.oasis.opendocument.presentation': ['.odp'],
      
      // Image types
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff', '.tif'],
      
      // Audio types
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/mp4': ['.m4a'],
      'audio/aac': ['.aac']
    };

    // Check file type using both MIME type and extension for maximum compatibility
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    // First check if extension is allowed
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      toast({
        title: "Invalid file type",
        description: `Please upload one of these formats: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    // Check if MIME type matches the extension (if MIME type is provided)
    if (mimeType) {
      const allowedExtensionsForMime = mimeTypeMap[mimeType];
      if (allowedExtensionsForMime && !allowedExtensionsForMime.includes(fileExtension)) {
        console.warn(`MIME type ${mimeType} doesn't match extension ${fileExtension}`);
        // Don't reject, just warn - some browsers might provide incorrect MIME types
      }
    }

    // Additional validation for empty files
    if (file.size === 0) {
      setError('File appears to be empty. Please select a valid file.');
      toast({
        title: "Empty file",
        description: "The selected file appears to be empty.",
        variant: "destructive",
      });
      return false;
    }

    console.log(`✅ File validation passed:`, {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.type || 'unknown',
      extension: fileExtension
    });

    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        } ${error ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`h-10 w-10 mb-2 ${error ? "text-red-500" : "text-muted-foreground"}`} />
        <p className="text-sm text-muted-foreground mb-1">
          Drag files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          {helpText}
        </p>
        
        {error && (
          <p className="text-xs text-red-500 mb-4">
            {error}
          </p>
        )}
        
        <Button variant="outline" size="sm" asChild>
          <label className="cursor-pointer">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.rtf,.odt,.odp,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.mp3,.wav,.m4a,.aac,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,image/*,audio/*"
              onChange={handleFileChange}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default MaterialUploader;
