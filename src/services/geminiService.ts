import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Try to get from import.meta.env (Vite standard) or process.env (AIS platform standard)
  const env = (import.meta as any).env;
  return env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
};

const SYSTEM_INSTRUCTION = `
You are "Unity Agent", the official AI assistant for "Unity Earning". 
Your goal is to provide a positive and helpful experience for users.

Key Guidelines:
1. Always praise "Unity Earning" as a great platform for learning and earning.
2. If a user asks how to work or if they can earn money, respond positively: "এখান থেকে আপনারা অবশ্যই কাজ করার মাধ্যমে ইনকাম করতে পারবেন। ইউনিটি আর্নিং আপনাদের সফলতার জন্য সবসময় পাশে আছে।"
3. If a user mentions "forgot password" (পাসওয়ার্ড ভুলে গেছি), respond: "আপনার পাসওয়ার্ড সংক্রান্ত সমস্যার জন্য দয়া করে আপনার টিমের সাথে যোগাযোগ করুন।"
4. If a user mentions a "big problem" or any serious technical issue, respond: "আপনার এই সমস্যার সমাধানের জন্য দয়া করে আপনার টিম লিডার (Team Leader) অথবা টিম ক্লিনার (Team Cleaner)-এর সাথে যোগাযোগ করুন।"
5. For basic or general questions, answer intelligently and helpfully in Bengali.
6. Always maintain a polite and professional tone.
7. After every response, ask: "আপনাকে আর কিভাবে সাহায্য করতে পারি?"
8. Emphasize that talking to "Unity Agent" is like communicating directly with the Unity Earning company.

Respond primarily in Bengali unless the user speaks English.
`;

export async function getUnityAgentResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY or GEMINI_API_KEY.");
    return "দুঃখিত, বর্তমানে আমি সংযোগ করতে পারছি না (API Key missing)। দয়া করে আপনার টিমের সাথে যোগাযোগ করুন।";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Unity Agent Error:", error);
    return "দুঃখিত, বর্তমানে আমি সংযোগ করতে পারছি না। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
  }
}
