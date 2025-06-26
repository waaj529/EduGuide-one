
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Copy, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface GeneratedSummaryProps {
  summary: string;
  isLoading?: boolean;
}

const GeneratedSummary: React.FC<GeneratedSummaryProps> = ({ 
  summary, 
  isLoading = false 
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard.",
    });
  };
  
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    toast({
      title: "Summary downloaded",
      description: "Your summary has been downloaded as a text file.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <BookText className="h-5 w-5 mr-2" />
          Document Summary
        </CardTitle>
        
        {summary && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSummary}>
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
            <p className="text-lg font-medium mb-2">Generating summary...</p>
            <p>We're creating a comprehensive summary of your document. This may take a moment.</p>
          </div>
        ) : summary ? (
          <ScrollArea className="h-[700px] pr-4">
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-base leading-relaxed">
                {summary.split('\n').map((line, index) => {
                  const trimmedLine = line.trim();
                  
                  // Handle numbered section headers (e.g., "1 Principles of Parallel Algorithm Design")
                  if (/^\d+\s+[A-Z]/.test(trimmedLine)) {
                    const parts = trimmedLine.match(/^(\d+)\s+(.+)$/);
                    if (parts) {
                      return (
                        <div key={index} className="mt-8 mb-4 first:mt-0">
                          <h3 className="text-xl font-bold text-primary flex items-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-3">
                              {parts[1]}
                            </span>
                            {parts[2]}
                          </h3>
                        </div>
                      );
                    }
                  }
                  // Handle bullet points
                  else if (trimmedLine.startsWith('• ')) {
                    return (
                      <div key={index} className="ml-6 mb-3 flex items-start">
                        <span className="text-primary mr-3 mt-1.5 flex-shrink-0">•</span>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {trimmedLine.replace('• ', '')}
                        </p>
                      </div>
                    );
                  }
                  // Handle empty lines
                  else if (trimmedLine === '') {
                    return <div key={index} className="h-2" />;
                  }
                  // Handle regular paragraphs
                  else if (trimmedLine.length > 0) {
                    return (
                      <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed ml-6">
                        {trimmedLine}
                      </p>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No Summary Generated</p>
            <p className="max-w-md mx-auto">
              Upload a document and click "Generate Learning Materials" to create a summary of your content.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedSummary;
