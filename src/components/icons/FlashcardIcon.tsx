
import React from 'react';

interface FlashcardIconProps {
  className?: string;
}

const FlashcardIcon: React.FC<FlashcardIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <path d="M9 16h6"></path>
      <path d="M12 13v6"></path>
    </svg>
  );
};

export default FlashcardIcon;
