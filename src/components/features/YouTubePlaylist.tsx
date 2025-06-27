import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, PlayCircle, List } from 'lucide-react';
import YouTubePlayer, { YouTubeVideo } from './YouTubePlayer';

interface YouTubePlaylistProps {
  title: string;
  videos: YouTubeVideo[];
  onBack: () => void;
  playlistUrl?: string;
}

const YouTubePlaylist: React.FC<YouTubePlaylistProps> = ({ 
  title, 
  videos, 
  onBack, 
  playlistUrl 
}) => {
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showEmbedded, setShowEmbedded] = useState(false);

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setShowEmbedded(true);
  };

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              
              <div className="flex items-center gap-3">
                <div className="bg-red-600 rounded-lg p-2">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title} - Video Lectures
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {videos.length} videos available
                  </p>
                </div>
              </div>
            </div>

            {playlistUrl && (
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on YouTube
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player Section */}
        {showEmbedded && selectedVideo && (
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.url)}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-96"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedVideo.title}
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Duration: {selectedVideo.duration}
                  </span>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Video Playlist
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <YouTubePlayer
                key={video.id}
                video={video}
                isSelected={selectedVideo?.id === video.id}
                onClick={() => handleVideoSelect(video)}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <PlayCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No videos available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Videos for this subject will be added soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePlaylist; 