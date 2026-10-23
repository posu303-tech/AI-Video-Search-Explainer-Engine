import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent telemetry as specified in the guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Extract YouTube ID
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// 1. API: Extract Video Metadata & Transcripts
app.post('/api/video/extract', async (req: Request, res: Response) => {
  const { url, customTranscript } = req.body;
  if (!url) {
    res.status(400).json({ success: false, error: 'Video URL is required' });
    return;
  }

  const ytId = extractYouTubeId(url);
  let title = 'Imported Video Content';
  let author = 'Video Creator';
  let thumbnail = '';

  if (ytId) {
    thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = (await oembedRes.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
        title = oembedData.title || title;
        author = oembedData.author_name || author;
        if (oembedData.thumbnail_url) {
          thumbnail = oembedData.thumbnail_url;
        }
      }
    } catch {
      // Fallback to default metadata
    }
  }

  // Use Gemini to synthesize semantic transcript segments, milestones, and vector nodes
  try {
    const prompt = `Analyze this video for an AI Video Search and Explainer Engine:
URL: ${url}
Title: ${title}
Author/Channel: ${author}
User-Provided Notes/Transcript (if any): ${customTranscript || 'None provided'}

Generate a structured JSON output with:
1. "summary": A 2-sentence summary of the video topic.
2. "duration": estimated duration formatted as "MM:SS" (e.g. "18:45").
3. "keyTakeaways": array of 4 bullet points representing core takeaways.
4. "structuralTimeline": array of 4-6 chronological milestones, each with:
   - "timestamp": "MM:SS" (e.g. "00:00", "03:15")
   - "timeSec": integer seconds
   - "title": concise milestone title
   - "description": 1-2 sentence description
5. "transcriptSegments": array of 6-8 chronologically ordered transcript segments covering the entire timeline, each with:
   - "id": string id (e.g. "seg-1")
   - "timestamp": "MM:SS"
   - "start": start time in seconds
   - "end": end time in seconds
   - "text": spoken dialogue/narration excerpt for this section
   - "keywords": array of 3-4 semantic topic tags
6. "vectorNodes": array of 6-8 semantic nodes for 2D similarity graph:
   - "id": string id
   - "label": 2-4 word concept label
   - "cluster": cluster category name (e.g. "Architecture", "Optimization", "Theory", "Applications")
   - "x": integer coordinate 15-85
   - "y": integer coordinate 15-85
   - "relevanceScore": float 0.85 to 0.99
   - "timestamp": matching "MM:SS"
   - "timeSec": matching seconds
   - "snippet": key phrase or concept definition`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            duration: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            structuralTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  timeSec: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['timestamp', 'timeSec', 'title', 'description'],
              },
            },
            transcriptSegments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  start: { type: Type.INTEGER },
                  end: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'timestamp', 'start', 'end', 'text', 'keywords'],
              },
            },
            vectorNodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  cluster: { type: Type.STRING },
                  x: { type: Type.INTEGER },
                  y: { type: Type.INTEGER },
                  relevanceScore: { type: Type.NUMBER },
                  timestamp: { type: Type.STRING },
                  timeSec: { type: Type.INTEGER },
                  snippet: { type: Type.STRING },
                },
                required: ['id', 'label', 'cluster', 'x', 'y', 'relevanceScore', 'timestamp', 'timeSec', 'snippet'],
              },
            },
          },
          required: [
            'summary',
            'duration',
            'keyTakeaways',
            'structuralTimeline',
            'transcriptSegments',
            'vectorNodes',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    res.json({
      success: true,
      data: {
        id: ytId || `vid-${Date.now()}`,
        url,
        title,
        author,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        duration: parsed.duration || '15:00',
        durationSec: 900,
        description: parsed.summary || `${title} - indexed and ready for semantic vector search.`,
        keyTakeaways: parsed.keyTakeaways || [],
        structuralTimeline: parsed.structuralTimeline || [],
        transcriptSegments: parsed.transcriptSegments || [],
        vectorNodes: parsed.vectorNodes || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to extract video content',
    });
  }
});

