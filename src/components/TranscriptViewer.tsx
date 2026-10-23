import React, { useState } from 'react';
import { Search, Play, Copy, Check, Download } from 'lucide-react';
import { TranscriptSegment } from '../types';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  onTimeClick: (sec: number) => void;
  activeTimeSec?: number | null;
  videoTitle: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  onTimeClick,
  activeTimeSec,
  videoTitle,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSegments = React.useMemo(() => {
    if (!filterQuery.trim()) return segments;
    const q = filterQuery.toLowerCase();
    return segments.filter(
      (s) =>
        s.text.toLowerCase().includes(q) ||
        (s.keywords && s.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }, [segments, filterQuery]);

  const handleCopyAll = () => {
    const text = segments.map((s) => `[${s.timestamp}] ${s.text}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = segments.map((s) => `[${s.timestamp}] ${s.text}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm font-semibold text-white">Full Video Transcript Stream</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed sequential speech blocks with millisecond-accurate seek coordinates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
            title="Copy full transcript"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy All'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
            title="Download TXT file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXT</span>
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          placeholder="Filter transcript dialogue lines..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Segments Stream */}
      <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredSegments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No transcript segments match "{filterQuery}".
          </div>
        ) : (
          filteredSegments.map((segment) => {
            const isActive =
              activeTimeSec !== null &&
              activeTimeSec !== undefined &&
              activeTimeSec >= segment.start &&
              activeTimeSec <= segment.end;

            return (
              <div
                key={segment.id}
                className={`p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 ${
                  isActive
                    ? 'bg-blue-950/40 border-blue-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onTimeClick(segment.start)}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono tabular-nums font-semibold"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>[{segment.timestamp}]</span>
                  </button>

                  {/* Clean unboxed tags with typographic separators */}
                  {segment.keywords && segment.keywords.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-[60%]">
                      {segment.keywords.map((kw, i) => (
                        <React.Fragment key={i}>
                          <span>{kw}</span>
                          {i < segment.keywords!.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-slate-300 leading-relaxed font-sans">
                  {segment.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
