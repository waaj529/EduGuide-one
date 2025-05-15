import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, BookOpen, Upload, FileQuestion, AlertTriangle, BarChart2, Sun, Moon, ChevronDown, User, UserCog, GraduationCap } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import useMediaQuery, { breakpoints } from '@/hooks/useMediaQuery';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// NavbarLink Component for consistent styling
const NavbarLink = ({ to, children, isMobile = false }: { to: string; children: React.ReactNode; isMobile?: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
      isMobile ? 'hover:bg-gray-100 dark:hover:bg-gray-800 w-full' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string, message: string, isRead: boolean }[]>([
    { id: '1', message: 'New study materials available', isRead: false },
    { id: '2', message: 'Your progress is improving!', isRead: false },
    { id: '3', message: 'Don\'t forget to practice today', isRead: true },
  ]);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const isDesktop = useMediaQuery(breakpoints.lg);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All notifications marked as read",
      variant: "default",
    });
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  };

  const handleRoleSwitch = (role: 'student' | 'teacher') => {
    switchRole(role);
  };

  const teacherNavLinks = [
    { 
      label: 'Dashboard', 
      to: '/teacher-dashboard', 
      icon: <GraduationCap className="w-5 h-5" />,
    },
  ];

  const studentNavLinks = [
    { 
      label: 'Dashboard', 
      to: '/dashboard', 
      icon: <BookOpen className="w-5 h-5" />,
    },
    { 
      label: 'Study Materials', 
      to: '/study-materials', 
      icon: <Upload className="w-5 h-5" />,
    },
    { 
      label: 'Practice', 
      to: '/practice', 
      icon: <FileQuestion className="w-5 h-5" />,
    },
    { 
      label: 'Progress', 
      to: '/progress', 
      icon: <BarChart2 className="w-5 h-5" />,
    },
  ];

  const navLinks = user?.role === 'teacher' ? teacherNavLinks : studentNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-all">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-brand-blue p-1">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">EduGuide AI</span>
          </Link>
        </div>

        {isAuthenticated && isDesktop ? (
          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              {navLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={link.to}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "flex items-center gap-2"
                      )}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        ) : null}

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  {user?.role === 'teacher' ? (
                    <>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <span>Teacher</span>
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      <span>Student</span>
                    </>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleRoleSwitch('student')}
                  className={cn("cursor-pointer", user?.role === 'student' && "bg-primary/10")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Student Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleRoleSwitch('teacher')}
                  className={cn("cursor-pointer", user?.role === 'teacher' && "bg-primary/10")}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Teacher Mode</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4 bg-background">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-brand-blue hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-md text-sm ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}
                      >
                        <p>{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500 py-4">No notifications</p>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <Link 
                    to="/notifications" 
                    className="text-xs text-brand-blue hover:underline w-full text-center block"
                  >
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="rounded-full bg-gray-200 dark:bg-gray-700 p-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={handleProfileClick}
              >
                <span className="sr-only">Profile</span>
                <User className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            {isAuthenticated ? (
              <DropdownMenuContent align="end" className="w-56 p-2 bg-background">
                <div className="px-3 py-2 border-b border-border mb-2">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help" className="cursor-pointer">Help Center</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 hover:text-red-600">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end" className="w-56 p-2 bg-background">
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">Sign In</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
          
          {!isDesktop && (
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors lg:hidden"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {isOpen && !isDesktop && isAuthenticated && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-background border-b border-border z-50 shadow-lg animate-slide-down">
          <nav className="px-4 py-2 divide-y divide-border">
            {navLinks.map((link, idx) => (
              <NavbarLink key={idx} to={link.to} isMobile>
                {link.icon}
                <span>{link.label}</span>
              </NavbarLink>
            ))}
            <div className="py-2">
              <h3 className="px-4 py-2 text-sm font-semibold">Switch Role</h3>
              <button 
                onClick={() => handleRoleSwitch('student')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors w-full hover:bg-gray-100 dark:hover:bg-gray-800 ${user?.role === 'student' ? 'bg-primary/10' : ''}`}
              >
                <User className="h-4 w-4" />
                <span>Student Mode</span>
              </button>
              <button 
                onClick={() => handleRoleSwitch('teacher')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors w-full hover:bg-gray-100 dark:hover:bg-gray-800 ${user?.role === 'teacher' ? 'bg-primary/10' : ''}`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Teacher Mode</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