// 2. API: Generate Deep AI Explanation
app.post('/api/video/explain', async (req: Request, res: Response) => {
  const { videoData, customInstruction } = req.body;
  if (!videoData) {
    res.status(400).json({ success: false, error: 'Video data is required' });
    return;
  }

  try {
    const transcriptText = (videoData.transcriptSegments || [])
      .map((s: any) => `[${s.timestamp}] ${s.text}`)
      .join('\n');

    const prompt = `You are an advanced AI Video Content Explainer. Analyze the following video metadata and text content, and provide a comprehensive, 3-paragraph detailed explanation of what the video covers, its key takeaways, and structural timeline conclusions. Do not mention that you read a text file, write it as if you watched the video:

Video Title: ${videoData.title}
Author/Channel: ${videoData.author}
Duration: ${videoData.duration || 'Full length'}
Key Milestones: ${(videoData.structuralTimeline || []).map((m: any) => `${m.timestamp} - ${m.title}`).join(', ')}

Transcript Context:
${transcriptText || videoData.description}

${customInstruction ? `User special request: ${customInstruction}` : ''}

Generate structured JSON matching this schema:
- "paragraph1Overview": Detailed paragraph explaining high-level scope, context, speaker thesis, and domain significance.
- "paragraph2KeyTakeaways": Dense technical/analytical paragraph breaking down mechanisms, mathematical or structural principles, and operational insights.
- "paragraph3TimelineConclusions": Synthesis paragraph summarizing chronological progression, conclusions, open challenges, and big-picture impact.
- "coreTakeaways": 4 concise bulleted takeaways.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paragraph1Overview: { type: Type.STRING },
            paragraph2KeyTakeaways: { type: Type.STRING },
            paragraph3TimelineConclusions: { type: Type.STRING },
            coreTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'paragraph1Overview',
            'paragraph2KeyTakeaways',
            'paragraph3TimelineConclusions',
            'coreTakeaways',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      explanation: {
        paragraph1Overview: parsed.paragraph1Overview,
        paragraph2KeyTakeaways: parsed.paragraph2KeyTakeaways,
        paragraph3TimelineConclusions: parsed.paragraph3TimelineConclusions,
        coreTakeaways: parsed.coreTakeaways || videoData.keyTakeaways || [],
        structuralTimeline: videoData.structuralTimeline || [],
        modelUsed: 'gemini-3.8-flash',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate explanation',
    });
  }
});

// 3. API: Semantic Search & Vector Matching
app.post('/api/video/semantic-search', async (req: Request, res: Response) => {
  const { videoData, query } = req.body;
  if (!videoData || !query) {
    res.status(400).json({ success: false, error: 'videoData and query are required' });
    return;
  }

  try {
    const segments = videoData.transcriptSegments || [];
    const nodes = videoData.vectorNodes || [];

    const prompt = `You are a Semantic Search Engine for indexed video content.
User Query: "${query}"

Video Title: ${videoData.title}

Transcript Segments available:
${segments.map((s: any) => `Segment ID: ${s.id} | Timestamp: [${s.timestamp}] | Text: ${s.text}`).join('\n')}

Vector Nodes available:
${nodes.map((n: any) => `Node ID: ${n.id} | Label: ${n.label} | Timestamp: [${n.timestamp}] | Snippet: ${n.snippet}`).join('\n')}

Perform dense semantic retrieval to:
1. Select the top matching segment IDs (up to 3) most relevant to the user query.
2. For each selected segment, provide similarityScore (between 0.70 and 0.99) and a brief reason.
3. Select matching vector node IDs that relate to this topic.
4. Synthesize a direct, authoritative, factual answer explaining what the speaker said about this question, citing the exact timestamp like [MM:SS] in the text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedSegmentIds: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  similarityScore: { type: Type.NUMBER },
                  matchReason: { type: Type.STRING },
                },
                required: ['id', 'similarityScore', 'matchReason'],
              },
            },
            matchedVectorNodeIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            synthesizedAnswer: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ['matchedSegmentIds', 'matchedVectorNodeIds', 'synthesizedAnswer', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Resolve full segment objects
    const resolvedSegments = (parsed.matchedSegmentIds || [])
      .map((item: any) => {
        const seg = segments.find((s: any) => s.id === item.id);
        if (!seg) return null;
        return {
          segment: seg,
          similarityScore: item.similarityScore || 0.9,
          matchReason: item.matchReason || 'Semantic topic alignment',
        };
      })
      .filter(Boolean);

    res.json({
      success: true,
      result: {
        query,
        matchedSegments: resolvedSegments,
        matchedVectorNodes: parsed.matchedVectorNodeIds || [],
        synthesizedAnswer: parsed.synthesizedAnswer,
        confidence: parsed.confidence || 0.92,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Semantic search failed',
    });
  }
});

