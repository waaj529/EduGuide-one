import React, { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export interface SimpleVideo {
  id: string;
  title: string;
  url: string;
  index: number;
}

interface SimpleVideoListProps {
  videos: SimpleVideo[];
  onBack: () => void;
  playlistUrl?: string;
  subjectTitle: string;
}

const SimpleVideoList: React.FC<SimpleVideoListProps> = ({ 
  videos, 
  onBack, 
  playlistUrl,
  subjectTitle 
}) => {
  const [selectedVideo, setSelectedVideo] = useState<SimpleVideo | null>(null);

  const getVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : '';
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = getVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const handleVideoClick = (video: SimpleVideo) => {
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Video Player */}
        {selectedVideo && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.url)}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-96"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Simple Video List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  selectedVideo?.id === video.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="flex items-start gap-4">
                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={getThumbnailUrl(video.url)}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </div>
                  
                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {video.index}. {video.title}
                    </p>
                  </div>

                  {/* External Link */}
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
            
            {/* Full Playlist Link */}
            {playlistUrl && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Playlist on YouTube
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoList; 