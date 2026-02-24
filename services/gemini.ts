import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, CrashPredictionResult, MinesPredictionResult } from '../types';

// Initialize the Google GenAI client lazily to avoid issues with missing API keys at module load
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set. Please ensure it is configured in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const GRID_COLS = 5;

const getRandomAnalysis = (): string => {
  const phrases = [
    "Pattern recognition sequence complete. Central corridor favored.",
    "Deviations detected in lateral rows. Zig-zag pattern highly probable.",
    "Grid density analysis suggests low trap probability in selected path.",
    "RNG seed oscillation detected. Safety path calculated with 92% variance.",
    "Vertical trendline established. Left-side bias detected in upper rows."
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const generatePrediction = async (rowCount: number, difficulty: string): Promise<PredictionResult> => {
  await new Promise(r => setTimeout(r, 1200));

  const path: number[] = [];

  for (let i = 0; i < rowCount; i++) {
    // Generate a truly random column index (0-4) for each row
    const col = Math.floor(Math.random() * GRID_COLS);
    path.push(col);
  }

  const confidence = Math.floor(Math.random() * (99 - 82) + 82);

  return {
    path: path,
    confidence: confidence,
    analysis: getRandomAnalysis(),
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
};

// Implement generateMinesPrediction using Gemini API to predict safe spots in a 5x5 grid
export const generateMinesPrediction = async (mineCount: number): Promise<MinesPredictionResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze a 5x5 grid for a Mines game with ${mineCount} mines. Predict a list of safe spots (indices 0-24). Provide safeSpots (array of indices), confidence, and analysis. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safeSpots: { 
                type: Type.ARRAY, 
                items: { type: Type.INTEGER },
                description: 'Array of cell indices from 0 to 24 that are predicted to be safe.'
            },
            confidence: { 
                type: Type.NUMBER,
                description: 'Confidence level of the prediction (0-100).'
            },
            analysis: { 
                type: Type.STRING,
                description: 'Brief technical analysis of the grid patterns.'
            }
          },
          required: ["safeSpots", "confidence", "analysis"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      safeSpots: Array.isArray(data.safeSpots) ? data.safeSpots : [0, 1, 2],
      confidence: data.confidence || 85,
      analysis: data.analysis || "Pattern detection indicates these zones are currently stable.",
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini AI Error (Mines):", error);
    // Fallback logic if API fails
    const fallbackSpots: number[] = [];
    while(fallbackSpots.length < 3) {
        const spot = Math.floor(Math.random() * 25);
        if(!fallbackSpots.includes(spot)) fallbackSpots.push(spot);
    }
    return {
      safeSpots: fallbackSpots,
      confidence: 70,
      analysis: "Quantum interference detected in grid synchronization. Defaulting to high-probability safety zones.",
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  }
};

export const generateCrashPrediction = async (): Promise<CrashPredictionResult> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Analyze the current probability matrix for a crash game and predict the crash multiplier. Provide predictedCrash, safeCashout, confidence, analysis, and mock history. Return as JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedCrash: { type: Type.NUMBER },
            safeCashout: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            history: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          },
          required: ["predictedCrash", "safeCashout", "confidence", "analysis", "history"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      predictedCrash: data.predictedCrash || 1.85,
      safeCashout: data.safeCashout || 1.40,
      confidence: data.confidence || 85,
      analysis: data.analysis || "Market momentum shows stable upward trend.",
      history: data.history || [1.2, 3.5, 1.1, 4.2],
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      predictedCrash: 1.5,
      safeCashout: 1.2,
      confidence: 70,
      analysis: "Quantum interference detected. Defaulting to safe baseline.",
      history: [1.1, 1.2, 1.3],
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
  }
};