
import React from 'react';

interface ProgressBarProps {
  progress: number;
  height?: string;
  colorVariant?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'h-2',
  colorVariant = 'primary',
  animated = true,
  showLabel = false,
  className = '',
}) => {
  const getColorClass = () => {
    switch (colorVariant) {
      case 'success': return 'progress-fill-success';
      case 'warning': return 'progress-fill-warning';
      case 'danger': return 'progress-fill-danger';
      case 'secondary': return 'progress-fill-secondary';
      default: return 'progress-fill-primary';
    }
  };

  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className={`progress-bar ${height}`}>
        <div
          className={`progress-fill ${getColorClass()} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
          {Math.round(safeProgress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
