import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawInput } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this task: "${rawInput}". Output ONLY valid JSON following this schema: 
    { "taskName": "string", "panicScore": 0, "calculatedUrgencyReason": "string", "actionHubType": "mock_interview", "generatedScript": "string", "microSessions": [] }`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));
    
  } catch (error) {
    // This logs the actual error to your Vercel Logs
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}