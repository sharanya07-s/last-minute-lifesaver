"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Copy, 
  Edit3, 
  Mic, 
  Send, 
  Sparkles 
} from "lucide-react";

// Strict TypeScript interfaces matching your backend JSON contract
interface MicroSession {
  title: string;
  durationMinutes: number;
}

interface TriagePayload {
  taskName: string;
  panicScore: number;
  calculatedUrgencyReason: string;
  microSessions: MicroSession[];
  actionHubType: "mock_interview" | "draft_generator" | "research_summary";
  generatedScript?: string;
}

export default function Dashboard() {
  const [inputTask, setInputTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // App state initializing with your working Presentation Readiness snapshot
  const [apiResponse, setApiResponse] = useState<TriagePayload | null>({
    taskName: "Emergency Presentation Readiness",
    panicScore: 88,
    calculatedUrgencyReason: "Calibration emergency presentation needs immediate structure and script deployment to prevent deadline lapse.",
    actionHubType: "draft_generator",
    generatedScript: `Dear Team,\n\nRegarding the urgent deliverables for "Emergency Presentation Readiness", I have triaged our immediate execution steps. We are establishing a focused containment strategy to lock down the database schema submission (currently at 45%) and align our core technical blocks.\n\nPlease review the chronological micro-sessions detailed in our pipeline dashboard so we can synchronize effectively.\n\nBest regards,\n[Your Name]`,
    microSessions: [
      { title: "Review Core Slides & Structure", durationMinutes: 30 },
      { title: "Draft Team Alignment Script", durationMinutes: 45 },
      { title: "Finalize Schema Submission Sync", durationMinutes: 30 }
    ]
  });

  // Core handler sending user crisis straight to the Gemini API
  const handleStressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: inputTask }),
      });

      if (!response.ok) throw new Error("API Triage failed");
      const data: TriagePayload = await response.json();
      setApiResponse(data);
      setInputTask("");
    } catch (error) {
      console.error("Error triaging stress input:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!apiResponse?.generatedScript) return;
    navigator.clipboard.writeText(apiResponse.generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r pt-0.5 from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              The Last-Minute Life Saver
            </h1>
            <p className="text-xs text-zinc-500 font-mono">Status: Active Execution Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Production Live
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Omni-Input Bar */}
        <form onSubmit={handleStressSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-20 group-focus-within:opacity-40 transition duration-300 blur-sm" />
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 shadow-xl">
            <Sparkles className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
            <input
              type="text"
              value={inputTask}
              onChange={(e) => setInputTask(e.target.value)}
              disabled={isLoading}
              placeholder="What's stressing you out right now? (e.g., 'Presentation in 2 hours and I have no slides...')"
              className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none text-sm disabled:opacity-50"
            />
            <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 transition shrink-0">
              <Mic className="w-4 h-4" />
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="ml-2 flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 font-medium text-xs rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 font-mono shrink-0"
            >
              {isLoading ? "Triaging..." : <>Triage <Send className="w-3 h-3" /></>}
            </button>
          </div>
        </form>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Panic Triage & Dynamic Action Hub */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Panic Triage Card */}
            {apiResponse && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-md backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      Panic Triage Zone
                    </span>
                    <h2 className="text-xl font-bold mt-2 text-zinc-100">{apiResponse.taskName}</h2>
                  </div>
                  {/* Gauge */}
                  <div className="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 shrink-0">
                    <span className="text-2xl font-black font-mono text-red-500">{apiResponse.panicScore}%</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-0.5">Panic Score</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans border-l-2 border-zinc-700 pl-3 italic">
                  "{apiResponse.calculatedUrgencyReason}"
                </p>

                {/* Progress Indicators */}
                <div className="mt-4 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4 text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Database Schema Submission: <span className="text-zinc-300 font-bold">45%</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Context Status: <span className="text-emerald-400 font-bold">Triage Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Action Hub Sandbox */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-md backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold tracking-tight text-zinc-200">
                    AI Draft Studio Ready: Sandbox Active
                  </h3>
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Script"}
                </button>
              </div>

              {/* DYNAMIC TEXT CONTAINER */}
              <div className="relative group">
                <textarea
                  value={apiResponse?.generatedScript || ""}
                  onChange={(e) => {
                    if (apiResponse) {
                      setApiResponse({ ...apiResponse, generatedScript: e.target.value });
                    }
                  }}
                  placeholder="No script active. Submit a scenario using the input bar above to populate your production sandbox script container on the fly."
                  className="w-full h-56 p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none focus:border-zinc-700 resize-none shadow-inner group-hover:border-zinc-800 transition"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-2 text-right">
                Edit and copy your automatically generated response script immediately above.
              </p>
            </div>
          </div>

          {/* Column 3: Chronological Time-Blocker */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 shadow-md backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
                <Calendar className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-200">AI Intelligent Time-Blocker</h3>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {apiResponse && apiResponse.microSessions.map((session, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative group">
                    <div className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-400 group-hover:border-orange-500/50 transition shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="bg-zinc-950/60 border border-zinc-800/60 group-hover:border-zinc-800 rounded-xl p-3.5 flex-1 transition">
                      <h4 className="text-xs font-bold text-zinc-200">{session.title}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 mt-1.5">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        Duration: {session.durationMinutes} mins
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button 
              type="button" 
              onClick={() => alert("Successfully simulated micro-session orchestration timeline sync to Google Calendar API hooks!")}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-zinc-950 text-xs font-bold font-mono tracking-wide uppercase rounded-xl shadow-lg shadow-emerald-500/10 transition"
            >
              <Calendar className="w-4 h-4" /> Sync to Google Calendar
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}