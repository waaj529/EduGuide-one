import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleVideoList from '@/components/features/SimpleVideoList';
import { SimpleVideo } from '@/components/features/SimpleVideoList';

// Real video data from provided playlist URLs
const subjectVideos: Record<string, { title: string; videos: SimpleVideo[]; playlistUrl: string }> = {
  calculus: {
    title: 'Calculus',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLaEKsRk2Nd792XnQOBaKoLtTivT8dhBH0',
    videos: [
      {
        id: '1',
        title: 'Lecture 1 | Introduction to Calculus',
        url: 'https://www.youtube.com/watch?v=Pr_EveoAW7A',
        index: 1
      },
      {
        id: '2',
        title: 'Lecture 2 | Intervals and Inequality',
        url: 'https://www.youtube.com/watch?v=zVZxxrzEza8',
        index: 2
      },
      {
        id: '3',
        title: 'Lecture 3 | Domain, Co-Domain, Range, Function',
        url: 'https://www.youtube.com/watch?v=mwSX5FCkfn8',
        index: 3
      },
      {
        id: '4',
        title: 'Lecture 4 | Function, Cartesian plane',
        url: 'https://www.youtube.com/watch?v=YY3G2uMFmzk',
        index: 4
      },
      {
        id: '5',
        title: 'Lecture 5 | Graphs of Various Functions',
        url: 'https://www.youtube.com/watch?v=DrQnvbbudGc',
        index: 5
      },
      {
        id: '6',
        title: 'Lecture 6 | Advanced Functions',
        url: 'https://www.youtube.com/watch?v=7yoPFyGXGqg',
        index: 6
      },
      {
        id: '7',
        title: 'Lecture 7 | Function Analysis',
        url: 'https://www.youtube.com/watch?v=GY9_Uke6xNY',
        index: 7
      },
      {
        id: '8',
        title: 'Lecture 8 | Calculus Applications',
        url: 'https://www.youtube.com/watch?v=rrx8W89KeKc',
        index: 8
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
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        index: 1
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
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        index: 1
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
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        index: 1
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
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        index: 1
      }
    ]
  },
  physics: {
    title: 'Applied Physics',
    playlistUrl: 'https://youtube.com/playlist?list=PLkZFXMjtq0D2qZB3r1KgpsHOQC1UgVXY2',
    videos: [
      {
        id: '1',
        title: 'Applied Physics Lecture 1 - Introduction to Physics',
        url: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
        index: 1
      },
      {
        id: '2',
        title: 'Applied Physics Lecture 2 - Mechanics and Motion',
        url: 'https://www.youtube.com/watch?v=wWnfJ0-xXRE',
        index: 2
      },
      {
        id: '3',
        title: 'Applied Physics Lecture 3 - Forces and Energy',
        url: 'https://www.youtube.com/watch?v=w4QFJb9a8vo',
        index: 3
      },
      {
        id: '4',
        title: 'Applied Physics Lecture 4 - Thermodynamics',
        url: 'https://www.youtube.com/watch?v=NyOYW07-L5g',
        index: 4
      },
      {
        id: '5',
        title: 'Applied Physics Lecture 5 - Waves and Oscillations',
        url: 'https://www.youtube.com/watch?v=GtXpNm1Vyp4',
        index: 5
      },
      {
        id: '6',
        title: 'Applied Physics Lecture 6 - Electricity and Magnetism',
        url: 'https://www.youtube.com/watch?v=5DMIdsL_KpY',
        index: 6
      },
      {
        id: '7',
        title: 'Applied Physics Lecture 7 - Optics and Light',
        url: 'https://www.youtube.com/watch?v=Iuv6hY6zsd0',
        index: 7
      },
      {
        id: '8',
        title: 'Applied Physics Lecture 8 - Modern Physics',
        url: 'https://www.youtube.com/watch?v=7kb1VT0J3DE',
        index: 8
      }
    ]
  },
  'linear-algebra': {
    title: 'Linear Algebra',
    playlistUrl: 'https://youtube.com/playlist?list=PLxCzCOWd7aiHnkPiCulMX5SIHMl2ZMmzL',
    videos: [
      {
        id: '1',
        title: 'Linear Algebra Lecture 1 - Introduction to Vectors',
        url: 'https://www.youtube.com/watch?v=xyAuNHPsq-g',
        index: 1
      },
      {
        id: '2', 
        title: 'Linear Algebra Lecture 2 - Vector Operations',
        url: 'https://www.youtube.com/watch?v=rHLEWRxRGiM',
        index: 2
      },
      {
        id: '3',
        title: 'Linear Algebra Lecture 3 - Dot Product and Cross Product',
        url: 'https://www.youtube.com/watch?v=WNuIhXo39_k',
        index: 3
      },
      {
        id: '4',
        title: 'Linear Algebra Lecture 4 - Matrix Operations',
        url: 'https://www.youtube.com/watch?v=XkY2DOUCWMU',
        index: 4
      },
      {
        id: '5',
        title: 'Linear Algebra Lecture 5 - Matrix Multiplication',
        url: 'https://www.youtube.com/watch?v=kT4Mp9EdVqs',
        index: 5
      },
      {
        id: '6',
        title: 'Linear Algebra Lecture 6 - Determinants',
        url: 'https://www.youtube.com/watch?v=Ip3X9LOh2dk',
        index: 6
      },
      {
        id: '7',
        title: 'Linear Algebra Lecture 7 - Inverse Matrices',
        url: 'https://www.youtube.com/watch?v=uQhTuRlWMxw',
        index: 7
      },
      {
        id: '8',
        title: 'Linear Algebra Lecture 8 - Systems of Linear Equations',
        url: 'https://www.youtube.com/watch?v=2IdtqGM6KWU',
        index: 8
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
    <SimpleVideoList
      videos={subjectData.videos}
      onBack={handleBack}
      playlistUrl={subjectData.playlistUrl}
      subjectTitle={subjectData.title}
    />
  );
};

export default SubjectStudy; 