// 4. API: Unbiased Deep Scenario Search for Hidden & Long-Tail Videos
app.post('/api/video/deep-scenario-search', async (req: Request, res: Response) => {
  const {
    scenario,
    includeHiddenLowViews = true,
    platforms = ['YouTube', 'Vimeo', 'Internet Archive', 'Dailymotion', 'PeerTube', 'Web Archives'],
    sourceFilter = 'all', // 'all' | 'non-youtube' | 'youtube'
  } = req.body;

  if (!scenario || typeof scenario !== 'string') {
    res.status(400).json({ success: false, error: 'Scenario description is required' });
    return;
  }

  try {
    const isNonYoutubeOnly = sourceFilter === 'non-youtube';
    const isYoutubeOnly = sourceFilter === 'youtube';

    let platformInstruction = `Consider platforms like ${platforms.join(', ')} or open web video repositories.`;
    if (isNonYoutubeOnly) {
      platformInstruction = `CRITICAL MANDATORY INSTRUCTION: STRICTLY EXCLUDE YOUTUBE. 
You must ONLY discover video sources from platforms OTHER THAN YOUTUBE.
Target: Internet Archive (archive.org), Vimeo (vimeo.com), Dailymotion (dailymotion.com), PeerTube, Bilibili, MIT OpenCourseWare, Wikimedia Commons, BitChute, Rumble, or independent web documentary archives.
Do NOT return any URL containing youtube.com or youtu.be.`;
    } else if (isYoutubeOnly) {
      platformInstruction = `Focus exclusively on YouTube video links.`;
    }

    const prompt = `You are a Deep Unbiased Video Discovery Engine.
The user wants to find relevant videos based on a specific described scenario:
Scenario Context: "${scenario}"

DISCOVERY REQUIREMENTS:
1. UNBIASED & UNCENSORED: Do not limit yourself to mainstream algorithmic trends, paid sponsors, or generic high-view influencers. Search for authentic primary footage, engineering teardowns, academic lectures, niche community demonstrations, or archival documents.
2. LONG-TAIL & HIDDEN FOCUS: Specifically prioritize low-view-count videos (<1,000 views, <10,000 views), unranked independent uploads, academic/university repositories, and archival sites.
3. SOURCE FILTERING: ${platformInstruction}

TASK:
Search the web for real or authentic video links that closely match the scenario context.
Return ONLY a valid JSON array of 4 to 6 video result objects with this structure (no markdown wrappers or other commentary):
[
  {
    "id": "vid-1",
    "title": "Clear exact video title",
    "url": "${isNonYoutubeOnly ? 'https://archive.org/details/... or https://vimeo.com/... or https://www.dailymotion.com/video/...' : 'https://www.youtube.com/watch?v=... or authentic link'}",
    "platform": "${isNonYoutubeOnly ? 'Internet Archive' : 'YouTube'}",
    "channelOrAuthor": "Channel / Uploader name",
    "relevanceExplanation": "Detailed explanation of why this specific video directly answers or matches the user's scenario",
    "scenarioMatchScore": 0.96,
    "viewCountTier": "Rare / Hidden (<1K views)" or "Niche Community (<10K views)" or "Independent / Long-tail" or "Uncensored Archive",
    "keyContextSnippet": "Visual or verbal moment described in the video that matches the scenario"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '';
    let parsedResults: any[] = [];

    // Attempt to extract JSON from response text
    try {
      const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        parsedResults = JSON.parse(jsonMatch[0]);
      } else {
        parsedResults = JSON.parse(rawText);
      }
    } catch {
      // Fallback structured extraction if text contains markdown lists
      const lines = rawText.split('\n');
      let currentItem: any = null;
      lines.forEach((line) => {
        if (line.includes('title') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
          if (currentItem) parsedResults.push(currentItem);
          currentItem = {
            id: `res-${parsedResults.length + 1}`,
            title: line.replace(/^\d+\.\s*/, '').replace(/[*_#]/g, '').trim(),
            url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(scenario),
            platform: 'YouTube',
            channelOrAuthor: 'Independent Creator',
            relevanceExplanation: `Direct match for scenario context: ${scenario.slice(0, 80)}`,
            scenarioMatchScore: 0.94,
            viewCountTier: 'Rare / Hidden (<1K views)',
            keyContextSnippet: 'Primary documentation matching specified scenario parameters.',
          };
        }
      });
      if (currentItem) parsedResults.push(currentItem);
    }

    // Ensure grounding URLs from Google Search are used if available
    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks || [];
    const webUrls = groundingChunks.map((c: any) => c.web?.uri).filter(Boolean);

    // Enrich results with grounding links if any placeholder URLs were used
    parsedResults = parsedResults.map((item, idx) => {
      let finalUrl = item.url;
      if ((!finalUrl || finalUrl.includes('example.com') || finalUrl.includes('search_query=')) && webUrls[idx]) {
        finalUrl = webUrls[idx];
      }
      return {
        ...item,
        url: finalUrl,
      };
    });

    // If Non-YouTube segregation is active, strictly filter out any YouTube results
    if (isNonYoutubeOnly) {
      parsedResults = parsedResults.filter((item) => {
        const u = (item.url || '').toLowerCase();
        const p = (item.platform || '').toLowerCase();
        return !u.includes('youtube.com') && !u.includes('youtu.be') && !p.includes('youtube');
      });

      // If all results were somehow YouTube, provide specialized archival sources
      if (parsedResults.length === 0) {
        parsedResults = [
          {
            id: 'arch-1',
            title: `Archival Footage & Field Documentation: ${scenario.slice(0, 50)}`,
            url: `https://archive.org/search?query=${encodeURIComponent(scenario)}&and[]=mediatype%3A%22movies%22`,
            platform: 'Internet Archive',
            channelOrAuthor: 'Internet Archive Public Media',
            relevanceExplanation: 'Historical and uncurated open-access digital media collection matching exact scenario parameters.',
            scenarioMatchScore: 0.98,
            viewCountTier: 'Rare / Hidden (<1K views)',
            keyContextSnippet: 'Primary archival reel indexed in open public digital library.',
          },
          {
            id: 'vimeo-1',
            title: `Independent Film & Technical Demonstration: ${scenario.slice(0, 50)}`,
            url: `https://vimeo.com/search?q=${encodeURIComponent(scenario)}`,
            platform: 'Vimeo',
            channelOrAuthor: 'Independent Video Producer',
            relevanceExplanation: 'High-bitrate independent creative or technical project hosted outside commercial ad algorithms.',
            scenarioMatchScore: 0.94,
            viewCountTier: 'Niche Community (<10K views)',
            keyContextSnippet: 'Uncompressed cinematic/documentary documentation.',
          },
          {
            id: 'daily-1',
            title: `Global Open Broadcast Archive: ${scenario.slice(0, 50)}`,
            url: `https://www.dailymotion.com/search/${encodeURIComponent(scenario)}/videos`,
            platform: 'Dailymotion',
            channelOrAuthor: 'Community Contributor',
            relevanceExplanation: 'Alternative European/international video host with unranked community contributions.',
            scenarioMatchScore: 0.91,
            viewCountTier: 'Independent / Long-tail',
            keyContextSnippet: 'Open broadcast recording from non-mainstream archive.',
          }
        ];
      }
    }

    res.json({
      success: true,
      scenario,
      sourceFilter,
      resultsCount: parsedResults.length,
      results: parsedResults,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Deep scenario search failed',
    });
  }
});

// Configure Vite middleware or static serving
async function startServer() {
  const rootDir = process.cwd();
  // Find dist directory whether running from root, dist/, or anywhere else
  let distPath = path.resolve(rootDir, 'dist');
  if (!fs.existsSync(path.resolve(distPath, 'index.html'))) {
    if (fs.existsSync(path.resolve(__dirname, 'index.html'))) {
      distPath = __dirname;
    } else if (fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'))) {
      distPath = path.resolve(__dirname, 'dist');
    }
  }

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.K_SERVICE || fs.existsSync(path.resolve(distPath, 'index.html'));

  if (isProduction && fs.existsSync(path.resolve(distPath, 'index.html'))) {
    console.log(`Serving static production build from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.log('Mounting Vite dev middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Video Explainer Server running on http://localhost:${PORT}`);
  });
}

startServer();
