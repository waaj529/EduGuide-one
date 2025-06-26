
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, Copy, Download, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

interface GeneratedSummaryProps {
  summary: string;
  isLoading?: boolean;
}

const GeneratedSummary: React.FC<GeneratedSummaryProps> = ({ 
  summary, 
  isLoading = false 
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [sections, setSections] = useState<Array<{
    number: number;
    title: string;
    content: string[];
  }>>([]);

  // Parse summary into sections when it changes
  useEffect(() => {
    if (summary) {
      const lines = summary.split('\n');
      const parsedSections = [];
      let currentSection = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Detect numbered section headers
        if (/^\d+\s+[A-Z]/.test(trimmedLine)) {
          if (currentSection) {
            parsedSections.push(currentSection);
          }
          
          const parts = trimmedLine.match(/^(\d+)\s+(.+)$/);
          if (parts) {
            currentSection = {
              number: parseInt(parts[1]),
              title: parts[2],
              content: []
            };
          }
        } else if (currentSection && trimmedLine.length > 0) {
          currentSection.content.push(trimmedLine);
        }
      }
      
      if (currentSection) {
        parsedSections.push(currentSection);
      }
      
      setSections(parsedSections);
      
      // Calculate estimated reading time (average 200 words per minute)
      const wordCount = summary.split(' ').length;
      const minutes = Math.ceil(wordCount / 200);
      setEstimatedReadTime(minutes);
    }
  }, [summary]);



  // Toggle section completion
  const toggleSectionCompletion = (sectionNumber: number) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionNumber)) {
      newCompleted.delete(sectionNumber);
    } else {
      newCompleted.add(sectionNumber);
    }
    setCompletedSections(newCompleted);
    
    // Update reading progress
    const progress = (newCompleted.size / sections.length) * 100;
    setReadingProgress(progress);
  };

  // Toggle section collapse
  const toggleSectionCollapse = (sectionNumber: number) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionNumber)) {
      newCollapsed.delete(sectionNumber);
    } else {
      newCollapsed.add(sectionNumber);
    }
    setCollapsedSections(newCollapsed);
  };

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
    <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4">
          {/* Header with title and actions */}
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-2xl font-bold">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                <BookText className="h-5 w-5 text-white" />
              </div>
              Study Summary
            </CardTitle>
            
            {summary && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover:bg-blue-50 dark:hover:bg-blue-950/30">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSummary} className="hover:bg-green-50 dark:hover:bg-green-950/30">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {/* Progress and stats section */}
          {summary && sections.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {estimatedReadTime} min read
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {sections.length} sections
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {completedSections.size}/{sections.length} completed
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Reading Progress</span>
                  <span>{Math.round(readingProgress)}%</span>
                </div>
                <Progress value={readingProgress} className="h-2" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Creating your study summary...</p>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">We're analyzing your document and organizing the key concepts for optimal learning.</p>
          </div>
        ) : summary && sections.length > 0 ? (
          <ScrollArea className="h-[800px] pr-4">
            <div className="space-y-4">
              {sections.map((section) => {
                const isCompleted = completedSections.has(section.number);
                const isCollapsed = collapsedSections.has(section.number);
                
                return (
                  <Collapsible
                    key={section.number}
                    open={!isCollapsed}
                    onOpenChange={() => toggleSectionCollapse(section.number)}
                  >
                    <div className={`rounded-xl border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' 
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50'
                    }`}>
                      {/* Section Header */}
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-t-xl transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                              isCompleted 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <span className="font-bold text-lg">{section.number}</span>
                              )}
                            </div>
                            
                                                         <div className="flex-1">
                               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                 {section.title}
                               </h3>
                               <div className="flex items-center space-x-2">
                                 <span className="text-sm text-gray-500 dark:text-gray-400">
                                   {section.content.length} key points
                                 </span>
                               </div>
                             </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSectionCompletion(section.number);
                              }}
                              className={`transition-colors ${
                                isCompleted 
                                  ? 'text-green-600 hover:text-green-700' 
                                  : 'text-gray-400 hover:text-green-600'
                              }`}
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            
                            {isCollapsed ? (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      {/* Section Content */}
                      <CollapsibleContent>
                        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="pt-4 space-y-3">
                            {section.content.map((item, itemIndex) => {
                              if (item.startsWith('• ')) {
                                return (
                                  <div key={itemIndex} className="flex items-start space-x-3 group">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0 group-hover:bg-blue-600 transition-colors"></div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                                      {item.replace('• ', '')}
                                    </p>
                                  </div>
                                );
                              } else {
                                return (
                                  <p key={itemIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-5">
                                    {item}
                                  </p>
                                );
                              }
                            })}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
              
              {/* Completion celebration */}
              {completedSections.size === sections.length && sections.length > 0 && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    🎉 Summary Completed!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Great job! You've read through all sections. Ready for some practice questions?
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Ready to Create Your Study Summary?</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Upload your study material and generate an interactive summary with progress tracking, 
              collapsible sections, and engaging visual elements designed for effective learning.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratedSummary;
