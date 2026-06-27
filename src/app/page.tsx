"use client";

import { useState } from "react";

interface MicroSession {
  title: string;
  durationMinutes: number;
}

interface TriagePayload {
  taskName: string;
  panicScore: number;
  calculatedUrgencyReason: string;
  actionHubType: "draft_generator" | "mock_interview" | "research_summary";
  generatedScript: string;
  microSessions: MicroSession[];
}

export default function Dashboard() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<TriagePayload | null>(null);
  
  // 🚀 Interactive Sandbox State (Fixed for active typing)
  const [chatInput, setChatInput] = useState("");
  const [chatLogs, setChatLogs] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Ready to challenge your understanding before the evaluation deadline kicks off." }
  ]);

  const handleStressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawInput: inputValue }),
      });

      if (!res.ok) throw new Error("API Route triage failure");

      const data: TriagePayload = await res.json();
      setApiResponse(data);
    } catch (error) {
      console.error("Error submitting task crisis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSandboxSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Append user response to mock interview log
    setChatLogs((prev) => [...prev, { sender: "user", text: chatInput }]);
    setChatInput(""); // Clears field cleanly after submission
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      {/* 1. Omni-Input Field Form */}
      <form onSubmit={handleStressSubmit} className="max-w-3xl mx-auto mb-12">
        <div className="flex gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-zinc-200"
            placeholder="What's stressing you out right now?..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-800 text-black text-xs font-bold px-5 py-2 rounded-lg transition-colors"
          >
            {isLoading ? "Triaging..." : "Triage"}
          </button>
        </div>
      </form>

      {/* 2. Expanded Dashboard Output */}
      {apiResponse && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Block: Panic Analysis & Micro Sessions */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-400">Panic Analysis</h3>
              <span className="text-2xl font-black text-red-500">{apiResponse.panicScore}%</span>
            </div>
            <h2 className="text-xl font-bold text-white">{apiResponse.taskName}</h2>
            <p className="text-xs text-zinc-400 italic">"{apiResponse.calculatedUrgencyReason}"</p>
            
            <div className="pt-4 border-t border-zinc-800">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Micro-Sessions:</h4>
              <ul className="space-y-2">
                {apiResponse.microSessions.map((session, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-zinc-950 p-3 rounded-lg border border-zinc-850 text-xs">
                    <span className="text-zinc-300 font-medium">{session.title}</span>
                    <span className="text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">{session.durationMinutes}m</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Block: Dynamic Action Hub Studio */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-zinc-400">Action Hub Studio</h3>
              <span className="text-xs font-mono uppercase bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                {apiResponse.actionHubType}
              </span>
            </div>

            {/* Condition A: Text Draft Generator Layout */}
            {apiResponse.actionHubType === "draft_generator" && (
              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-xs text-orange-400 font-bold">AI Generated Script Draft:</label>
                <textarea
                  className="flex-1 w-full bg-zinc-950 border border-zinc-800 p-4 rounded-lg font-mono text-xs text-zinc-300 resize-none outline-none focus:border-orange-500/50 min-h-[200px]"
                  value={apiResponse.generatedScript}
                  readOnly
                />
              </div>
            )}
            
            {/* Condition B: Interactive Mock Interview / Viva Box (Fixed Cursor Focus) */}
            {apiResponse.actionHubType === "mock_interview" && (
              <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-4 rounded-lg overflow-y-auto space-y-3 min-h-[200px] text-xs">
                  {chatLogs.map((log, index) => (
                    <div key={index} className={`p-2 rounded max-w-[85%] ${log.sender === "ai" ? "bg-zinc-900 text-zinc-300 self-start" : "bg-orange-500/10 text-orange-400 self-end ml-auto"}`}>
                      <strong className="block text-[10px] uppercase text-zinc-500 mb-1">{log.sender === "ai" ? "AI Examiner" : "You"}</strong>
                      {log.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSandboxSendMessage} className="relative z-10 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs text-zinc-100 outline-none focus:border-orange-500 relative z-10"
                    placeholder="Type response to AI examiner..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-4 rounded-lg font-semibold transition-colors">
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Fallback Option */}
            {apiResponse.actionHubType !== "draft_generator" && apiResponse.actionHubType !== "mock_interview" && (
              <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs p-4 text-center">
                Interactive sandbox engine configured for context module: {apiResponse.actionHubType}
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}