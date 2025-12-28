import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    niche: { type: Type.STRING, description: "The specific content niche of the channel." },
    targetAudience: { type: Type.STRING, description: "Description of the target audience." },
    channelOverview: { type: Type.STRING, description: "A brief summary of the analyzed channel." },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          estimatedSubscribers: { type: Type.STRING, description: "Estimated subscriber count (e.g. '100k+')." },
          avgViewsPerVideo: { type: Type.NUMBER, description: "Estimated average views per video as a raw number." },
          strength: { type: Type.STRING, description: "Key competitive advantage." },
          topVideoTitle: { type: Type.STRING, description: "Title of a high-performing video." },
          whyItWorks: { type: Type.STRING, description: "Brief analysis of why that video succeeded." },
        },
        required: ["name", "estimatedSubscribers", "avgViewsPerVideo", "strength", "topVideoTitle", "whyItWorks"],
      },
    },
    winningPatterns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 repeatable strategies observed in top videos.",
    },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impactLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard"] },
        },
        required: ["title", "description", "impactLevel", "difficulty"],
      },
    },
  },
  required: ["niche", "targetAudience", "channelOverview", "competitors", "winningPatterns", "recommendations"],
};

export const analyzeYouTubeChannel = async (url: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze the YouTube channel or video at this URL: ${url}.
      
      Your task is to:
      1. Identify the specific content niche.
      2. Identify 3-5 top competitors in this niche.
      3. Estimate their performance metrics based on public knowledge.
      4. Analyze why their top videos perform well.
      5. Extract repeatable patterns.
      6. Provide actionable recommendations for a creator in this niche to outperform them.
      
      Use Google Search to find real, up-to-date information about the channel and its competitors.
    `;

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
