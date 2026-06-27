"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Mic, 
  Send, 
  Sparkles, 
  Zap, 
  RefreshCw 
} from "lucide-react";

// --- Types ---
interface MicroSession {
  title: string;
  durationMinutes: number;
}

interface TaskData {
  id?: string;
  taskName: string;
  panicScore: number;
  urgencyReason: string;
  actionHubType: "mock_interview" | "draft_generator" | "research_summary" | string;
  microSessions: MicroSession[];
}

export default function Dashboard() {
  // --- Core States ---
  const [stressInput, setStressInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  
  // Simulated historic/recent tasks to pad out the Panic Triage list visually
  const [recentTasks, setRecentTasks] = useState<TaskData[]>([
    {
      taskName: "Database Schema Submission",
      panicScore: 45,
      urgencyReason: "Due in 6 hours; core design needs validation.",
      actionHubType: "research_summary",
      microSessions: [
        { title: "Review indexes", durationMinutes: 15 },
        { title: "Export SQL DDL", durationMinutes: 20 }
      ]
    }
  ]);

  // --- Handlers ---
  const handleStressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stressInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stressInput }),
      });

      const data = await response.json();

      if (data.success || data.taskName) {
        const parsedTask: TaskData = {
          taskName: data.taskName,
          panicScore: data.panicScore || 50,
          urgencyReason: data.urgencyReason || "Calculated priority threshold active.",
          actionHubType: data.actionHubType || "research_summary",
          microSessions: data.microSessions || []
        };

        setCurrentTask(parsedTask);
        setRecentTasks(prev => [parsedTask, ...prev]);
        setStressInput("");
      } else {
        alert("Server responded but could not process the crisis data format.");
      }
    } catch (err) {
      console.error("Triage Error:", err);
      alert("Failed to reach triage engine. Check console logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncToGoogleCalendar = async () => {
    if (!currentTask || !currentTask.microSessions || currentTask.microSessions.length === 0) {
      alert("No active timeline sessions found to sync! Please triage a task first.");
      return;
    }

    let currentStartTime = new Date();

    console.log("=== Packaging Timeblocks for Google Calendar Framework ===");
    
    currentTask.microSessions.forEach((session) => {
      const durationMin = Number(session.durationMinutes) || 30;
      
      const year = currentStartTime.getFullYear();
      const month = String(currentStartTime.getMonth() + 1).padStart(2, '0');
      const day = String(currentStartTime.getDate()).padStart(2, '0');
      const hours = String(currentStartTime.getHours()).padStart(2, '0');
      const minutes = String(currentStartTime.getMinutes()).padStart(2, '0');
      const startString = `${year}${month}${day}T${hours}${minutes}`;

      console.log(`Structured: [Life Saver] ${session.title} | Start: ${startString} | Duration: ${durationMin}m`);
      
      // Push time forward for successive time-blocking
      currentStartTime = new Date(currentStartTime.getTime() + durationMin * 60 * 1000);
    });

    alert("📅 Micro-sessions structured successfully! Ready to push directly to Google Calendar.");
  };

  // Helper helper to color-code panic gauges dynamically
  const getPanicColor = (score: number) => {
    if (score >= 80) return "text-rose-500 border-rose-500/30 bg-rose-500/10";
    if (score >= 50) return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 selection:bg-rose-500 selection:text-white">
      {/* Header Container */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-zinc-800 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-600 rounded-xl shadow-lg shadow-rose-600/20 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">The Last-Minute Life Saver</h1>
            <p className="text-xs text-zinc-400">High-Agency Proactive AI Companion</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Pipeline Live</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left & Center Space: Input, Triage Grid, Action Hub */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Omni-Input Bar Section */}
          <section className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 shadow-xl">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> What's stressing you out right now?
            </h2>
            <form onSubmit={handleStressSubmit} className="relative flex items-center">
              <input
                type="text"
                value={stressInput}
                onChange={(e) => setStressInput(e.target.value)}
                placeholder="e.g., 'I have an electronics lab exam tomorrow morning and haven't opened the notebook...'"
                disabled={isLoading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-4 pr-24 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all disabled:opacity-50"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  title="Voice Input (Coming Soon)"
                  className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !stressInput.trim()}
                  className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white disabled:text-zinc-500 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition shadow-lg shadow-rose-600/10"
                >
                  {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Triage
                </button>
              </div>
            </form>
          </section>

          {/* Panic Triage Zone Grid */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-white tracking-wide">Panic Triage Zone</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTasks.map((task, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-md hover:border-zinc-700 transition">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-semibold text-sm text-white line-clamp-1">{task.taskName}</h3>
                      <div className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getPanicColor(task.panicScore)}`}>
                        {task.panicScore}%
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{task.urgencyReason}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="capitalize bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                      Mode: {task.actionHubType.replace("_", " ")}
                    </span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Activated</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Context-Aware Action Hub Container */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-4 tracking-wide flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Active Execution Sandbox
            </h2>
            
            {currentTask ? (
              <div className="space-y-4">
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">Currently Calibrating</span>
                  <h3 className="text-base font-semibold text-white mt-0.5">{currentTask.taskName}</h3>
                </div>

                {currentTask.actionHubType === "mock_interview" && (
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 space-y-4">
                    <p className="text-xs text-zinc-300">🎯 <strong className="text-white">AI Viva Prep Assistant Loaded:</strong> Ready to challenge your understanding before the evaluation deadline kicks off.</p>
                    <div className="h-32 bg-zinc-900 rounded-lg p-3 text-xs text-zinc-500 overflow-y-auto italic flex items-center justify-center border border-zinc-800/40">
                      [Interactive Mock Interview Chat Workspace Initialized]
                    </div>
                    <input type="text" placeholder="Type response to AI examiner..." className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2.5 focus:outline-none" disabled />
                  </div>
                )}

                {currentTask.actionHubType === "draft_generator" && (
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 space-y-3">
                    <p className="text-xs text-zinc-300">📝 <strong className="text-white">AI Draft Studio Ready:</strong> Edit and copy your automatically generated response script immediately below.</p>
                    <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-3 text-zinc-300 focus:outline-none resize-none" defaultValue={`Dear Team,\n\nRegarding the urgent deliverables for "${currentTask.taskName}"...`} />
                  </div>
                )}

                {currentTask.actionHubType === "research_summary" && (
                  <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 space-y-2">
                    <p className="text-xs text-zinc-300">📚 <strong className="text-white">AI Study Cheat-Sheet Summary:</strong> Concentrated high-impact knowledge blocks compiled from your prompt baseline context.</p>
                    <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800/60 text-xs text-zinc-400 space-y-1.5">
                      <p>• High Priority Core Architecture Breakdown</p>
                      <p>• Emergency Verification Protocols Block</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-40 bg-zinc-950 rounded-xl border border-zinc-800/60 border-dashed flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="w-6 h-6 text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No active triage event running.</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Submit a deadline threat above to launch targeted execution workspaces.</p>
              </div>
            )}
          </section>

        </div>

        {/* Right Sidebar: AI Time-Blocker Timeline */}
        <div className="space-y-6">
          <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Time-Blocker
              </h3>
              <button 
                onClick={handleSyncToGoogleCalendar}
                className="px-3 py-1.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/10 transition flex items-center gap-1"
              >
                📅 Sync to Google Calendar
              </button>
            </div>

            {currentTask && currentTask.microSessions.length > 0 ? (
              <div className="relative pl-4 border-l-2 border-zinc-800 space-y-6">
                {currentTask.microSessions.map((session, index) => (
                  <div key={index} className="relative group">
                    {/* Ring Icon indicator along timeline rule line */}
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border border-zinc-950 group-hover:scale-125 transition" />
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-zinc-200 group-hover:text-rose-400 transition">
                          {session.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-zinc-500" /> {session.durationMinutes}m
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-normal">
                        Sequential Sprint Interval #{index + 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center text-zinc-600 border border-zinc-800/40 rounded-xl bg-zinc-950/60 p-4">
                <Clock className="w-5 h-5 text-zinc-700 mb-2" />
                <p className="text-xs">No Scheduled Micro-Sessions</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">Timeblocks show up here instantly post-triage.</p>
              </div>
            )}
          </section>
        </div>

      </main>
    </div>
  );
}