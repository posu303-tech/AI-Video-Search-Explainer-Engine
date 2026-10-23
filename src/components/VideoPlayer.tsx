import React, { useMemo } from 'react';
import { ExternalLink, Clock, Play } from 'lucide-react';
import { VideoMetadata } from '../types';

interface VideoPlayerProps {
  video: VideoMetadata;
  seekTime: number | null;
  onClearSeek: () => void;
  onTimeClick: (sec: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  seekTime,
  onTimeClick,
}) => {
  // Extract YouTube ID if present
  const youtubeId = useMemo(() => {
    if (video.id && video.id.length === 11 && !video.id.includes('http')) {
      return video.id;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = video.url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [video.id, video.url]);

  // Construct iframe embed src with start parameter if seekTime is active
  const embedUrl = useMemo(() => {
    if (!youtubeId) return null;
    const startParam = seekTime !== null && seekTime > 0 ? `&start=${Math.floor(seekTime)}` : '';
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1${startParam}`;
  }, [youtubeId, seekTime]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {youtubeId && embedUrl ? (
          <iframe
            key={`${youtubeId}-${seekTime || 0}`}
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : video.thumbnail ? (
          <div className="relative w-full h-full">
            <img
              src={video.thumbnail}
              alt={video.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
              <a
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <Play className="w-6 h-6 ml-0.5" />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-slate-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Video source stream preview ready</span>
          </div>
        )}
      </div>

      {/* Video Metadata Header: Clean unboxed text with typographic separators */}
      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-white tracking-tight leading-snug line-clamp-2">
            {video.title}
          </h2>
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Open original video source"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-300">{video.author}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{video.duration || '00:00'}</span>
          {video.viewCount && (
            <>
              <span aria-hidden="true">·</span>
              <span>{video.viewCount}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-medium">Indexed & Vector Ready</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-1">
          {video.description}
        </p>

        {/* Quick Timeline Scrub Bar */}
        {video.structuralTimeline && video.structuralTimeline.length > 0 && (
          <div className="mt-2 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
              Key Chapter Milestones
            </div>
            <div className="flex flex-wrap gap-1.5">
              {video.structuralTimeline.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onTimeClick(item.timeSec)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="font-mono tabular-nums text-blue-400 text-[11px]">
                    {item.timestamp}
                  </span>
                  <span className="truncate max-w-[130px]">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
