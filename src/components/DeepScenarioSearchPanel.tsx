import React, { useState } from 'react';
import { Search, Compass, ExternalLink, Play, Sparkles, Filter, ShieldCheck, Video, ArrowRight } from 'lucide-react';
import { DeepScenarioSearchResult, VideoMetadata } from '../types';

interface DeepScenarioSearchPanelProps {
  onIngestVideoUrl: (url: string) => Promise<boolean>;
  onSelectLoadedVideo: (video: VideoMetadata) => void;
}

export const DeepScenarioSearchPanel: React.FC<DeepScenarioSearchPanelProps> = ({
  onIngestVideoUrl,
}) => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [includeHidden, setIncludeHidden] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'YouTube',
    'Vimeo',
    'Internet Archive',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DeepScenarioSearchResult[]>([]);
  const [ingestingId, setIngestingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample scenario discovery prompts
  const sampleScenarios = [
    'Unfiltered mechanic teardown of Mercedes 9G-Tronic transmission valve body solenoid failure',
    'Rare 1970s archival footage of Bell Labs Unix developers working on PDP-11 terminals',
    'Low-view experimental mathematics simulation testing Collatz trajectory anomalies',
    'Under-the-radar university lecture on RISC-V open instruction set architecture implementation',
    'Authentic field recording of vintage analog synthesizer calibration and oscilloscope tuning',
  ];

  const handleSearch = async (scenarioToSearch?: string) => {
    const text = scenarioToSearch || scenarioInput;
    if (!text.trim()) {
      setErrorMessage('Please describe the scenario or context you want to search.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/video/deep-scenario-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: text.trim(),
          includeHiddenLowViews: includeHidden,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (data.success && data.results) {
        setResults(data.results);
      } else {
        throw new Error(data.error || 'Deep search failed');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to complete deep scenario search');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngestFoundVideo = async (result: DeepScenarioSearchResult) => {
    setIngestingId(result.id);
    await onIngestVideoUrl(result.url);
    setIngestingId(null);
  };

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Unbiased Deep Scenario Search Engine</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Discover Niche, Low-View & Archival Videos by Scenario Context
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Unlike popularity-biased recommendation algorithms, this search engine performs semantic context retrieval across video platforms (YouTube, Vimeo, Internet Archive) to uncover independent uploads, rare documentation, and long-tail recordings matching your exact scenario.
          </p>

          {/* Scenario Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-3 flex flex-col gap-3"
          >
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Describe the scenario in natural language (e.g. 'Unfiltered independent workshop repair of Mercedes GLS transmission solenoid', 'Archival footage of early MIT AI lab experiments', 'Niche math proof walk-through')..."
                value={scenarioInput}
                onChange={(e) => {
                  setScenarioInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Platforms:</span>
                </span>
                {['YouTube', 'Vimeo', 'Internet Archive'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      selectedPlatforms.includes(p)
                        ? 'bg-blue-600 text-white font-medium'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeHidden}
                    onChange={(e) => setIncludeHidden(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-0"
                  />
                  <span>Prioritize Low-View & Hidden Gems (&lt;10k views)</span>
                </label>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !scenarioInput.trim()}
              className="self-end px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Carrying Out Deep Semantic Search...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Unbiased Scenario Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Sample Scenarios:</span>
            {sampleScenarios.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setScenarioInput(s);
                  handleSearch(s);
                }}
                className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors truncate max-w-[280px]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Area */}
      {isLoading && (
        <div className="py-16 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-xs font-medium text-slate-200">
            Crawling video repositories & archival nodes for scenario matches...
          </div>
          <div className="text-[11px] text-slate-500">
            Filtering out algorithmic bias and prioritizing authentic, low-view long-tail uploads
          </div>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Discovered Videos Matching Scenario ({results.length} results)
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unbiased & Uncensored Indexing</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result) => {
              const isIngestingThis = ingestingId === result.id;
              return (
                <div
                  key={result.id}
                  className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col justify-between gap-4 transition-all group"
                >
                  <div className="space-y-2.5">
                    {/* Platform & Tier info */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                        <span>{result.platform}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400 font-medium">{result.viewCountTier}</span>
                      </div>
                      <span className="font-mono tabular-nums text-emerald-400 text-[11px] font-semibold">
                        {(result.scenarioMatchScore * 100).toFixed(0)}% Match
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {result.title}
                    </h3>

                    <div className="text-xs text-slate-400">
                      <span>Uploader / Channel:</span>{' '}
                      <span className="text-slate-300 font-medium">{result.channelOrAuthor}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-blue-400 font-medium">Why it matches:</span> {result.relevanceExplanation}
                    </p>

                    {result.keyContextSnippet && (
                      <p className="text-[11px] text-slate-400 italic">
                        "{result.keyContextSnippet}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Source Video</span>
                    </a>

                    <button
                      onClick={() => handleIngestFoundVideo(result)}
                      disabled={isIngestingThis}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                    >
                      {isIngestingThis ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Ingesting...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Ingest & Explain Video</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
