import React from 'react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-sky-500 selection:text-white">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <span className="text-xl font-black text-white">R</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              ResQNet Platform
            </h1>
            <p className="text-xs text-slate-500 font-medium">Smart Disaster & Emergency Coordination</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80 hover:border-sky-500/30 transition-all duration-300">
            <h3 className="text-sm font-semibold text-sky-400">Phase 1 Initialized</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Workspace environments, TypeScript, Tailwind CSS, and bundlers configured successfully. Ready to build modules.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">Frontend Stack</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">React 19 + Vite</p>
            </div>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
              <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">Backend API</span>
              <p className="text-xs font-semibold text-slate-300 mt-1">Node + Express</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-[10px] text-slate-500 font-medium">
          <span>Target Environment: Localhost</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Client running on port 5173</span>
          </span>
        </div>
      </div>
    </div>
  );
}
