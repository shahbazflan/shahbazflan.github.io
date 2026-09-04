import React, { useState, useEffect, useRef } from 'react';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import {
  Upload,
  Sparkles,
  X,
  Check,
  Film,
  Play,
  RotateCcw,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  AlertCircle,
  Trash2,
  Camera,
  Eye,
  RefreshCw,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseVideoSource } from '../utils/videoHelper';

const DEFAULT_SHOWREEL_CONFIG = {
  id: 'showreel-main',
  title: 'CINEMATIC SYNTHESIS',
  subtitle: '2024–2025 Motion & Generative Reel',
  description:
    'Watch a curated compilation of UAE brand anthems, AI-generated cinematography passes, and high-frequency kinetic typography synthesized for immersive screens.',
  videoUrl:
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  year: '2025',
  duration: '1:45',
  tools: ['Higgsfield', 'Seedance 2.5', 'Kling AI', 'After Effects', 'Premiere Pro'],
  metrics: {
    efficiency: '3.5x faster visual development pipeline',
    reach: '500,000+ Broadcast & Event Views',
    turnaround: '4K Multi-format Delivery',
  },
};

const SHOWREEL_THUMBNAIL_PRESETS = [
  {
    label: 'UAE Skyline Anthem',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    desc: 'Futuristic architectural skyline',
  },
  {
    label: 'Cyberpunk Neon',
    url: 'https://images.unsplash.com/photo-1535615615570-3b839f4359be?auto=format&fit=crop&w=1600&q=80',
    desc: 'Volumetric kinetic lighting',
  },
  {
    label: 'Liquid AI Forms',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    desc: 'Generative fluid synthesis',
  },
  {
    label: 'Kinetic Wireframe',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    desc: 'Spatial 3D geometric grid',
  },
  {
    label: 'Monochrome Cinema',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    desc: 'Pure high-contrast black & white',
  },
];

const STORAGE_KEY_SHOWREEL = 'shahbaz_cinematic_synthesis_reel_v1';

