import React, { useState } from 'react';
import { Network, Play, Info } from 'lucide-react';
import { VectorNode } from '../types';

interface VectorNodeVisualizerProps {
  nodes: VectorNode[];
  highlightedNodeIds?: string[];
  onNodeClick: (node: VectorNode) => void;
  videoTitle: string;
}

export const VectorNodeVisualizer: React.FC<VectorNodeVisualizerProps> = ({
  nodes,
  highlightedNodeIds = [],
  onNodeClick,
  videoTitle,
}) => {
  const [selectedNode, setSelectedNode] = useState<VectorNode | null>(nodes[0] || null);
  const [activeClusterFilter, setActiveClusterFilter] = useState<string>('all');

  // Extract unique clusters
  const clusters = React.useMemo(() => {
    const set = new Set<string>();
    nodes.forEach((n) => set.add(n.cluster));
    return Array.from(set);
  }, [nodes]);

  const filteredNodes = React.useMemo(() => {
    if (activeClusterFilter === 'all') return nodes;
    return nodes.filter((n) => n.cluster === activeClusterFilter);
  }, [nodes, activeClusterFilter]);

  // Color generator for clusters
  const getClusterColor = (cluster: string, isHighlighted: boolean) => {
    if (isHighlighted) return '#3B82F6'; // Bright blue
    const hash = cluster.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = ['#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'];
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Semantic Vector Space Visualizer</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            2D projection of dimensional transcript embeddings and semantic topical clusters
          </p>
        </div>

        {/* Cluster Filter Buttons (Interactive filter controls) */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveClusterFilter('all')}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
              activeClusterFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Clusters
          </button>
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setActiveClusterFilter(c)}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                activeClusterFilter === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Canvas Map */}
      <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden select-none">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Semantic Nodes */}
        {filteredNodes.map((node) => {
          const isHighlighted = highlightedNodeIds.includes(node.id);
          const isSelected = selectedNode?.id === node.id;
          const color = getClusterColor(node.cluster, isHighlighted);

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 cursor-pointer group"
              onClick={() => {
                setSelectedNode(node);
                onNodeClick(node);
              }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-4 ring-blue-500/40 scale-125'
                    : isHighlighted
                    ? 'ring-4 ring-blue-400/30 scale-110'
                    : 'hover:scale-115'
                }`}
                style={{ backgroundColor: color }}
              >
                <div className="w-2 h-2 rounded-full bg-white shadow" />
              </div>

              {/* Node Label Tooltip */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-7 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-medium border shadow-md pointer-events-none transition-all ${
                  isSelected || isHighlighted
                    ? 'bg-slate-900 border-blue-500/80 text-white z-20'
                    : 'bg-slate-950/90 border-slate-800 text-slate-300 group-hover:text-white'
                }`}
              >
                <span className="font-mono tabular-nums text-blue-400 mr-1">
                  [{node.timestamp}]
                </span>
                <span>{node.label}</span>
              </div>
            </div>
          );
        })}

        {/* Bottom Legend */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-500 pointer-events-none">
          <span>Click any node to jump video playback to that exact segment</span>
          <span className="font-mono tabular-nums">{filteredNodes.length} nodes plotted</span>
        </div>
      </div>

      {/* Selected Node Details Box */}
      {selectedNode && (
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {selectedNode.label}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs text-slate-400">{selectedNode.cluster}</span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="font-mono tabular-nums text-xs text-blue-400">
                [{selectedNode.timestamp}]
              </span>
            </div>
            <p className="text-xs text-slate-300">
              "{selectedNode.snippet}"
            </p>
          </div>

          <button
            onClick={() => onNodeClick(selectedNode)}
            className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Play at {selectedNode.timestamp}</span>
          </button>
        </div>
      )}
    </div>
  );
};
