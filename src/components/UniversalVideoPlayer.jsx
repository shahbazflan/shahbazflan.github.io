import React, { useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { parseVideoSource } from '../utils/videoHelper';

export const UniversalVideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  title = 'Video Player',
  autoPlay = false,
  muted = true,
  loop = true,
  showProviderBadge = true,
  showExternalLink = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const videoSource = parseVideoSource(videoUrl);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // YouTube embed
  if (videoSource.type === 'youtube') {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden group">
        <iframe
          className="w-full h-full"
          src={`${videoSource.url}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {showProviderBadge && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded z-10">
            YouTube
          </div>
        )}
      </div>
    );
  }

  // Vimeo embed
  if (videoSource.type === 'vimeo') {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden group">
        <iframe
          className="w-full h-full"
          src={`${videoSource.url}?autoplay=${isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {showProviderBadge && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded z-10">
            Vimeo
          </div>
        )}
      </div>
    );
  }

  // Direct video file or data URL
  return (
    <div className="relative w-full h-full bg-black overflow-hidden group">
      <video
        key={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        controls
        poster={thumbnailUrl}
      >
        <source src={videoUrl} />
        Your browser does not support the video tag.
      </video>

      {showProviderBadge && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-600 text-black text-xs font-bold rounded z-10">
          {videoSource.providerName}
        </div>
      )}
    </div>
  );
};