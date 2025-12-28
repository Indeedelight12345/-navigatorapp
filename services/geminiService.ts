import { AnalysisResult } from "../types";

// Read the API key from Vite's runtime env. In dev use a `.env.local` containing
// VITE_GEMINI_API_KEY=...
const apiKey = (import.meta.env as any).VITE_GEMINI_API_KEY as string | undefined;

// Use a plain object schema to avoid depending on SDK types at build-time.
const responseSchema: any = {
  type: "object",
  properties: {
    niche: { type: "string", description: "The specific content niche of the channel." },
    targetAudience: { type: "string", description: "Description of the target audience." },
    channelOverview: { type: "string", description: "A brief summary of the analyzed channel." },
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          estimatedSubscribers: { type: "string", description: "Estimated subscriber count (e.g. '100k+')." },
          avgViewsPerVideo: { type: "number", description: "Estimated average views per video as a raw number." },
          strength: { type: "string", description: "Key competitive advantage." },
          topVideoTitle: { type: "string", description: "Title of a high-performing video." },
          whyItWorks: { type: "string", description: "Brief analysis of why that video succeeded." },
        },
        required: ["name", "estimatedSubscribers", "avgViewsPerVideo", "strength", "topVideoTitle", "whyItWorks"],
      },
    },
    winningPatterns: {
      type: "array",
      items: { type: "string" },
      description: "List of 3-5 repeatable strategies observed in top videos.",
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          impactLevel: { type: "string", enum: ["High", "Medium", "Low"] },
          difficulty: { type: "string", enum: ["Easy", "Moderate", "Hard"] },
        },
        required: ["title", "description", "impactLevel", "difficulty"],
      },
    },
  },
  required: ["niche", "targetAudience", "channelOverview", "competitors", "winningPatterns", "recommendations"],
};

export const analyzeYouTubeChannel = async (url: string): Promise<AnalysisResult> => {
  // If the API key is not configured, return a mocked result so the UI is usable for testing.
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY not set — returning mock analysis result.");
    return {
      niche: "Sample Niche",
      targetAudience: "Beginners and enthusiasts interested in sample content",
      channelOverview: "This is a mocked analysis result because the Gemini API key was not provided.",
      competitors: [
        {
          name: "Mock Channel A",
          estimatedSubscribers: "120k+",
          avgViewsPerVideo: 45000,
          strength: "Consistent upload schedule and strong thumbnails",
          topVideoTitle: "How to Sample",
          whyItWorks: "Clear hook, concise value, and strong retention",
        },
      ],
      winningPatterns: ["Short, punchy intros", "Clear step-by-step tutorials", "Branded thumbnails"],
      recommendations: [
        { title: "Improve thumbnails", description: "Use bold text and high-contrast faces.", impactLevel: 'High', difficulty: 'Easy' },
      ],
    } as AnalysisResult;
  }

  try {
    // Dynamically import the SDK at runtime to avoid bundling issues in the browser build step.
    const genai = await import('@google/genai');
    const { GoogleGenAI } = genai as any;
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the YouTube channel or video at this URL: ${url}.\n\nYour task is to: \n1. Identify the specific content niche.\n2. Identify 3-5 top competitors in this niche.\n3. Estimate their performance metrics based on public knowledge.\n4. Analyze why their top videos perform well.\n5. Extract repeatable patterns.\n6. Provide actionable recommendations for a creator in this niche to outperform them.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze the YouTube link. Please ensure the URL is valid and try again.");
  }
};
