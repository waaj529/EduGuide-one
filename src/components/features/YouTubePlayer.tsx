import React, { useState } from 'react';
import { Play, ExternalLink, Clock } from 'lucide-react';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
}

interface YouTubePlayerProps {
  video: YouTubeVideo;
  isSelected?: boolean;
  onClick: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video, isSelected, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(video.url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`glass-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500' : ''
    }`}>
      {/* Video Thumbnail */}
      <div className="relative group cursor-pointer" onClick={onClick}>
        <img 
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setIsLoading(false)}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-3">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-white text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <button
            onClick={onClick}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1"
          >
            <Play className="w-4 h-4" />
            Watch Video
          </button>
          
          <a 
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer; 