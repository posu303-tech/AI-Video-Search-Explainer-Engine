import React, { useState } from 'react';
import { Copy, Check, Download, GitBranch, ExternalLink, Terminal, Database, FileCode } from 'lucide-react';
import { STARTER_REPO_FILES, StarterRepoFile } from '../data/starterRepo';

interface GitHubStarterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubStarterModal: React.FC<GitHubStarterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<StarterRepoFile>(STARTER_REPO_FILES[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'files' | 'deployment' | 'qdrant'>('files');

  if (!isOpen) return null;

  const handleCopyFile = (file: StarterRepoFile) => {
    navigator.clipboard.writeText(file.content);
    setCopiedFile(file.path);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadFile = (file: StarterRepoFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                GitHub & Streamlit Cloud Starter Template
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to push to GitHub and deploy to Streamlit Community Cloud in 2 minutes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs (Interactive segmented buttons) */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Project Files</span>
            </button>

            <button
              onClick={() => setActiveTab('deployment')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'deployment'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Deploy Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('qdrant')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'qdrant'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Qdrant Multi-Video DB</span>
            </button>
          </div>

          <a
            href="https://share.streamlit.io"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0"
          >
            <span>Open Streamlit Cloud</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* File List Sidebar */}
              <div className="md:col-span-1 flex flex-col gap-1.5 border-r border-slate-800 pr-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Repository Files
                </span>
                {STARTER_REPO_FILES.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                      selectedFile.path === file.path
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{file.language}</span>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="md:col-span-3 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs text-blue-400 font-semibold">
                      {selectedFile.path}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedFile.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyFile(selectedFile)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                    >
                      {copiedFile === selectedFile.path ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadFile(selectedFile)}
                      className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="relative bg-slate-950 rounded-xl border border-slate-800/80 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                  <pre>{selectedFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="max-w-3xl mx-auto space-y-6 text-sm">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">How to Deploy to GitHub & Streamlit Cloud</h3>
                <p className="text-xs text-slate-400">
                  Follow these 4 simple steps to have this exact video search & explainer engine live on the web:
                </p>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    <span>Step 1. Initialize Local Project Directory</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Create the files on your machine matching the repository structure:
                  </p>
                  <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`mkdir my-video-search-engine
cd my-video-search-engine
mkdir .streamlit`}
                  </pre>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    <span>Step 2. Paste Core Files</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Download or copy <code className="text-blue-400">app.py</code>, <code className="text-blue-400">requirements.txt</code>, and <code className="text-blue-400">.streamlit/config.toml</code> from the "Project Files" tab into your directory.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    <span>Step 3. Push to GitHub</span>
                  </div>
                  <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`git init
git add .
git commit -m "feat: initial open-source AI video explainer engine"
git branch -M main
git remote add origin https://github.com/your-username/my-video-search-engine.git
git push -u origin main`}
                  </pre>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    <span>Step 4. Deploy on Streamlit Cloud for Free</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    1. Go to <a href="https://share.streamlit.io" target="_blank" rel="noreferrer" className="text-blue-400 underline">share.streamlit.io</a> and login with GitHub.<br />
                    2. Click <strong>"New app"</strong>, choose your repository, set the branch to <code>main</code>, and set <code>app.py</code> as entrypoint.<br />
                    3. Click <strong>Deploy!</strong> Your app will build dependencies with <code>yt-dlp</code> and go live with a public URL in 2 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qdrant' && (
            <div className="max-w-3xl mx-auto space-y-5 text-sm">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">
                  Multi-Video Indexing with Managed Qdrant Vector DB
                </h3>
                <p className="text-xs text-slate-400">
                  Connecting Qdrant lets your video search engine scale from a single video session to indexing and searching across hundreds of videos at the same time.
                </p>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-semibold text-slate-200">Why Add a Vector Database?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="font-semibold text-blue-400 mb-1">Persistent Indexing</div>
                    <p className="text-slate-400">Store thousands of transcript vector nodes permanently in cloud memory.</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="font-semibold text-blue-400 mb-1">Cross-Video Search</div>
                    <p className="text-slate-400">Search "neural network backpropagation" across 50 different lectures simultaneously.</p>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="font-semibold text-blue-400 mb-1">Sub-10ms Retrieval</div>
                    <p className="text-slate-400">HNSW indexing finds the exact second across gigabytes of subtitles in milliseconds.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-semibold text-slate-200">How to Setup in 3 Commands:</h4>
                <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
{`# 1. Install Qdrant client
pip install qdrant-client sentence-transformers

# 2. Get free cloud credentials at https://cloud.qdrant.io (Free 1M vectors tier)
# 3. Add QDRANT_URL and QDRANT_API_KEY to your Streamlit secrets`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
