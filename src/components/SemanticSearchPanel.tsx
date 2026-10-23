import React, { useState } from 'react';
import { Search, Play, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SemanticSearchResult, VideoMetadata } from '../types';

interface SemanticSearchPanelProps {
  video: VideoMetadata;
  onSearch: (query: string) => Promise<SemanticSearchResult | null>;
  onTimeClick: (sec: number) => void;
  activeResult: SemanticSearchResult | null;
  isLoading: boolean;
}

export const SemanticSearchPanel: React.FC<SemanticSearchPanelProps> = ({
  video,
  onSearch,
  onTimeClick,
  activeResult,
  isLoading,
}) => {
  const [query, setQuery] = useState('');

  // Sample prompt recommendations tailored to active video
  const suggestedQueries = React.useMemo(() => {
    if (video.id === 'zjkBMFhNj_g') {
      return [
        'How does pretraining compress internet tokens?',
        'What is the difference between base model and RLHF alignment?',
        'What causes prompt injection vulnerabilities?'
      ];
    }
    if (video.id === 'aircAruvnKk') {
      return [
        'How are 28x28 pixels mapped to input neurons?',
        'What is the purpose of weights and biases?',
        'How does the sigmoid squashing function work?'
      ];
    }
    if (video.id === 'UF8uR6Z6KLc') {
      return [
        'How did typography and calligraphy inspire the Mac?',
        'What was Steve Jobs reaction to getting fired from Apple?',
        'What did Jobs say about death as a change agent?'
      ];
    }
    if (video.id === '094y1Z2wpJg') {
      return [
        'What are the rules of the 3n + 1 problem?',
        'Why does number 27 take 111 steps?',
        'What did Terence Tao prove about Collatz orbits?'
      ];
    }
    return [
      'What are the core conclusions of this talk?',
      'Explain the main technique demonstrated in the video.',
      'What are the primary challenges discussed?'
    ];
  }, [video.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    await onSearch(query.trim());
  };

  const handleSuggestedClick = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Query Internal Video Elements</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Ask natural language questions to search through transcript blocks and semantic vector nodes
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Ask a question about this video's contents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-24 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute inset-y-1 right-1 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-full px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Search</span>
                <CornerDownLeft className="w-3 h-3 opacity-70" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Questions (interactive filter controls) */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
        {suggestedQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestedClick(item)}
            className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 transition-colors truncate max-w-[280px]"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Search Result Display */}
      {isLoading && (
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-3 text-xs text-slate-400">
          <span className="w-4 h-4 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin" />
          <span>Searching semantic vector nodes and retrieving matched timestamps...</span>
        </div>
      )}

      {activeResult && !isLoading && (
        <div className="p-4 bg-slate-950/70 border border-blue-900/40 rounded-lg flex flex-col gap-3.5">
          {/* Answer synthesis */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-blue-400">Synthesized Semantic Answer</span>
              <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                {(activeResult.confidence * 100).toFixed(0)}% semantic match
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeResult.synthesizedAnswer}
            </p>
          </div>

          {/* Matched Segments List */}
          {activeResult.matchedSegments && activeResult.matchedSegments.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Grounded Video Source Segments
              </div>
              <div className="flex flex-col gap-2">
                {activeResult.matchedSegments.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums text-xs font-semibold text-blue-400">
                          [{item.segment.timestamp}]
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.matchReason}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        "{item.segment.text}"
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTimeClick(item.segment.start)}
                      className="shrink-0 self-start sm:self-center px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Jump to Time</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
