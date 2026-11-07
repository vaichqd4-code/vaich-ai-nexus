export function BlogCoverGraphic({
  slug,
  category,
  className = "w-full h-full",
}: {
  slug: string;
  category?: string;
  className?: string;
}) {
  switch (slug) {
    case "defeat-procrastination-google-sheets-planner":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-emerald-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-emerald-500/20 select-none ${className}`}
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              FOCUS &amp; VELOCITY
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-300/80">PRO-SYSTEM</span>
            </div>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <circle cx="80" cy="50" r="38" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" strokeOpacity="0.4" />
              <circle cx="80" cy="50" r="28" stroke="#34d399" strokeWidth="3" strokeDasharray="140" strokeDashoffset="35" strokeLinecap="round" />
              <circle cx="80" cy="50" r="16" fill="#064e3b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" />
              <path d="M74 50l4 4 8-8" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M80 18v6M80 76v6M48 50h6M106 50h6" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
            </svg>
          </div>

          {/* Bottom Metatag */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-emerald-500/20 pt-2 font-mono">
            <span>GOOGLE SHEETS</span>
            <span className="text-emerald-400 font-bold">100% AUTOMATED</span>
          </div>
        </div>
      );

    case "best-study-planning-methods-digital-vs-paper":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-indigo-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-indigo-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-400/90 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              ACADEMIC MATRIX
            </span>
            <span className="text-[9px] font-mono text-indigo-300/80">STUDY V2.0</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <path d="M30 75h100" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" />
              <path d="M35 75v-50" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.4" />
              {/* Trend Curve */}
              <path d="M40 68 Q 70 65, 90 40 T 125 22" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M40 68 Q 70 65, 90 40 T 125 22 L125 75 L40 75 Z" fill="url(#indigoGrad)" fillOpacity="0.2" />
              <circle cx="125" cy="22" r="4" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2" />
              <circle cx="90" cy="40" r="3" fill="#818cf8" />
              <defs>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-indigo-500/20 pt-2 font-mono">
            <span>SPACED REPETITION</span>
            <span className="text-indigo-400 font-bold">SMART ANALYTICS</span>
          </div>
        </div>
      );

    case "daily-motivational-habits-powerful-routine":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-amber-950/30 to-neutral-950 flex flex-col justify-between p-5 border border-amber-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #f59e0b 1px, transparent 1px), linear-gradient(to bottom, #f59e0b 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              ATOMIC HABITS
            </span>
            <span className="text-[9px] font-mono text-amber-300/80">+1% EVERYDAY</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <circle cx="80" cy="50" r="32" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.5" />
              {/* Radiating Rays */}
              <path d="M80 10v8M80 82v8M40 50h-8M128 50h-8M52 22l6 6M102 72l6 6M52 78l6-6M102 28l6-6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
              <polygon points="80,32 86,45 100,45 89,54 93,68 80,59 67,68 71,54 60,45 74,45" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-amber-500/20 pt-2 font-mono">
            <span>MORNING ROUTINE</span>
            <span className="text-amber-400 font-bold">MIND DISCIPLINE</span>
          </div>
        </div>
      );

    case "habit-tracking-time-management-guide":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-cyan-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-cyan-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              CROSS-DEVICE SYNC
            </span>
            <span className="text-[9px] font-mono text-cyan-300/80">IOS • ANDROID • PC</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              {/* Matrix of Habit Ticks */}
              {[28, 48, 68, 88, 108, 128].map((x, i) => (
                <g key={i}>
                  <rect x={x - 8} y="32" width="16" height="16" rx="4" fill="#083344" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.6" />
                  <path d={`${x - 4} 40l3 3 5-6`} stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x={x - 8} y="54" width="16" height="16" rx="4" fill="#083344" stroke="#06b6d4" strokeWidth="1" strokeOpacity={i % 2 === 0 ? "0.6" : "0.3"} />
                  {i % 2 === 0 && <path d={`${x - 4} 62l3 3 5-6`} stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              ))}
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-cyan-500/20 pt-2 font-mono">
            <span>STREAK TRACKER</span>
            <span className="text-cyan-400 font-bold">100% CLOUD SYNC</span>
          </div>
        </div>
      );

    case "chatgpt-vs-claude-vs-gemini-comparison":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-purple-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-purple-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #a855f7 1px, transparent 1px), linear-gradient(to bottom, #a855f7 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              AI BENCHMARK
            </span>
            <span className="text-[9px] font-mono text-purple-300/80">PRO COMPARISON</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              {/* 3 Interlocking Core Rings representing ChatGPT, Claude, Gemini */}
              <circle cx="65" cy="45" r="22" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="95" cy="45" r="22" stroke="#c084fc" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="80" cy="62" r="22" stroke="#f472b6" strokeWidth="2" strokeOpacity="0.7" />
              <circle cx="80" cy="51" r="5" fill="#ffffff" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-purple-500/20 pt-2 font-mono">
            <span>GPT • CLAUDE • GEMINI</span>
            <span className="text-purple-400 font-bold">2024–2025 GUIDE</span>
          </div>
        </div>
      );

    case "flagship-ai-models-comparison":
    case "claude-3-5-sonnet-vs-gpt-4o-developers-designers":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-purple-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-purple-500/25 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #a855f7 1px, transparent 1px), linear-gradient(to bottom, #a855f7 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              GPT-6 • SONNET • GEMINI
            </span>
            <span className="text-[9px] font-mono text-cyan-300/80">FLAGSHIP 2026</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <rect x="25" y="22" width="50" height="56" rx="6" fill="#1e1b4b" fillOpacity="0.6" stroke="#a855f7" strokeWidth="1.5" />
              <path d="M35 34l8 8-8 8" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="47" y1="50" x2="63" y2="50" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
              
              <rect x="85" y="22" width="50" height="56" rx="6" fill="#082f49" fillOpacity="0.6" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="110" cy="42" r="12" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M102 58h16M106 64h8" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-purple-500/20 pt-2 font-mono">
            <span>ARTIFACTS vs CANVAS</span>
            <span className="text-purple-400 font-bold">2026 BENCHMARK</span>
          </div>
        </div>
      );

    case "ai-free-vs-plus-comparison":
    case "microsoft-copilot-vs-chatgpt-plus":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-rose-950/30 to-neutral-950 flex flex-col justify-between p-5 border border-rose-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #f43f5e 1px, transparent 1px), linear-gradient(to bottom, #f43f5e 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              FREE VS PLUS &amp; PRO
            </span>
            <span className="text-[9px] font-mono text-amber-300/80">LAB BENCHMARK</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <rect x="25" y="28" width="48" height="48" rx="8" fill="#1f1315" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="49" y="56" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">FREE</text>
              <path d="M80 52l12 0" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <path d="M87 47l5 5-5 5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="97" y="24" width="52" height="56" rx="8" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
              <text x="123" y="56" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">PLUS</text>
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-rose-500/20 pt-2 font-mono">
            <span>RATE LIMITS &amp; ERRORS</span>
            <span className="text-rose-400 font-bold">10X ROI</span>
          </div>
        </div>
      );

    case "how-google-sheets-planner-transforms-habits-goals":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-emerald-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-emerald-500/25 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SMART GOALS &amp; TIME BOXING
            </span>
            <span className="text-[9px] font-mono text-emerald-300/80">VAICH SYSTEM</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <rect x="30" y="20" width="100" height="60" rx="8" fill="#064e3b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" />
              <line x1="30" y1="36" x2="130" y2="36" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="62" y1="36" x2="62" y2="80" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="96" y1="36" x2="96" y2="80" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
              
              <rect x="40" y="44" width="14" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
              <rect x="72" y="44" width="14" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
              <rect x="106" y="44" width="14" height="10" rx="2" fill="#10b981" fillOpacity="0.4" />
              
              <rect x="40" y="60" width="14" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
              <rect x="72" y="60" width="14" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
              <rect x="106" y="60" width="14" height="10" rx="2" fill="#34d399" fillOpacity="0.8" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-emerald-500/20 pt-2 font-mono">
            <span>HABIT LOOP AUTOMATION</span>
            <span className="text-emerald-400 font-bold">100% FOCUS</span>
          </div>
        </div>
      );

    case "gemini-2-million-context-window-big-data-analysis":
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-blue-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-cyan-500/25 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              2M CONTEXT WINDOW
            </span>
            <span className="text-[9px] font-mono text-cyan-300/80">BIG DATA AI</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <circle cx="80" cy="50" r="35" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 3" />
              <circle cx="80" cy="50" r="22" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="80" cy="50" r="8" fill="#a855f7" />
              
              <line x1="80" y1="15" x2="80" y2="28" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="80" y1="72" x2="80" y2="85" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="45" y1="50" x2="58" y2="50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <line x1="102" y1="50" x2="115" y2="50" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-cyan-500/20 pt-2 font-mono">
            <span>GEMINI 4 ARGON MULTIMODAL</span>
            <span className="text-cyan-400 font-bold">2,000,000 TOKENS</span>
          </div>
        </div>
      );

    case "ai-tools-productivity-study-guide":
    default:
      return (
        <div
          className={`relative overflow-hidden bg-gradient-to-br from-neutral-900 via-blue-950/40 to-neutral-950 flex flex-col justify-between p-5 border border-blue-500/20 select-none ${className}`}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400/90 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              PROMPT ENGINEERING
            </span>
            <span className="text-[9px] font-mono text-blue-300/80">SPEED &amp; AUTOMATION</span>
          </div>

          <div className="relative z-10 my-auto flex items-center justify-center py-2">
            <svg viewBox="0 0 160 100" className="w-36 h-24" fill="none">
              <rect x="35" y="24" width="90" height="52" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.7" />
              <circle cx="46" cy="34" r="2.5" fill="#ef4444" />
              <circle cx="54" cy="34" r="2.5" fill="#f59e0b" />
              <circle cx="62" cy="34" r="2.5" fill="#10b981" />
              <path d="M46 50l6 4-6 4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="58" y1="58" x2="72" y2="58" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
              <path d="M78 48h28M78 54h20" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 border-t border-blue-500/20 pt-2 font-mono">
            <span>PROMPT MASTERY</span>
            <span className="text-blue-400 font-bold">10X WORKFLOW</span>
          </div>
        </div>
      );
  }
}
