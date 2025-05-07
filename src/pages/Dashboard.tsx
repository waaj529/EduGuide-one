import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, PlusCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import SubjectCard from '@/components/common/SubjectCard';
import useMediaQuery, { breakpoints } from '@/hooks/useMediaQuery';
import { CardSkeleton, TextSkeleton } from '@/components/ui/LoadingSkeletons';
import ProgressBar from '@/components/common/ProgressBar';

// Sample subject data
const subjects = [
  { id: '1', title: 'Calculus', icon: 'math', progress: 68, route: '/study/calculus' },
  { id: '2', title: 'Introduction to ICT', icon: 'ict', progress: 47, route: '/study/ict' },
  { id: '3', title: 'Programming Fundamentals', icon: 'programming', progress: 82, route: '/study/programming' },
  { id: '4', title: 'OOP', icon: 'programming', progress: 35, route: '/study/oop' },
  { id: '5', title: 'Data Structure and Algorithms', icon: 'data', progress: 52, route: '/study/data-structures' },
  { id: '6', title: 'Applied Physics', icon: 'physics', progress: 63, route: '/study/physics' },
  { id: '7', title: 'Linear Algebra', icon: 'linear', progress: 29, route: '/study/linear-algebra' },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const isMobile = !useMediaQuery(breakpoints.md);
  const isTablet = !useMediaQuery(breakpoints.lg);
  const userRole = localStorage.getItem('eduguide_user_role') || 'student';
  
  // API Integration Point: Fetch user data and subjects
  useEffect(() => {
    // Simulate loading
    // In a real app, you'd fetch user data and subjects
    // const fetchUserData = async () => {
    //   try {
    //     const userData = await api.users.getCurrentUserData();
    //     const subjectsData = await api.subjects.getUserSubjects();
    //     setUserData(userData);
    //     setSubjects(subjectsData);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //     setLoading(false);
    //   }
    // };
    // fetchUserData();
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      <section className="mb-10">
        <div className="w-full rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 text-white p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4 mr-2 text-white" />
              <span className="text-white">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Smart Learning for <span className="text-white">Your Exams</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-6 max-w-2xl">
              Upload your learning materials, and let AI create customized resources to help you prepare
              better! Upload PDFs, Slides, Notes, Videos – and Get Smart Learning Materials Generated
              Automatically.
            </p>
            
            <Button 
              variant="default"
              size={isMobile ? "default" : "lg"}
              asChild
              className="bg-white text-brand-blue hover:bg-blue-50 w-full sm:w-auto"
            >
              <Link to={userRole === 'student' ? "/study-materials" : "/upload?tab=assignment"} className="flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Materials
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h2 className="text-2xl font-bold">Your Subjects</h2>
          <Link 
            to="/courses" 
            className="text-sm text-brand-blue dark:text-blue-400 flex items-center group"
          >
            Browse All Courses 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          isMobile ? (
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[280px] snap-start">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )
        ) : (
          isMobile ? (
            <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide snap-x">
              {subjects.map(subject => (
                <div key={subject.id} className="min-w-[280px] snap-start animate-slide-in-right">
                  <SubjectCard
                    title={subject.title}
                    icon={subject.icon as any}
                    progress={subject.progress}
                    route={subject.route}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  title={subject.title}
                  icon={subject.icon as any}
                  progress={subject.progress}
                  route={subject.route}
                />
              ))}
            </div>
          )
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Quick Upload</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to={userRole === 'student' ? "/study-materials" : "/upload"}>See all</Link>
            </Button>
          </div>
          
          {loading ? (
            <TextSkeleton lines={3} />
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload your study materials to get personalized learning resources
              </p>
              
              <div 
                className="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center mb-4 cursor-pointer hover:border-brand-blue hover:bg-brand-blue/5 transition-colors"
                onClick={() => window.location.href = userRole === 'student' ? '/study-materials' : '/upload?tab=assignment'}
              >
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Drag files here or click to upload
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports PDF, DOCX, PPTX, JPG, PNG
                </p>
              </div>
              
              <h3 className="font-medium text-sm mb-2">Recent Uploads</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex items-center">
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded mr-2">PDF</span>
                    <span className="truncate">Mathematics_Notes_Chapter7.pdf</span>
                  </div>
                  <span className="text-gray-500 text-xs">2023-10-12</span>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Study Progress</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/progress">View full progress</Link>
            </Button>
          </div>
          
          {loading ? (
            <TextSkeleton lines={4} />
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track your learning across subjects
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center mr-2">
                        <span className="text-xs">C</span>
                      </div>
                      <span className="text-sm">Calculus</span>
                    </div>
                    <span className="text-sm">68%</span>
                  </div>
                  <ProgressBar progress={68} colorVariant="primary" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center mr-2">
                        <span className="text-xs">I</span>
                      </div>
                      <span className="text-sm">Introduction to ICT</span>
                    </div>
                    <span className="text-sm">47%</span>
                  </div>
                  <ProgressBar progress={47} colorVariant="warning" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-indigo-500 text-white rounded flex items-center justify-center mr-2">
                        <span className="text-xs">P</span>
                      </div>
                      <span className="text-sm">Programming Fundamentals</span>
                    </div>
                    <span className="text-sm">82%</span>
                  </div>
                  <ProgressBar progress={82} colorVariant="success" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
