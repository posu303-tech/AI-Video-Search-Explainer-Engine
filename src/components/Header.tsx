import React from 'react';
import { PlaySquare, Sparkles, Code2, Network, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workspace' | 'vector-graph' | 'transcript' | 'starter-kit';
  onTabChange: (tab: 'workspace' | 'vector-graph' | 'transcript' | 'starter-kit') => void;
  onOpenIngest: () => void;
  videoTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenIngest,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <PlaySquare className="w-4 h-4" />
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('workspace');
            }}
            className="text-base font-semibold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-300 transition-colors"
          >
            VideoExplainer<span className="text-blue-500">.Engine</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onTabChange('workspace')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'workspace' ? 'text-white border-b-2 border-blue-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => onTabChange('vector-graph')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'vector-graph' ? 'text-white border-b-2 border-blue-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Semantic Vector Graph</span>
          </button>

          <button
            onClick={() => onTabChange('transcript')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'transcript' ? 'text-white border-b-2 border-blue-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript Stream</span>
          </button>

          <button
            onClick={() => onTabChange('starter-kit')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'starter-kit' ? 'text-white border-b-2 border-blue-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitHub Starter Kit</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenIngest}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            Ingest Video
          </button>
        </div>
      </div>
    </header>
  );
};
