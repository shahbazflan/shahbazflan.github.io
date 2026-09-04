export function parseVideoSource(url) {
  if (!url) return { type: 'unknown', id: null, providerName: 'Unknown' };

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      id: youtubeMatch[1],
      providerName: 'YouTube',
      url: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      providerName: 'Vimeo',
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  // Google Drive
  if (url.includes('drive.google.com')) {
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (driveMatch) {
      return {
        type: 'googledrive',
        id: driveMatch[1],
        providerName: 'Google Drive',
        url: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      };
    }
  }

  // Direct video file
  if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
    return {
      type: 'direct',
      id: null,
      providerName: 'Direct Video',
      url,
    };
  }

  // Data URL (uploaded file)
  if (url.startsWith('data:')) {
    return {
      type: 'direct',
      id: null,
      providerName: 'Uploaded Video',
      url,
    };
  }

  return {
    type: 'direct',
    id: null,
    providerName: 'Direct URL',
    url,
  };
}