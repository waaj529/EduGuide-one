import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import YouTubePlaylist from '@/components/features/YouTubePlaylist';
import { YouTubeVideo } from '@/components/features/YouTubePlayer';

// Sample video data for each subject
const subjectVideos: Record<string, { title: string; videos: YouTubeVideo[]; playlistUrl: string }> = {
  calculus: {
    title: 'Calculus',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLaEKsRk2Nd792XnQOBaKoLtTivT8dhBH0',
    videos: [
      {
        id: '1',
        title: 'Lecture 1 | Introduction to Calculus',
        thumbnail: 'https://i.ytimg.com/vi/WUvTyaaNkzM/mqdefault.jpg',
        duration: '1:09:26',
        url: 'https://www.youtube.com/watch?v=WUvTyaaNkzM'
      },
      {
        id: '2',
        title: 'Lecture 2 | Intervals and Inequality',
        thumbnail: 'https://i.ytimg.com/vi/A0OHUAtOh8g/mqdefault.jpg',
        duration: '1:16:58',
        url: 'https://www.youtube.com/watch?v=A0OHUAtOh8g'
      },
      {
        id: '3',
        title: 'Lecture 3 Part A | Domain, Co-Domain, Range, Function, and graph of a function',
        thumbnail: 'https://i.ytimg.com/vi/HUxOBVOqWdM/mqdefault.jpg',
        duration: '1:12:08',
        url: 'https://www.youtube.com/watch?v=HUxOBVOqWdM'
      },
      {
        id: '4',
        title: 'Lecture 3 Part B | Function, Cartesian plane, domain and range graphically',
        thumbnail: 'https://i.ytimg.com/vi/A6T3tZCUWts/mqdefault.jpg',
        duration: '57:15',
        url: 'https://www.youtube.com/watch?v=A6T3tZCUWts'
      },
      {
        id: '5',
        title: 'Lecture 4 | Graphs of Various Functions | Vertical and Horizontal line test',
        thumbnail: 'https://i.ytimg.com/vi/qR5V5LqCfGY/mqdefault.jpg',
        duration: '1:19:22',
        url: 'https://www.youtube.com/watch?v=qR5V5LqCfGY'
      }
    ]
  },
  ict: {
    title: 'Introduction to ICT',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'Introduction to Information and Communication Technology',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '45:30',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  programming: {
    title: 'Programming Fundamentals',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'Programming Fundamentals - Lecture 1',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '60:00',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  oop: {
    title: 'Object Oriented Programming',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'OOP Concepts - Lecture 1',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '50:00',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  'data-structures': {
    title: 'Data Structure and Algorithms',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'Data Structures - Introduction',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '55:00',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  physics: {
    title: 'Applied Physics',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'Applied Physics - Fundamentals',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '48:00',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  },
  'linear-algebra': {
    title: 'Linear Algebra',
    playlistUrl: '',
    videos: [
      {
        id: '1',
        title: 'Linear Algebra - Introduction',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        duration: '52:00',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  }
};

const SubjectStudy: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Get subject data
  const subjectData = subject ? subjectVideos[subject] : null;

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subject Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The subject you're looking for doesn't exist or hasn't been set up yet.
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <YouTubePlaylist
      title={subjectData.title}
      videos={subjectData.videos}
      onBack={handleBack}
      playlistUrl={subjectData.playlistUrl}
    />
  );
};

export default SubjectStudy; 