
import { GoogleGenAI, Type } from "@google/genai";
import { GameEvent, JobCategory, Language } from "../types";

// Access API key using Vite's standard import.meta.env
// We use optional chaining (?.) to prevent crashes if env is undefined
const apiKey = import.meta.env?.VITE_API_KEY || '';

let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("API Key is missing. AI features will be disabled.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

// Helper to let the UI know if AI is active
export const isAiEnabled = () => !!ai;

export const generateGameEvent = async (
  currentYear: number, 
  currentJob: { title: string, category: JobCategory } | null, 
  netWorth: number,
  education: string,
  courses: string[],
  language: Language
): Promise<GameEvent | null> => {
  if (!ai) return null;

  try {
    const model = "gemini-3-flash-preview"; 
    
    const jobDesc = currentJob ? `${currentJob.title} (${currentJob.category})` : "Unemployed";
    const langName = language === 'ru' ? 'Russian' : 'English';

    const prompt = `
      You are a game master for a financial simulation game.
      Current stats: 
      - Year: ${currentYear}
      - Job: ${jobDesc}
      - Net Worth: $${netWorth}
      - Education Level: ${education}
      - Additional Training: ${courses.join(', ') || 'None'}

      Generate a random life event or market news affecting the player.
      Tailor the event to the player's job sector.
      
      IMPORTANT: Return the 'description' field in ${langName} language.

      Respond in JSON format.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: `A short text describing the event (in ${langName})` },
            cashImpact: { type: Type.NUMBER, description: "Positive or negative integer representing cash gained/lost" },
            marketImpact: { type: Type.STRING, enum: ["bull", "bear", "neutral"], description: "How this affects the stock market" }
          },
          required: ["description", "cashImpact", "marketImpact"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GameEvent;

  } catch (error) {
    console.error("Error generating event:", error);
    return null;
  }
};
