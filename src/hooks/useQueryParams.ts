import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A hook to handle query parameters for tab navigation
 * @param defaultTab The default tab to show if no query parameter is present
 * @param setActiveTab Function to set the active tab
 */
export const useQueryParams = (
  defaultTab: string,
  setActiveTab: (tab: string) => void
) => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get the type from query parameters
    const typeParam = searchParams.get('type');
    
    // If a valid type is provided, set it as active tab
    if (typeParam && ['assignments', 'quizzes', 'exams'].includes(typeParam)) {
      setActiveTab(typeParam);
    } else {
      // Otherwise set the default tab
      setActiveTab(defaultTab);
    }
  }, [searchParams, setActiveTab, defaultTab]);
};

export default useQueryParams;
