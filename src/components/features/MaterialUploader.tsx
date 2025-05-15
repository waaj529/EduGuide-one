
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
  allowedTypes = ['.pdf', '.docx', '.doc', '.pptx', '.ppt', '.jpg', '.jpeg', '.png'],
  helpText = "Supports PDF, DOCX, PPTX, JPG, PNG"
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

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      toast({
        title: "Invalid file type",
        description: `Please upload one of these formats: ${allowedTypes.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

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
              accept={allowedTypes.join(',')}
              onChange={handleFileChange}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default MaterialUploader;
