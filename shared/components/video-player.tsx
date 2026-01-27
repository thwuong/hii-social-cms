import { Typography } from '@/shared/ui';
import { AlertTriangle, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  className?: string;
  aspectRatio?: 'video' | '9/16' | '16/9' | '1/1';
}

function VideoPlayer({
  url,
  poster,
  title,
  className = '',
  aspectRatio = '16/9',
}: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProgress = (state: any) => {
    if (!seeking) {
      // Check if state has played property (react-player format)
      if (state && typeof state.played === 'number') {
        setPlayed(state.played);
      } else if (playerRef.current) {
        // Fallback: calculate from currentTime and duration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const video = playerRef.current as any;
        if (video.getCurrentTime && video.getDuration) {
          const currentTime = video.getCurrentTime();
          const videoDuration = video.getDuration();
          if (videoDuration > 0) {
            setPlayed(currentTime / videoDuration);
          }
        }
      }
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const target = e.target as HTMLInputElement;
    const seekValue = parseFloat(target.value); // 0-1 (fraction)
    if (playerRef.current && duration > 0) {
      const player = playerRef.current;
      // Convert fraction to seconds: seekValue * duration
      player.currentTime = seekValue * duration;
    }
  };

  const handleDuration = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const dur = (e.target as HTMLVideoElement).duration;
    setDuration(dur);
  };
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!seeking) {
      const player = e.target as HTMLVideoElement;
      if (player.duration > 0) {
        setPlayed(player.currentTime / player.duration);
      }
    }
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleReady = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = (error: unknown) => {
    console.error('VideoPlayer Error:', error);
    console.error('Video URL:', url);
    setHasError(true);
    setIsLoading(false);
  };

  const handleStart = () => {
    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const aspectRatioClass = {
    video: 'aspect-video',
    '9/16': 'aspect-[9/16]',
    '16/9': 'aspect-[16/9]',
    '1/1': 'aspect-square',
  }[aspectRatio];

  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden border border-white/10 bg-black ${aspectRatioClass} ${className}`}
      >
        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
          <Typography variant="small" className="text-zinc-500">
            Không thể tải video
          </Typography>
          {title && (
            <Typography variant="tiny" className="mt-2 text-zinc-600">
              {title}
            </Typography>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden border border-white/10 bg-black ${aspectRatioClass} ${className}`}
    >
      {/* React Player */}
      <ReactPlayer
        ref={playerRef}
        config={{
          hls: {
            enableWorker: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
          },
        }}
        src={url}
        playing={playing}
        volume={volume}
        muted={muted}
        width="100%"
        height="100%"
        onReady={handleReady}
        onError={handleError}
        onProgress={handleProgress}
        onStart={handleStart}
        onDurationChange={handleDuration}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        poster={poster}
      />

      {/* Loading Overlay - Only show when actually loading */}
      {isLoading && !hasError && playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span>ĐANG TẢI VIDEO...</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="h-1 w-full cursor-pointer appearance-none bg-white/20 transition-all hover:h-1.5"
            style={{
              background: `linear-gradient(to right, white 0%, white ${played * 100}%, rgba(255,255,255,0.2) ${played * 100}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4 pb-4">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:text-white"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                className="flex h-8 w-8 items-center justify-center transition-colors hover:text-white"
              >
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1 w-16 cursor-pointer appearance-none bg-white/20"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>

            {/* Time */}
            <div className="font-mono text-xs text-white">
              {formatTime(duration * played)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Fullscreen */}
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:text-white"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
