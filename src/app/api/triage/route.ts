import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize the Google Gen AI SDK using the standard class constructor
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. Strict system instruction forcing the model to generate a predictable JSON schema
const systemInstruction = `
You are the high-agency backend engine for the productivity application 'The Last-Minute Life Saver'.
Your primary job is to intercept chaotic, highly stressful human inputs regarding missed deadlines, crises, or work backlogs, and convert that panic into an immediate, actionable execution blueprint.

You MUST analyze the user's input and output a strict, valid JSON object ONLY. Do not wrap the JSON output in markdown backticks (\`\`\`json ... \`\`\`). Do not include any conversational prose outside the JSON structure.

The returned JSON object must perfectly follow this blueprint structure:
{
  "taskName": "A polished, concise and actionable title summarizing the crisis",
  "panicScore": 85, 
  "calculatedUrgencyReason": "A sharp, empathetic 1-sentence breakdown of why this task is a priority and its execution impact",
  "actionHubType": "draft_generator", 
  "generatedScript": "A complete, immediately deployable, professional communication text, email draft, or starter script custom-tailored to handle or buy time for this exact crisis.",
  "microSessions": [
    { "title": "Step 1: Specific, atomic action item", "durationMinutes": 30 },
    { "title": "Step 2: Second atomic action item", "durationMinutes": 45 }
  ]
}

Context guidelines for 'actionHubType' selection:
- If the user needs to reply to a boss/team, explain an absence, or send a submission: use "draft_generator".
- If the user mentions a viva, interview, speech, presentation defense, or exam setup: use "mock_interview".
- If the user mentions writing papers, documentation, deep technical bugs, or gathering initial facts: use "research_summary".

Ensure that the "generatedScript" property is heavily populated with actual content text (e.g., a real email template starting with 'Dear Team/Professor...') and NEVER left blank or empty.
`;

export async function POST(request: Request) {
  try {
    // Check if the API Key is present in the environment
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Internal Server Configuration Error: Missing API Key" },
        { status: 500 }
      );
    }

    // Extract the raw stress input from the frontend fetch call
    const { rawInput } = await request.json();

    if (!rawInput || typeof rawInput !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid 'rawInput' string payload" },
        { status: 400 }
      );
    }

    // 3. Configure the generative model via getGenerativeModel
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
      systemInstruction: systemInstruction,
    });

    // 4. Generate content based on user input
    const result = await model.generateContent(
      `Current Date/Time Context: ${new Date().toISOString()}\n\nUser Crisis Input: "${rawInput}"`
    );
    
    const response = await result.response;
    const textResponse = response.text();

    // Print to your Cursor/VSCode server terminal to debug incoming payloads instantly
    console.log("🔥 GEMINI PRODUCTION ENGINE OUTBOUND:", textResponse);

    if (!textResponse) {
      throw new Error("Empty response received from Gemini engine");
    }

    // 5. Clean and parse text into structural objects before delivering down the pipeline
    const cleanJsonPayload = JSON.parse(textResponse.trim());

    return NextResponse.json(cleanJsonPayload);

  } catch (error: any) {
    console.error("❌ CRITICAL ERROR IN TRIAGE API ROUTE:", error);
    return NextResponse.json(
      { 
        error: "Failed to process structural task triage", 
        details: error?.message || error 
      },
      { status: 500 }
    );
  }
}