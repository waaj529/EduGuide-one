
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Copy, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface GeneratedKeyPointsProps {
  keyPoints: string[];
  isLoading?: boolean;
}

const GeneratedKeyPoints: React.FC<GeneratedKeyPointsProps> = ({ 
  keyPoints, 
  isLoading = false 
}) => {
  const copyToClipboard = () => {
    const content = keyPoints.join('\n\n');
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Key points have been copied to your clipboard.",
    });
  };
  
  const downloadKeyPoints = () => {
    const content = keyPoints.join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `key-points-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Key points downloaded",
      description: "Your key points have been downloaded as a text file.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Key Points to Remember
        </CardTitle>
        
        {keyPoints.length > 0 && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadKeyPoints}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">Extracting key points...</p>
            <p>We're identifying the most important concepts from your document. This may take a moment.</p>
          </div>
        ) : keyPoints.length > 0 ? (
          <ScrollArea className="h-[500px] pr-4">
            <ul className="space-y-4">
              {keyPoints.map((point, index) => (
                <li key={index} className="bg-muted p-4 rounded-md">
                  <p className="text-base">{point}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No Key Points Generated</p>
            <p className="max-w-md mx-auto">
              Upload a document and click "Generate Learning Materials" to extract key points from your content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedKeyPoints;
