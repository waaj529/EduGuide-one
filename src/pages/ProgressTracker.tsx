
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  BookOpen, 
  Download, 
  Share, 
  TrendingUp, 
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useMediaQuery, { breakpoints } from '@/hooks/useMediaQuery';
import ProgressBar from '@/components/common/ProgressBar';

// Placeholder for the chart component - in a real app, you'd use Recharts or similar
const PlaceholderChart = ({ type }: { type: 'bar' | 'line' | 'pie' }) => {
  return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          {type === 'bar' ? 'Bar Chart' : type === 'line' ? 'Line Chart' : 'Pie Chart'} Placeholder
        </p>
        <p className="text-xs text-gray-400 mt-2">
          API Integration Point: Replace with actual chart data
        </p>
      </div>
    </div>
  );
};

const ProgressTracker = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [subjects, setSubjects] = useState<any[]>([]);
  const isMobile = !useMediaQuery(breakpoints.md);
  
  // API Integration Point: Fetch progress data
  useEffect(() => {
    // Simulate API call
    const fetchProgressData = async () => {
      // In a real implementation, you would fetch data from your API
      // const response = await fetch('/api/progress');
      // const data = await response.json();
      
      // Simulated data for now
      const mockSubjects = [
        { id: 1, name: 'Calculus', progress: 68, hoursSpent: 24, lastStudied: '2023-05-15' },
        { id: 2, name: 'Introduction to ICT', progress: 47, hoursSpent: 16, lastStudied: '2023-05-14' },
        { id: 3, name: 'Programming Fundamentals', progress: 82, hoursSpent: 32, lastStudied: '2023-05-13' },
        { id: 4, name: 'OOP', progress: 35, hoursSpent: 12, lastStudied: '2023-05-12' },
        { id: 5, name: 'Data Structure and Algorithms', progress: 52, hoursSpent: 20, lastStudied: '2023-05-10' },
      ];
      
      setSubjects(mockSubjects);
      setLoading(false);
    };
    
    fetchProgressData();
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      fetchProgressData();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get performance metrics
  const getAverageProgress = () => {
    if (subjects.length === 0) return 0;
    return Math.round(subjects.reduce((acc, subj) => acc + subj.progress, 0) / subjects.length);
  };
  
  const getTotalHours = () => {
    return subjects.reduce((acc, subj) => acc + subj.hoursSpent, 0);
  };
  
  // Helper for progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'danger';
  };
  
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your learning progress and track improvements
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{timeframe === 'week' ? 'This Week' : timeframe === 'month' ? 'This Month' : 'All Time'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTimeframe('week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe('month')}>
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe('all')}>
                  All Time
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{getAverageProgress()}%</span>
                  <span className="text-sm text-green-500 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    5%
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Across all subjects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Total Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{getTotalHours()}h</span>
                  <span className="text-xs text-gray-500">Last 30 days</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">+8h from previous period</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 dark:text-gray-400 font-normal">Learning Streak</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-12 w-24" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">14 days</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Current streak</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">By Subject</TabsTrigger>
            <TabsTrigger value="time">Study Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Over Time</CardTitle>
                  <CardDescription>Track your improvement across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <PlaceholderChart type="line" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subject Breakdown</CardTitle>
                  <CardDescription>Progress distribution by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <PlaceholderChart type="bar" />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Activity Heatmap</CardTitle>
                    <CardDescription>Your study activity patterns</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                    14 day streak
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-800 h-64 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-gray-400" />
                    <p className="text-sm text-gray-500 ml-4">
                      Calendar heatmap would go here (API integration point)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Subject Progress</CardTitle>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Compare
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subjects.map(subject => (
                      <div key={subject.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full bg-${subject.progress > 75 ? 'green' : subject.progress > 50 ? 'blue' : subject.progress > 30 ? 'yellow' : 'red'}-500 flex items-center justify-center text-white mr-3`}>
                              {subject.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-medium">{subject.name}</h3>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" /> {subject.hoursSpent} hours spent
                                <span className="mx-2">•</span>
                                <span>Last studied: {subject.lastStudied}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm">{subject.progress}%</span>
                        </div>
                        <ProgressBar 
                          progress={subject.progress} 
                          colorVariant={getProgressColor(subject.progress) as any}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between border-t p-6">
                <div className="text-sm text-gray-500">
                  <p>Average completion: <span className="font-medium">{getAverageProgress()}%</span></p>
                </div>
                <Button asChild>
                  <a href="/dashboard">View All Subjects</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="time">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Study Time Distribution</CardTitle>
                  <CardDescription>Hours spent on each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <PlaceholderChart type="pie" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Study Pattern</CardTitle>
                  <CardDescription>When you study the most</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <PlaceholderChart type="bar" />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Session History</CardTitle>
                <CardDescription>Your recent study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y">
                    {[
                      { date: '2023-05-15', subject: 'Calculus', duration: '2h 30m', topics: ['Integration', 'Derivatives'] },
                      { date: '2023-05-14', subject: 'Programming', duration: '1h 45m', topics: ['Functions', 'Arrays'] },
                      { date: '2023-05-13', subject: 'Data Structures', duration: '3h 15m', topics: ['Trees', 'Graphs'] },
                    ].map((session, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{session.subject}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {session.topics.map((topic, i) => (
                                <Badge key={i} variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm">{session.duration}</span>
                            <p className="text-xs text-gray-500">{session.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-center border-t p-6">
                <Button variant="outline">
                  View All Sessions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressTracker;
