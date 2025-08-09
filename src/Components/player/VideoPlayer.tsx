import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ChevronLeft,
  RotateCcw,
  RotateCw,
  Subtitles,
  Download,
  Share2,
  Heart,
  Plus,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { fetchMovieDetails } from "../../Services/GlobalApi";
import { cn } from "../../lib/utils";
import toast from "react-hot-toast";

interface QualityOption {
  label: string;
  value: string;
  resolution: string;
}

interface SubtitleTrack {
  label: string;
  language: string;
  src: string;
}

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWatchlist, addToFavorites, isInWatchlist, isInFavorites } =
    useWatchlist();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<QualityOption>({
    label: "Auto",
    value: "auto",
    resolution: "1080p",
  });
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleTrack | null>(
    null,
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Mock data for demonstration
  const qualityOptions: QualityOption[] = [
    { label: "Auto", value: "auto", resolution: "1080p" },
    { label: "1080p", value: "1080", resolution: "1080p" },
    { label: "720p", value: "720", resolution: "720p" },
    { label: "480p", value: "480", resolution: "480p" },
    { label: "360p", value: "360", resolution: "360p" },
  ];

  const subtitleTracks: SubtitleTrack[] = [
    { label: "Off", language: "off", src: "" },
    { label: "English", language: "en", src: "/subtitles/en.vtt" },
    { label: "Spanish", language: "es", src: "/subtitles/es.vtt" },
    { label: "French", language: "fr", src: "/subtitles/fr.vtt" },
  ];

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const { data: movie } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetails(Number(id)),
    enabled: !!id,
  });

  // Video source (in a real app, this would come from your streaming service)
  const videoSrc =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Hide controls after inactivity
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => resetControlsTimeout();
    const handleKeyPress = () => resetControlsTimeout();

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("keypress", handleKeyPress);
    }

    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [isPlaying]);

  const adjustVolume = useCallback((newVolume: number) => {
    if (videoRef.current) {
      const clampedVolume = Math.max(0, Math.min(newVolume, 1));
      videoRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target !== document.body) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(currentTime - 10);
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(currentTime + 10);
          break;
        case "ArrowUp":
          e.preventDefault();
          adjustVolume(Math.min(volume + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          adjustVolume(Math.max(volume - 0.1, 0));
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [currentTime, volume, isFullscreen, seek, toggleFullscreen, toggleMute, togglePlayPause, adjustVolume]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1,
        );
        setBuffered((bufferedEnd / videoRef.current.duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const time = percent * duration;
      seek(time);
    }
  };

  const changeQuality = (quality: QualityOption) => {
    setCurrentQuality(quality);
    toast.success(`Quality changed to ${quality.label}`);
    // In a real app, you would change the video source here
  };

  const changeSubtitle = (subtitle: SubtitleTrack) => {
    setCurrentSubtitle(subtitle);
    toast.success(
      subtitle.language === "off"
        ? "Subtitles disabled"
        : `Subtitles: ${subtitle.label}`,
    );
    // In a real app, you would enable/disable subtitle tracks here
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      toast.success(`Speed: ${speed}x`);
    }
  };

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to watch movies
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black",
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen",
      )}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        poster={
          movie
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : undefined
        }
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none"
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                {movie && (
                  <div>
                    <h1 className="text-white text-lg font-semibold">
                      {movie.title}
                    </h1>
                    <p className="text-white/70 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {movie && (
                  <>
                    <button
                      onClick={() => {
                        if (isInWatchlist(movie.id)) {
                          toast.success("Already in watchlist");
                        } else {
                          addToWatchlist(movie);
                        }
                      }}
                      className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (isInFavorites(movie.id)) {
                          toast.success("Already in favorites");
                        } else {
                          addToFavorites(movie);
                        }
                      }}
                      className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5",
                          isInFavorites(movie.id) &&
                            "fill-current text-red-500",
                        )}
                      />
                    </button>
                    <button className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <button
                  onClick={togglePlayPause}
                  className="p-6 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 transition-colors"
                >
                  <Play className="h-12 w-12 ml-1" />
                </button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
              {/* Progress Bar */}
              <div
                ref={progressRef}
                onClick={handleProgressClick}
                className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer group"
              >
                {/* Buffered */}
                <div
                  className="absolute h-2 bg-white/50 rounded-full"
                  style={{ width: `${buffered}%` }}
                />
                {/* Progress */}
                <div
                  className="relative h-2 bg-primary rounded-full group-hover:h-3 transition-all"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlayPause}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </button>

                  {/* Skip Buttons */}
                  <button
                    onClick={() => seek(currentTime - 10)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => seek(currentTime + 10)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <div className="w-20 h-1 bg-white/30 rounded-full cursor-pointer group">
                      <div
                        className="h-1 bg-white rounded-full group-hover:h-2 transition-all"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Subtitles */}
                  <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
                    <Subtitles className="h-5 w-5" />
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-black/90 backdrop-blur-sm border-l border-white/20 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-lg font-semibold">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quality Settings */}
            <div className="mb-6">
              <h3 className="text-white text-sm font-medium mb-3">Quality</h3>
              <div className="space-y-2">
                {qualityOptions.map((quality) => (
                  <button
                    key={quality.value}
                    onClick={() => changeQuality(quality)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      currentQuality.value === quality.value
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{quality.label}</span>
                      <span className="text-sm opacity-70">
                        {quality.resolution}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Playback Speed */}
            <div className="mb-6">
              <h3 className="text-white text-sm font-medium mb-3">
                Playback Speed
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => changeSpeed(speed)}
                    className={cn(
                      "p-2 rounded-lg text-center text-sm transition-colors",
                      playbackSpeed === speed
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover:bg-white/10 border border-white/20",
                    )}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitles */}
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Subtitles</h3>
              <div className="space-y-2">
                {subtitleTracks.map((track) => (
                  <button
                    key={track.language}
                    onClick={() => changeSubtitle(track)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      currentSubtitle?.language === track.language
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover:bg-white/10",
                    )}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
