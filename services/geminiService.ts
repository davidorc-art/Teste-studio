import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTattooConcept = async (prompt: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a creative assistant for a Tattoo Artist named David at Studio Viking. 
      Generate a creative tattoo concept description based on this request: "${prompt}".
      Keep the tone artistic, professional, and slightly edgy/Viking style. 
      Suggest placement on the body and style (e.g., Realism, Old School, Blackwork).`,
      config: {
        systemInstruction: "You are a helpful assistant for a Tattoo Studio.",
      }
    });
    return response.text || "No concept generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating concept. Please check your connection.";
  }
};

export const generateClientMessage = async (type: 'reminder' | 'care' | 'promo', clientName: string, details: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  let promptContext = "";
  switch(type) {
    case 'reminder': promptContext = "Write a polite WhatsApp message reminding the client of their appointment tomorrow."; break;
    case 'care': promptContext = "Write a short list of aftercare instructions for a fresh tattoo/piercing."; break;
    case 'promo': promptContext = "Write a catchy promotional message for a flash day."; break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${promptContext} Client Name: ${clientName}. Details: ${details}. 
      Tone: Professional but cool, "Studio Viking" style. Use emojis sparingly. Language: Portuguese (Brazil).`,
    });
    return response.text || "No message generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating message.";
  }
};