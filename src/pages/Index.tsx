import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Upload, BarChart2, GraduationCap, Building, Globe, Calendar, Clock, ListChecks, Star } from "lucide-react";
import LearningMaterialsSection from '@/components/features/LearningMaterialsSection';
import DocumentTransformAnimation from '@/components/features/DocumentTransformAnimation';

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return <div className="min-h-screen flex flex-col overflow-hidden">
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-16">
        <div>
          {/* Hero Section */}
          <div className={`text-center mb-10 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 font-heading text-gray-800 dark:text-gray-100">
              EduGuide AI
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto font-body px-2">
              Upload your study materials and get instant practice questions, summaries, and study guides
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-6 sm:px-8 glow-on-hover animated-gradient">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full px-6 sm:px-8 shimmer">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 staggered-fade-in">
            {/* Feature 1 - Exam Preparation */}
            <div className="glass-card p-6 sm:p-8 rounded-lg hover-scale elastic-bounce">
              <div className="bg-primary/10 p-3 rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-4 rotating-element">
                <BookOpen className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Exam Preparation</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Turn your lecture notes and textbooks into practice questions and quizzes automatically.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Custom question papers
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Automatic answer evaluation
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Exam-style practice tests
                </li>
              </ul>
              <Link to="/practice" className="text-primary hover:underline text-xs sm:text-sm flex items-center">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* Feature 2 - University Guide */}
            <div className="glass-card p-6 sm:p-8 rounded-lg hover-scale elastic-bounce">
              <div className="bg-blue-500/10 p-3 rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-4 rotating-element">
                <GraduationCap className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">University Guide</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Get suggestions for universities based on your grades and interests.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  School matching algorithm
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Historical admission data
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  Personalized suggestions
                </li>
              </ul>
              <Link to="/university-rankings" className="text-blue-500 hover:underline text-xs sm:text-sm flex items-center">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* Feature 3 - Resource Allocation */}
            <div className="glass-card p-6 sm:p-8 rounded-lg hover-scale elastic-bounce">
              <div className="bg-green-500/10 p-3 rounded-full w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center mb-4 rotating-element">
                <Calendar className="h-6 sm:h-8 w-6 sm:w-8 text-green-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3">Resource Allocation</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Plan your study schedule and focus on the topics that matter most for your exams.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Intelligent study planner
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Topic prioritization
                </li>
                <li className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                  Time optimization tools
                </li>
              </ul>
              <Link to="/study-planner" className="text-green-500 hover:underline text-xs sm:text-sm flex items-center">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Document transformation animation section */}
          <div className="mb-12 sm:mb-16 floating-element px-2 sm:px-4">
            <DocumentTransformAnimation />
          </div>

          {/* Learning Materials Section */}
          <div className={`mb-12 sm:mb-16 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <LearningMaterialsSection />
          </div>

          {/* University Matching Section */}
          <div className="glass-card p-5 sm:p-8 rounded-lg mb-12 sm:mb-16 animated-gradient">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gradient">University Finder</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
                  Not sure which universities to apply to? This feature looks at your grades and interests 
                  to suggest schools that might be a good fit.
                </p>
                
                <div className="space-y-4 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Globe className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Data-Driven Recommendations</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Using historical admission patterns and success rates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Building className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Personalized Matching</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">Aligning your strengths and interests with university programs</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/university-rankings" className="block w-full sm:w-auto">
                  <Button className="w-full sm:w-auto glow-on-hover">
                    Explore Universities <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="lg:w-1/2 bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-4 sm:p-6 rounded-lg floating-element w-full">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-background rounded-lg p-3 sm:p-4 flex items-center border border-border shimmer">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center mr-3 sm:mr-4">
                      <GraduationCap className="h-4 sm:h-5 w-4 sm:w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">NUST</h4>
                      <div className="flex items-center mt-1">
                        <div className="bg-green-500/20 rounded-full px-2 py-0.5 text-xs text-green-700 dark:text-green-300">
                          94% Match
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Computer Science</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-3 sm:p-4 flex items-center border border-border shimmer">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center mr-3 sm:mr-4">
                      <GraduationCap className="h-4 sm:h-5 w-4 sm:w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">MIT</h4>
                      <div className="flex items-center mt-1">
                        <div className="bg-amber-500/20 rounded-full px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                          87% Match
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Artificial Intelligence</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-3 sm:p-4 flex items-center border border-border shimmer">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center mr-3 sm:mr-4">
                      <GraduationCap className="h-4 sm:h-5 w-4 sm:w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">IBA</h4>
                      <div className="flex items-center mt-1">
                        <div className="bg-blue-500/20 rounded-full px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">
                          82% Match
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">Data Science</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resource Allocation Section */}
          <div className="glass-card p-5 sm:p-8 rounded-lg mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 text-center text-gradient">Better Study Planning</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 staggered-fade-in">
              <div className="bg-background p-4 sm:p-6 rounded-lg border border-border hover-scale">
                <div className="bg-green-500/10 p-2 sm:p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 floating-element">
                  <Calendar className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Smart Study Planner</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Create customized study schedules based on exam dates, topic difficulty, and your learning pace.
                </p>
              </div>
              
              <div className="bg-background p-4 sm:p-6 rounded-lg border border-border hover-scale">
                <div className="bg-green-500/10 p-2 sm:p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 floating-element">
                  <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Time Management Tools</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Track your study sessions and see when you're most productive during the day.
                </p>
              </div>
              
              <div className="bg-background p-4 sm:p-6 rounded-lg border border-border hover-scale">
                <div className="bg-green-500/10 p-2 sm:p-3 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4 floating-element">
                  <ListChecks className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Priority Management</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Focus on high-impact topics first with AI-powered prioritization based on your knowledge gaps.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/study-planner" className="block w-full sm:inline-block sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 shimmer">
                  Try Study Planner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Final CTA Section */}
          <div className="bg-gradient-to-r from-primary/20 to-brand-lightBlue/20 rounded-xl p-6 sm:p-10 text-center transform transition-all duration-700 hover:scale-[1.02] sm:hover:scale-105">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-heading text-gray-800 dark:text-gray-100">Ready to Try It Out?</h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-5 sm:mb-6 max-w-2xl mx-auto font-body px-1">
              Sign up and see how it can help make studying a bit easier. 
              It's free to try with your own documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-6 sm:px-8 animated-gradient">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full px-6 sm:px-8 shimmer">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default Index;