export const FeaturedShowreel = ({
  onOpenBreakdown,
  isAdminMode = false,
}) => {
  const [showreel, setShowreel] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHOWREEL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.videoUrl) {
          return { ...DEFAULT_SHOWREEL_CONFIG, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to load showreel config from localStorage', e);
    }
    return DEFAULT_SHOWREEL_CONFIG;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState(showreel.title);
  const [tempSubtitle, setTempSubtitle] = useState(showreel.subtitle);
  const [tempDescription, setTempDescription] = useState(showreel.description);
  const [tempVideoUrl, setTempVideoUrl] = useState(showreel.videoUrl);
  const [tempThumbnailUrl, setTempThumbnailUrl] = useState(showreel.thumbnailUrl);
  const [tempDuration, setTempDuration] = useState(showreel.duration);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [thumbnailLoadError, setThumbnailLoadError] = useState(false);
  const [isCapturingFrame, setIsCapturingFrame] = useState(false);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [modalPreviewTab, setModalPreviewTab] = useState('thumbnail');
  const [playerRevision, setPlayerRevision] = useState(0);

  const videoFileInputRef = useRef(null);
  const thumbFileInputRef = useRef(null);

  const handleOpenModal = () => {
    setTempTitle(showreel.title);
    setTempSubtitle(showreel.subtitle);
    setTempDescription(showreel.description);
    setTempVideoUrl(showreel.videoUrl);
    setTempThumbnailUrl(showreel.thumbnailUrl);
    setTempDuration(showreel.duration);
    setThumbnailLoadError(false);
    setModalPreviewTab('thumbnail');
    setIsEditModalOpen(true);
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingMedia(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      setTempVideoUrl(result);
      setIsProcessingMedia(false);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      setTempThumbnailUrl(result);
      setThumbnailLoadError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbDrop = (e) => {
    e.preventDefault();
    setIsDraggingThumb(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result;
        setTempThumbnailUrl(res);
        setThumbnailLoadError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const parsedTempVideo = parseVideoSource(tempVideoUrl);

  const handleExtractYouTubeThumbnail = () => {
    if (parsedTempVideo.type === 'youtube' && parsedTempVideo.id) {
      const hdUrl = `https://img.youtube.com/vi/${parsedTempVideo.id}/maxresdefault.jpg`;
      setTempThumbnailUrl(hdUrl);
      setThumbnailLoadError(false);
      setModalPreviewTab('thumbnail');
    }
  };

  const handleCaptureFrame = () => {
    if (!tempVideoUrl) return;
    setIsCapturingFrame(true);
    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = tempVideoUrl;
      video.muted = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.5, (video.duration || 3) / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setTempThumbnailUrl(dataUrl);
            setThumbnailLoadError(false);
            setModalPreviewTab('thumbnail');
          }
        } catch (err) {
          console.warn('Canvas frame capture restricted:', err);
          alert('Could not capture frame from remote URL due to browser cross-origin policy. You can upload an image or pick a preset!');
        } finally {
          setIsCapturingFrame(false);
        }
      };

      video.onerror = () => {
        setIsCapturingFrame(false);
        alert('Could not load video for frame capture. Please upload an image file or choose a preset.');
      };
    } catch (e) {
      setIsCapturingFrame(false);
    }
  };

  const handleSaveShowreel = (e) => {
    e.preventDefault();
    if (!tempVideoUrl.trim()) {
      alert('Please provide a valid video URL or upload a video file.');
      return;
    }

    const updated = {
      ...showreel,
      title: tempTitle.trim() || 'CINEMATIC SYNTHESIS',
      subtitle: tempSubtitle.trim() || '2024–2025 Motion & Generative Reel',
      description: tempDescription.trim() || showreel.description,
      videoUrl: tempVideoUrl.trim(),
      thumbnailUrl: tempThumbnailUrl.trim() || showreel.thumbnailUrl,
      duration: tempDuration.trim() || '1:45',
    };

    setShowreel(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SHOWREEL, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to persist showreel config', err);
    }

    setPlayerRevision((prev) => prev + 1);
    setIsEditModalOpen(false);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#38bdf8', '#ffffff'],
    });
  };

  const handleResetToDefault = () => {
    if (confirm('Reset Showreel back to the original Cinematic Synthesis sample reel?')) {
      setShowreel(DEFAULT_SHOWREEL_CONFIG);
      try {
        localStorage.removeItem(STORAGE_KEY_SHOWREEL);
      } catch (err) {
        console.warn(err);
      }
      setPlayerRevision((prev) => prev + 1);
      setIsEditModalOpen(false);
    }
  };

  const videoSourceInfo = parseVideoSource(showreel.videoUrl);

  return (
    <section id="showreel" className="relative py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
              {showreel.subtitle}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-black text-white tracking-tight uppercase inline-block pr-3 overflow-visible">
            {showreel.title}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-xs sm:text-sm text-white/60 max-w-md font-light leading-relaxed">
            {showreel.description}
          </p>

          {isAdminMode && (
            <button
              id="edit-showreel-video-btn"
              type="button"
              onClick={handleOpenModal}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:border-amber-400 cursor-pointer"
              title="Update Showreel Video & Cover Thumbnail"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Edit Showreel &amp; Thumbnail</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl animated-box-frame shadow-[0_0_60px_rgba(34,211,238,0.1)] transition-all group">
        {isAdminMode && (
          <button
            type="button"
            onClick={handleOpenModal}
            className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/90 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/50 text-xs font-mono uppercase tracking-wider backdrop-blur-md shadow-xl cursor-pointer"
            title="Directly update this Showreel video and cover thumbnail"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Edit Video &amp; Thumbnail</span>
          </button>
        )}

        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
          <UniversalVideoPlayer
            key={`showreel-player-${playerRevision}-${showreel.videoUrl}`}
            videoUrl={showreel.videoUrl}
            thumbnailUrl={showreel.thumbnailUrl}
            title={showreel.title}
            autoPlay={false}
            muted={false}
            loop={true}
            showProviderBadge={true}
            showExternalLink={true}
          />
        </div>

        <div className="p-4 sm:p-5 bg-black/75 border-t border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 border border-white/10 text-cyan-400 font-bold">
              Independent Showreel
            </span>
            <span className="text-white/80 font-medium truncate max-w-md">
              {showreel.title} ({showreel.duration})
            </span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-[11px] font-mono text-cyan-300/80">
              Provider: {videoSourceInfo.type.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdminMode && (
              <button
                type="button"
                onClick={handleOpenModal}
                className="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3 text-amber-400" />
                <span>Edit Video &amp; Poster</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdminMode && isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-[#080d1a] border border-amber-500/40 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-black to-cyan-950/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Film className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                    Edit Showreel Video &amp; Cover Poster
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Cinematic Thesis / Synthesis Reel • Independent Media &amp; Thumbnail
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShowreel} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Showreel Video URL or File (Required)
                  </span>
                  <span className="text-[10px] text-white/50 lowercase">
                    youtube, drive, vimeo, or direct .mp4
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tempVideoUrl}
                      onChange={(e) => setTempVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => videoFileInputRef.current?.click()}
                    disabled={isProcessingMedia}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isProcessingMedia ? 'Loading...' : 'Upload File'}</span>
                  </button>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Cover Poster &amp; Thumbnail
                  </label>
                  <span className="text-[10px] text-white/50 font-mono">
                    16:9 HD • Shown before playback starts
                  </span>
                </div>

                {parsedTempVideo.type === 'youtube' && parsedTempVideo.id && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-red-200">
                      <Film className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>YouTube link detected. Would you like to use its official HD poster?</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleExtractYouTubeThumbnail}
                      className="shrink-0 px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Use YouTube Poster</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={tempThumbnailUrl}
                      onChange={(e) => {
                        setTempThumbnailUrl(e.target.value);
                        setThumbnailLoadError(false);
                      }}
                      placeholder="https://images.unsplash.com/... or upload file"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => thumbFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      title="Upload local image file"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload Image</span>
                    </button>
                    <input
                      ref={thumbFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-1.5">
                    Showreel Title
                  </label>
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    placeholder="CINEMATIC SYNTHESIS"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-1.5">
                    Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    value={tempSubtitle}
                    onChange={(e) => setTempSubtitle(e.target.value)}
                    placeholder="2024–2025 Motion & Generative Reel"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/80 mb-1.5">
                  Reel Overview / Copy
                </label>
                <textarea
                  rows={2}
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  placeholder="Watch a curated compilation of UAE brand anthems..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-white/50 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Reel</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.35)] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save &amp; Apply Reel</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};