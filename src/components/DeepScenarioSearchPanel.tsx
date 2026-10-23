import React, { useState } from 'react';
import { Search, Compass, ExternalLink, Play, Filter, ShieldCheck, Video, ArrowRight, Archive, Globe } from 'lucide-react';
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
  const [sourceFilter, setSourceFilter] = useState<'all' | 'non-youtube' | 'youtube'>('non-youtube');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'Internet Archive',
    'Vimeo',
    'Dailymotion',
    'PeerTube',
    'Web Archives',
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

  const handleSearch = async (scenarioToSearch?: string, overrideFilter?: 'all' | 'non-youtube' | 'youtube') => {
    const text = scenarioToSearch || scenarioInput;
    const activeFilter = overrideFilter || sourceFilter;
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
          platforms: activeFilter === 'non-youtube' 
            ? ['Internet Archive', 'Vimeo', 'Dailymotion', 'PeerTube', 'Web Archives']
            : selectedPlatforms,
          sourceFilter: activeFilter,
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

  // Filter displayed results based on current sourceFilter segregation
  const displayedResults = React.useMemo(() => {
    if (sourceFilter === 'non-youtube') {
      return results.filter((r) => {
        const u = (r.url || '').toLowerCase();
        const p = (r.platform || '').toLowerCase();
        return !u.includes('youtube.com') && !u.includes('youtu.be') && !p.includes('youtube');
      });
    }
    if (sourceFilter === 'youtube') {
      return results.filter((r) => {
        const u = (r.url || '').toLowerCase();
        const p = (r.platform || '').toLowerCase();
        return u.includes('youtube.com') || u.includes('youtu.be') || p.includes('youtube');
      });
    }
    return results;
  }, [results, sourceFilter]);

  const nonYoutubeCount = results.filter((r) => {
    const u = (r.url || '').toLowerCase();
    const p = (r.platform || '').toLowerCase();
    return !u.includes('youtube.com') && !u.includes('youtu.be') && !p.includes('youtube');
  }).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Unbiased Deep Scenario Search Engine</span>
            </div>

            {/* Prominent Source Segregation Mode Tag */}
            {sourceFilter === 'non-youtube' && (
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Archive className="w-3.5 h-3.5" />
                <span>Non-YouTube Sources Segregated</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Discover Niche, Low-View & Archival Videos by Scenario Context
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Search beyond mainstream popularity algorithms. Use the source segregation controls below to isolate 
            <span className="text-amber-400 font-medium"> non-YouTube archives</span> (Internet Archive, Vimeo, Dailymotion, PeerTube, university labs) or search across all platforms simultaneously.
          </p>

          {/* Primary Source Segregation Buttons (Requested Feature) */}
          <div className="mt-2 flex flex-wrap items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 font-medium px-2">Source Segregation:</span>
            
            <button
              type="button"
              onClick={() => {
                setSourceFilter('non-youtube');
                if (scenarioInput.trim()) {
                  handleSearch(scenarioInput, 'non-youtube');
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                sourceFilter === 'non-youtube'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30'
                  : 'bg-slate-900 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-900/60'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Segregate Non-YouTube Sources (Archive.org, Vimeo, etc.)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSourceFilter('all');
                if (scenarioInput.trim()) {
                  handleSearch(scenarioInput, 'all');
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                sourceFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Sources Combined</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSourceFilter('youtube');
                if (scenarioInput.trim()) {
                  handleSearch(scenarioInput, 'youtube');
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                sourceFilter === 'youtube'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>YouTube Only</span>
            </button>
          </div>

          {/* Scenario Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-2 flex flex-col gap-3"
          >
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Describe the scenario in natural language (e.g. 'Rare 1970s footage of Bell Labs Unix developers working on PDP-11', 'Unfiltered independent workshop repair of Mercedes transmission solenoid', 'Niche mathematics simulation of Collatz anomaly')..."
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
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={includeHidden}
                    onChange={(e) => setIncludeHidden(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-0"
                  />
                  <span>Prioritize Low-View &amp; Rare Archival Recordings (&lt;10k views)</span>
                </label>
              </div>

              <span className="text-[11px] text-slate-400">
                Active Source Filter: <strong className="text-slate-200">{sourceFilter === 'non-youtube' ? 'Non-YouTube Archives Only' : sourceFilter === 'youtube' ? 'YouTube Only' : 'All Sources'}</strong>
              </span>
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
                  <span>Searching {sourceFilter === 'non-youtube' ? 'Non-YouTube Repositories' : 'Sources'}...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search {sourceFilter === 'non-youtube' ? 'Non-YouTube Video Sources' : 'Videos'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
            Crawling {sourceFilter === 'non-youtube' ? 'Internet Archive, Vimeo & alternative repositories' : 'video repositories'} for scenario matches...
          </div>
          <div className="text-[11px] text-slate-500">
            Filtering out algorithmic bias and prioritizing authentic, low-view long-tail uploads
          </div>
        </div>
      )}

      {!isLoading && displayedResults.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Discovered Videos ({displayedResults.length} {sourceFilter === 'non-youtube' ? 'Non-YouTube results' : 'results'})
              </span>
              {sourceFilter === 'non-youtube' && (
                <span className="text-[11px] text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60 font-medium">
                  YouTube Excluded
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSourceFilter(sourceFilter === 'non-youtube' ? 'all' : 'non-youtube')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {sourceFilter === 'non-youtube' ? 'Show All Sources' : `Segregate Non-YouTube Only (${nonYoutubeCount})`}
              </button>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Unbiased &amp; Uncensored Indexing</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedResults.map((result) => {
              const isIngestingThis = ingestingId === result.id;
              const isYouTube = (result.url || '').includes('youtube') || (result.platform || '').toLowerCase().includes('youtube');

              return (
                <div
                  key={result.id}
                  className={`p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all group ${
                    !isYouTube 
                      ? 'bg-slate-900/80 border-amber-900/40 hover:border-amber-700/60 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Platform & Tier info */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                        {!isYouTube ? (
                          <Archive className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Video className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span className={!isYouTube ? "text-amber-300 font-semibold" : ""}>{result.platform}</span>
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
                      <span>Uploader / Repository:</span>{' '}
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
                      <span>Open on {result.platform}</span>
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
                          <span>Ingest &amp; Explain Video</span>
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

      {!isLoading && results.length > 0 && displayedResults.length === 0 && (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
          <p className="text-xs text-slate-400">
            Current results contain {results.length} videos, but all were from YouTube.
          </p>
          <button
            onClick={() => handleSearch(scenarioInput, 'non-youtube')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg"
          >
            Run Deep Search for Non-YouTube Repositories (Internet Archive, Vimeo)
          </button>
        </div>
      )}
    </div>
  );
};
