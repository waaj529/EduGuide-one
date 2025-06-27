import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleVideoList from '@/components/features/SimpleVideoList';
import { SimpleVideo } from '@/components/features/SimpleVideoList';

// Real video data from provided playlist URLs - Updated with OOP, DSA, and ICT playlists
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
    playlistUrl: 'https://youtube.com/playlist?list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&si=cULScB8M52yRwONP',
    videos: [
      {
        id: '1',
        title: 'ICT Lecture 1',
        url: 'https://www.youtube.com/watch?v=6pRs6o8szWE&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=1&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 1
      },
      {
        id: '2',
        title: 'ICT Lecture 2',
        url: 'https://www.youtube.com/watch?v=3eewoEMYta0&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=2&pp=iAQB',
        index: 2
      },
      {
        id: '3',
        title: 'ICT Lecture 3',
        url: 'https://www.youtube.com/watch?v=b3a4mOcu73U&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=3&pp=iAQB',
        index: 3
      },
      {
        id: '4',
        title: 'ICT Lecture 4',
        url: 'https://www.youtube.com/watch?v=lL5LiDOQ2vE&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=4&pp=iAQB',
        index: 4
      },
      {
        id: '5',
        title: 'ICT Lecture 5',
        url: 'https://www.youtube.com/watch?v=Lfsa31DBYwA&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=5&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 5
      },
      {
        id: '6',
        title: 'ICT Lecture 6',
        url: 'https://www.youtube.com/watch?v=S13zR9FxZJI&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=6&pp=iAQB',
        index: 6
      },
      {
        id: '7',
        title: 'ICT Lecture 7',
        url: 'https://www.youtube.com/watch?v=80fLsAYN0H0&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=7&pp=iAQB',
        index: 7
      },
      {
        id: '8',
        title: 'ICT Lecture 8',
        url: 'https://www.youtube.com/watch?v=saAJadAE1_Y&list=PL9uonUoqng750q0r2r7E-2wNFadPI2c4P&index=8&pp=iAQB',
        index: 8
      }
    ]
  },
  programming: {
    title: 'Programming Fundamentals',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF',
    videos: [
      {
        id: '1',
        title: 'Programming Fundamentals Lecture 1',
        url: 'https://www.youtube.com/watch?v=DHf6EExnAZs&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=1&pp=iAQB',
        index: 1
      },
      {
        id: '2',
        title: 'Programming Fundamentals Lecture 2',
        url: 'https://www.youtube.com/watch?v=8dPLCjuuZsA&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=2&pp=iAQB',
        index: 2
      },
      {
        id: '3',
        title: 'Programming Fundamentals Lecture 3',
        url: 'https://www.youtube.com/watch?v=6eDQhvQqn88&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=3&pp=iAQB',
        index: 3
      },
      {
        id: '4',
        title: 'Programming Fundamentals Lecture 4',
        url: 'https://www.youtube.com/watch?v=hSsHV8NO4O8&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=4&pp=iAQB',
        index: 4
      },
      {
        id: '5',
        title: 'Programming Fundamentals Lecture 5',
        url: 'https://www.youtube.com/watch?v=JlKF1O4I1zA&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=5&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 5
      },
      {
        id: '6',
        title: 'Programming Fundamentals Lecture 6',
        url: 'https://www.youtube.com/watch?v=MgeWxu65lTc&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=6&pp=iAQB',
        index: 6
      },
      {
        id: '7',
        title: 'Programming Fundamentals Lecture 7',
        url: 'https://www.youtube.com/watch?v=C9pyrtoio8E&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=7&pp=iAQB',
        index: 7
      },
      {
        id: '8',
        title: 'Programming Fundamentals Lecture 8',
        url: 'https://www.youtube.com/watch?v=T--pvpqql3M&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=9&pp=iAQB',
        index: 8
      },
      {
        id: '9',
        title: 'Programming Fundamentals Lecture 9',
        url: 'https://www.youtube.com/watch?v=EzTjkch30Qc&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=10&pp=iAQB',
        index: 9
      },
      {
        id: '10',
        title: 'Programming Fundamentals Lecture 10',
        url: 'https://www.youtube.com/watch?v=WUlYaYy4S1Q&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=11&pp=iAQB',
        index: 10
      },
      {
        id: '11',
        title: 'Programming Fundamentals Lecture 11',
        url: 'https://www.youtube.com/watch?v=QXlwXhbGYeo&list=PLgWOIdHQBEz5VmgyZ4IoByOHidsX4lpVF&index=12&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 11
      }
    ]
  },
  oop: {
    title: 'Object Oriented Programming',
    playlistUrl: 'https://youtube.com/playlist?list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&si=OuU-_n-gNF3X2qKv',
    videos: [
      {
        id: '1',
        title: 'OOP Lecture 1',
        url: 'https://www.youtube.com/watch?v=nGJTWaaFdjc&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=1&pp=iAQB',
        index: 1
      },
      {
        id: '2',
        title: 'OOP Lecture 2',
        url: 'https://www.youtube.com/watch?v=d363dW0AeS8&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=2&pp=iAQB',
        index: 2
      },
      {
        id: '3',
        title: 'OOP Lecture 3',
        url: 'https://www.youtube.com/watch?v=d363dW0AeS8&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=3&pp=iAQB',
        index: 3
      },
      {
        id: '4',
        title: 'OOP Lecture 4',
        url: 'https://www.youtube.com/watch?v=qq05D2yFIHA&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=4&pp=iAQB',
        index: 4
      },
      {
        id: '5',
        title: 'OOP Lecture 5',
        url: 'https://www.youtube.com/watch?v=QcLI2zGVYFo&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=5&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 5
      },
      {
        id: '6',
        title: 'OOP Lecture 6',
        url: 'https://www.youtube.com/watch?v=aKnc1A5NOKo&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=6&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 6
      },
      {
        id: '7',
        title: 'OOP Lecture 7',
        url: 'https://www.youtube.com/watch?v=HK6gnkQIgqI&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=7&pp=iAQB',
        index: 7
      },
      {
        id: '8',
        title: 'OOP Lecture 8',
        url: 'https://www.youtube.com/watch?v=Tk-4KUoatg8&list=PLISTUNloqsz0z9JJJke7g7PxRLvy6How9&index=8&pp=iAQB',
        index: 8
      }
    ]
  },
  'data-structures': {
    title: 'Data Structure and Algorithms',
    playlistUrl: 'https://youtube.com/playlist?list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&si=YzJMjo1Mvw8BMvGP',
    videos: [
      {
        id: '1',
        title: 'DSA Lecture 1',
        url: 'https://www.youtube.com/watch?v=5_5oE5lgrhw&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=1&pp=iAQB',
        index: 1
      },
      {
        id: '2',
        title: 'DSA Lecture 2',
        url: 'https://www.youtube.com/watch?v=vgSKOMsjLbc&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=2&pp=iAQB',
        index: 2
      },
      {
        id: '3',
        title: 'DSA Lecture 3',
        url: 'https://www.youtube.com/watch?v=1OTX-WXQHCQ&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=3&pp=iAQB',
        index: 3
      },
      {
        id: '4',
        title: 'DSA Lecture 4',
        url: 'https://www.youtube.com/watch?v=5g7K86jYto8&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=4&pp=iAQB',
        index: 4
      },
      {
        id: '5',
        title: 'DSA Lecture 5',
        url: 'https://www.youtube.com/watch?v=STL8ESuETmM&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=5&pp=iAQB',
        index: 5
      },
      {
        id: '6',
        title: 'DSA Lecture 6',
        url: 'https://www.youtube.com/watch?v=bR0NYdmMg94&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=6&pp=iAQB',
        index: 6
      },
      {
        id: '7',
        title: 'DSA Lecture 7',
        url: 'https://www.youtube.com/watch?v=-sktNalfrE0&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=7&pp=iAQB0gcJCc4JAYcqIYzv',
        index: 7
      },
      {
        id: '8',
        title: 'DSA Lecture 8',
        url: 'https://www.youtube.com/watch?v=JqvobBKLHwU&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&index=8&pp=iAQB',
        index: 8
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