
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  FileText, 
  ChevronRight, 
  Database, 
  Activity, 
  AlignLeft 
} from 'lucide-react';

interface SubjectCardProps {
  title: string;
  icon: 'math' | 'programming' | 'ict' | 'data' | 'physics' | 'linear';
  progress: number;
  route: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, icon, progress, route }) => {
  const renderIcon = () => {
    const iconClasses = "w-6 h-6 text-white";
    const bgColorClass = getIconBgColor();
    
    return (
      <div className={`flex items-center justify-center rounded-lg p-2 ${bgColorClass}`}>
        {icon === 'math' && <AlignLeft className={iconClasses} />}
        {icon === 'programming' && <Code className={iconClasses} />}
        {icon === 'ict' && <FileText className={iconClasses} />}
        {icon === 'data' && <Database className={iconClasses} />}
        {icon === 'physics' && <Activity className={iconClasses} />}
        {icon === 'linear' && <AlignLeft className={iconClasses} />}
      </div>
    );
  };

  const getIconBgColor = () => {
    switch (icon) {
      case 'math': return 'bg-blue-500';
      case 'programming': return 'bg-indigo-500';
      case 'ict': return 'bg-green-500';
      case 'data': return 'bg-orange-500';
      case 'physics': return 'bg-purple-500';
      case 'linear': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = () => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Link 
      to={route}
      className="glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
    >
      <div className="flex items-start gap-4">
        {renderIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base md:text-lg truncate">{title}</h3>
          <div className="mt-2 progress-bar">
            <div 
              className={`progress-fill ${getProgressColor()}`} 
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <div className="mt-1 flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{progress}% complete</span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
