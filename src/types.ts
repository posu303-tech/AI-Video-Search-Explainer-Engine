export interface TranscriptSegment {
  id: string;
  start: number; // in seconds
  end: number;   // in seconds
  timestamp: string; // e.g. "01:24"
  text: string;
  keywords?: string[];
}

export interface VectorNode {
  id: string;
  label: string;
  cluster: string;
  x: number; // normalized -1 to 1 or 0 to 100
  y: number;
  relevanceScore: number; // 0.0 to 1.0
  timestamp: string;
  timeSec: number;
  snippet: string;
}

export interface TimelineMilestone {
  timestamp: string;
  timeSec: number;
  title: string;
  description: string;
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  duration?: string;
  durationSec?: number;
  viewCount?: string;
  description: string;
  transcriptSegments: TranscriptSegment[];
  vectorNodes: VectorNode[];
  structuralTimeline?: TimelineMilestone[];
  keyTakeaways?: string[];
  fullTranscriptText?: string;
}

export interface AIExplanationResult {
  paragraph1Overview: string;
  paragraph2KeyTakeaways: string;
  paragraph3TimelineConclusions: string;
  structuralTimeline: TimelineMilestone[];
  coreTakeaways: string[];
  modelUsed: string;
  generatedAt: string;
}

export interface SemanticSearchResult {
  query: string;
  matchedSegments: {
    segment: TranscriptSegment;
    similarityScore: number;
    matchReason: string;
  }[];
  matchedVectorNodes: string[]; // ids of matched nodes
  synthesizedAnswer: string;
  confidence: number;
}
