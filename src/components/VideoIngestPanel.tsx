import React, { useState } from 'react';
import { ArrowRight, Link as LinkIcon, Sparkles, Check, FileText } from 'lucide-react';
import { VideoMetadata } from '../types';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';

interface VideoIngestPanelProps {
  onSelectVideo: (video: VideoMetadata) => void;
  onIngestUrl: (url: string, customTranscript?: string) => Promise<boolean>;
  isLoading: boolean;
  activeVideoId?: string;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const VideoIngestPanel: React.FC<VideoIngestPanelProps> = ({
  onSelectVideo,
  onIngestUrl,
  isLoading,
  activeVideoId,
  isModal = false,
  onCloseModal,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showCustomTranscript, setShowCustomTranscript] = useState(false);
  const [customTranscript, setCustomTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage('Please enter a valid video URL');
      return;
    }
    setErrorMessage('');
    const success = await onIngestUrl(urlInput.trim(), customTranscript.trim() || undefined);
    if (success && isModal && onCloseModal) {
      onCloseModal();
    }
  };

  const handleSelectSample = (video: VideoMetadata) => {
    onSelectVideo(video);
    if (isModal && onCloseModal) {
      onCloseModal();
    }
  };

  const content = (
    <div className="flex flex-col gap-6">
      {/* URL Input Form */}
      <div>
        <label htmlFor="video-url-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Paste Video URL
        </label>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              id="video-url-input"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Optional Transcript toggle */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowCustomTranscript(!showCustomTranscript)}
              className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showCustomTranscript ? 'Hide custom transcript' : 'Add custom transcript / SRT (optional)'}</span>
            </button>
          </div>

          {showCustomTranscript && (
            <textarea
              rows={4}
              placeholder="Paste raw transcript, notes, or subtitles here if available..."
              value={customTranscript}
              onChange={(e) => setCustomTranscript(e.target.value)}
              className="w-full p-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          )}

          {errorMessage && (
            <p className="text-xs text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !urlInput.trim()}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting Content & Vectors...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Index Video</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Preset Library Showcase */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Pre-Indexed Video Library
          </span>
          <span className="text-[11px] text-slate-500">1-click instant test</span>
        </div>

        <div className="flex flex-col gap-2">
          {SAMPLE_VIDEOS.map((sample) => {
            const isSelected = activeVideoId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 group ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="relative w-16 h-10 rounded overflow-hidden shrink-0 bg-slate-950">
                  <img
                    src={sample.thumbnail}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-[9px] font-mono tabular-nums text-slate-300 rounded">
                    {sample.duration}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {sample.title}
                    </h3>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <span>{sample.author}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{sample.transcriptSegments.length} chunks</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white">Ingest New Video Data</h2>
              <p className="text-xs text-slate-400 mt-0.5">Parse subtitles and metadata with zero local video download</p>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="text-slate-400 hover:text-white p-1 text-sm rounded hover:bg-slate-800"
              >
                ✕
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
      <div className="mb-4 pb-3 border-b border-slate-800/80">
        <h3 className="text-sm font-semibold text-white">Ingest Video Data</h3>
        <p className="text-xs text-slate-400 mt-0.5">Parse metadata, build transcript blocks, and embed vector nodes</p>
      </div>
      {content}
    </div>
  );
};
