import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, HelpCircle, FileText, Mail, Globe, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background py-6 md:py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-brand-blue p-1">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold">EduGuide AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A study helper I built for my final year project
            </p>
            
            {/* API Integration Point - Add authentication status */}
            <div className="mt-2 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} EduGuide AI</p>
              <p>All rights reserved</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/practice" className="text-sm text-muted-foreground hover:text-foreground">
                  Practice Questions
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground">
                  Upload Materials
                </Link>
              </li>
              <li>
                <Link to="/review" className="text-sm text-muted-foreground hover:text-foreground">
                  Review Mistakes
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-sm text-muted-foreground hover:text-foreground">
                  Progress Tracker
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Project</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <a href="https://github.com/waaj529/FYP" className="text-sm text-muted-foreground hover:text-foreground">
                  Source Code
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Me
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
            <div className="flex space-x-3 pt-2">
              <Link to="https://twitter.com" className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="https://github.com" className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link to="mailto:contact@eduguide.ai" className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
            Built by Wajid Abbas for Final Year Project 2024
          </p>
          <p className="text-xs text-muted-foreground text-center md:text-right">
            Made with <span className="text-red-500">♥</span> and lots of coffee
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
