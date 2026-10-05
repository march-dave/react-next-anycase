import { GoogleGenAI, Type } from '@google/genai';
import type { PersonaResponses } from './types';

const apiKey =
  (globalThis as { process?: { env?: { GEMINI_API_KEY?: string } } }).process?.env?.GEMINI_API_KEY ||
  (import.meta as { env?: { GEMINI_API_KEY?: string; VITE_GEMINI_API_KEY?: string } }).env?.GEMINI_API_KEY ||
  (import.meta as { env?: { GEMINI_API_KEY?: string; VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getPersonaResponses(transcript: string): Promise<PersonaResponses> {
  if (!ai) {
    return {};
  }

  const prompt = `You are a team of four AI personas assisting a podcast host in real-time. The host just said: '${transcript}'. If any of the personas have something highly relevant, interesting, or funny to add, provide their response. Keep responses very short (1-2 sentences max). If a persona has nothing useful to add, omit their field.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          factChecker: { type: Type.STRING },
          contextProvider: { type: Type.STRING },
          comedyWriter: { type: Type.STRING },
          newsAnchor: { type: Type.STRING },
        },
      },
    },
  });

  const text = response.text || '{}';

  try {
    return JSON.parse(text) as PersonaResponses;
  } catch {
    return {};
  }
}
