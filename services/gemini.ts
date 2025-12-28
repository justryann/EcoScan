
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIAnalysis } from "../types";

// Configuration for models based on documentation
const PRIMARY_MODEL = 'gemini-3-flash-preview';
const SECONDARY_MODEL = 'gemini-flash-lite-latest'; // Correct identifier for Flash Lite

/**
 * DeepSeek Fallback Logic
 * Using a generic fetch to interact with DeepSeek's OpenAI-compatible API.
 */
async function callDeepSeek(prompt: string, isJson: boolean): Promise<string> {
  const apiKey = (process.env as any).DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DeepSeek API Key not found in environment.");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: isJson ? { type: "json_object" } : undefined,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`DeepSeek Error: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Core execution engine with multi-model fallback.
 * Tries models in order of priority when a 429 (Quota) is encountered.
 * Triggers API Key selection on 404 errors.
 */
async function executeWithFallback<T>(
  taskName: string,
  geminiCall: (model: string) => Promise<T>,
  deepSeekPrompt?: { text: string; isJson: boolean }
): Promise<T> {
  const models = [PRIMARY_MODEL, SECONDARY_MODEL];
  
  for (const model of models) {
    try {
      console.log(`[${taskName}] Attempting with ${model}...`);
      return await geminiCall(model);
    } catch (error: any) {
      const errorMsg = error?.message || "";
      const isQuota = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED");
      const isNotFound = errorMsg.includes("404") || errorMsg.includes("Requested entity was not found");
      
      // If 404, the model name is wrong or project isn't enabled. 
      // Documentation says to prompt for key selection in this scenario.
      if (isNotFound) {
        console.warn(`[${taskName}] Model ${model} not found or project restricted. Prompting for key selection.`);
        if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
          try {
            await (window as any).aistudio.openSelectKey();
            // After triggering selection, we still want to try the fallback models or deepseek
          } catch (e) {
            console.error("Failed to open key selector", e);
          }
        }
        continue;
      }

      if (isQuota) {
        console.warn(`[${taskName}] ${model} quota exceeded. Switching to fallback...`);
        continue; // Try next model in loop
      }
      
      throw error; // Other errors like safety filters or 400 Bad Request
    }
  }

  // Final fallback to DeepSeek if configured
  if (deepSeekPrompt && (process.env as any).DEEPSEEK_API_KEY) {
    try {
      console.log(`[${taskName}] Attempting with DeepSeek Fallback...`);
      const result = await callDeepSeek(deepSeekPrompt.text, deepSeekPrompt.isJson);
      return (deepSeekPrompt.isJson ? JSON.parse(result) : result) as T;
    } catch (dsError) {
      console.error("All AI providers exhausted including DeepSeek.", dsError);
    }
  }

  throw new Error("AI services are currently unavailable (Quota or Model Mismatch). Please check your API Key settings.");
}

export const analyzeProduct = async (product: Product): Promise<AIAnalysis> => {
  const prompt = `Analyze this food product:
    Name: ${product.name}
    Brand: ${product.brand}
    Ingredients: ${product.ingredients.join(', ')}
    
    Provide analysis in JSON format:
    {
      "healthInsight": "string",
      "sustainabilityInsight": "string",
      "healthScore": number(0-100),
      "ecoScore": number(0-100),
      "alternative": {"name": "string", "reason": "string"},
      "concerningIngredients": [{"name": "string", "reason": "string"}]
    }
    Rules: No markdown, no asterisks, professional tone.`;

  return executeWithFallback(
    "Product Analysis",
    async (modelName) => {
      // Create fresh instance to pick up potential key updates from dialog
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthInsight: { type: Type.STRING },
              sustainabilityInsight: { type: Type.STRING },
              healthScore: { type: Type.NUMBER },
              ecoScore: { type: Type.NUMBER },
              alternative: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['name', 'reason']
              },
              concerningIngredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['name', 'reason']
                }
              }
            },
            required: ['healthInsight', 'sustainabilityInsight', 'healthScore', 'ecoScore']
          }
        }
      });
      return JSON.parse(response.text?.trim() || '{}');
    },
    { text: prompt, isJson: true }
  );
};

export const getQuickTip = async (): Promise<string> => {
  const prompt = 'Give a one-sentence clever and actionable eco-friendly shopping tip. No markdown.';
  
  return executeWithFallback(
    "Quick Tip",
    async (modelName) => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      return response.text?.replace(/\*/g, '') || "Shop local to reduce carbon footprint.";
    },
    { text: prompt, isJson: false }
  );
};

export const chatWithGemini = async (messages: { role: 'user' | 'model', text: string }[], context?: string) => {
  const lastMsg = messages[messages.length - 1].text;
  
  return executeWithFallback(
    "Chat",
    async (modelName) => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are Eco-Assistant. Concise (2 sentences max). No markdown. Actionable advice. ${context ? `Context: ${context}` : ''}`;

      const chat = ai.chats.create({
        model: modelName,
        config: { systemInstruction },
      });

      const result = await chat.sendMessage({ message: lastMsg });
      return result.text?.replace(/\*/g, '') || '';
    },
    { text: lastMsg, isJson: false }
  );
};
