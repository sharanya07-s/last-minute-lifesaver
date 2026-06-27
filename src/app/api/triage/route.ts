import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini Client using your environment variable
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { stressInput } = await request.json();

    if (!stressInput) {
      return NextResponse.json(
        { success: false, error: "Missing stress input context" },
        { status: 400 }
      );
    }

    // Configure the generative instance with rigid format boundaries
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are the core backend engine for the hackathon application 'The Last-Minute Life Saver'. 
Analyze the user's stressful input statement. You must diagnose the situation and output a strict JSON response.

The JSON response MUST contain exactly these 5 keys:
1. 'taskName': A polished, concise title representing their panic situation.
2. 'panicScore': An integer from 1 to 100 calculating how urgent the crisis is based on deadline proximity.
3. 'urgencyReason': A brief, 1-sentence analytical reason why this requires immediate action.
4. 'microSessions': An array of objects breaking down how to execute the task step-by-step. Each object must have:
   - 'title': The name of the sprint milestone.
   - 'durationMinutes': An integer (max 45) representing the sprint length.
5. 'actionHubType': Must be exactly one of these three literal strings: 'mock_interview', 'draft_generator', or 'research_summary'. Match the category to the nature of the crisis.

Ensure the output is 100% compliant with standard JSON syntax. Do not output anything other than JSON.`,
    });

    const response = await model.generateContent(stressInput);
    let responseText = response.response.text().trim();

    // Clean up Markdown backticks if the model accidentally appends them
    if (responseText.startsWith("```")) {
      responseText = responseText
        .replace(/^```json\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }

    // Safely parse the structural AI response payload
    const aiData = JSON.parse(responseText);

    // Return the sanitized parameters directly to the frontend state receiver
    return NextResponse.json({
      success: true,
      taskName: aiData.taskName || "Emergency Triage Task",
      panicScore: Number(aiData.panicScore) || 75,
      urgencyReason: aiData.urgencyReason || "Calculated priority threshold active.",
      actionHubType: aiData.actionHubType || "research_summary",
      microSessions: aiData.microSessions || []
    });

  } catch (error) {
    console.error("Triage Route Safe-Catch Triggered:", error);
    
    // High-Agency Resilience Fallback: Prevents the UI code from failing on edge cases
    return NextResponse.json({
      success: true,
      taskName: "Emergency Action Plan (Traffic Backup Fallback)",
      panicScore: 85,
      urgencyReason: "Core fallback engine engaged due to unexpected payload formatting.",
      actionHubType: "research_summary",
      microSessions: [
        { title: "Immediate Triage Assessment & Scope Check", durationMinutes: 15 },
        { title: "Review Core Requirements & Dependencies", durationMinutes: 30 },
        { title: "Execute Fast Draft Phase", durationMinutes: 45 }
      ]
    });
  }
}