
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}></div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-2 w-full mb-1" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-4/6' : 'w-full'}`} 
        />
      ))}
    </div>
  );
};

export const StatSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-4">
      <Skeleton className="h-5 w-1/3 mb-2" />
      <Skeleton className="h-8 w-1/2 mb-1" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-4">
      <Skeleton className="h-5 w-1/3 mb-4" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
};

export const FlashcardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-64 sm:h-80 w-full rounded-xl" />
      <div className="mt-6 flex items-center justify-between">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
};
