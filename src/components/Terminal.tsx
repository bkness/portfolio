'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};

const COMMANDS: Record<string, () => string[]> = {
  whoami: () => [
    "Brandon Kelly — Full Stack Developer",
    "Based in the US · Available for remote work",
    "",
    "I build CLIs, web apps, and mobile tools.",
    "1.3k+ npm downloads · Published open-source tooling · React Native · Node.js",
  ],
  'skills --list': () => [
    "── Languages ──────────────────────",
    "  JavaScript · TypeScript · Python · SQL",
    "",
    "── Frontend ───────────────────────",
    "  React · Next.js · React Native · Tailwind CSS · Handlebars",
    "",
    "── Backend ────────────────────────",
    "  Node.js · Express · FastAPI · GraphQL · REST",
    "",
    "── Databases ──────────────────────",
    "  MySQL · MongoDB · SQLite · PostgreSQL",
    "",
    "── Tools ──────────────────────────",
    "  Git · Docker · npm · Expo · zsh · Starship",
  ],
  'projects --featured': () => [
    "── Featured Projects ───────────────",
    "",
    "  [1] forged-cli          npm · 1.3k+ downloads",
    "       Security scanner + shell bootstrapper",
    "",
    "  [2] game-hub            GraphQL · Auth · CRUD",
    "       Full stack game tracker with conditional auth",
    "",
    "  [3] nightowlz           React Native · MongoDB · JWT",
    "       iOS nightlife discovery app",
    "",
    "  [4] breweries           Node · SQLite · Sequelize",
    "       Brewery finder — migrated from MySQL/Heroku",
    "",
    "  type  open <number>  to view a project",
  ],
  'contact --hire': () => [
    "── Let's work together ─────────────",
    "",
    "  Email    kbrandon863@gmail.com",
    "  GitHub   github.com/bkness",
    "  npm      npmjs.com/~bkness",
    "",
    "  Currently available for:",
    "  · Full-time remote roles",
    "  · Contract / freelance work",
  ],
  help: () => [
    "Available commands:",
    "",
    "  whoami               Who is this guy?",
    "  skills --list        Full tech stack",
    "  projects --featured  Featured work",
    "  contact --hire       Get in touch",
    "  clear                Clear terminal",
  ],
  clear: () => [],
};

const BOOT_LINES = [
  "forged-shell v0.3.9 — bkness/dotfiles",
  "Loading environment...",
  "● online",
  "",
  'Type  help  to see available commands.',
];

export default function Terminal() {
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [booted, setBooted] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Delay terminal appearance, then boot sequence
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      let i = 0;
      const interval = setInterval(() => {
        if (i < BOOT_LINES.length) {
          setOutput(prev => [...prev, { type: 'system', content: BOOT_LINES[i] }]);
          i++;
        } else {
          clearInterval(interval);
          setBooted(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }, 120);
    }, 1100);
    return () => clearTimeout(showTimer);
  }, []);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    setOutput(prev => [...prev, { type: 'input', content: `❯ ${cmd}` }]);

    if (trimmed === 'clear') {
      setOutput(BOOT_LINES.map(l => ({ type: 'system' as const, content: l })));
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      const lines = handler();
      setOutput(prev => [
        ...prev,
        ...lines.map(l => ({ type: 'output' as const, content: l })),
        { type: 'system', content: '' },
      ]);
    } else if (trimmed === '') {
      // do nothing
    } else {
      setOutput(prev => [
        ...prev,
        { type: 'error', content: `command not found: ${trimmed}` },
        { type: 'system', content: "type  help  to see available commands." },
        { type: 'system', content: '' },
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(0,255,65,0.04) 25%, rgba(0,255,65,0.12) 50%, rgba(0,255,65,0.04) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '4px',
  };

  if (!visible) {
    return (
      <div className="border border-[#00ff41]/10 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1a0f]/50 border-b border-[#1a3a22]/50">
          <span className="w-3 h-3 rounded-full bg-[#1a3a22]" />
          <span className="w-3 h-3 rounded-full bg-[#1a3a22]" />
          <span className="w-3 h-3 rounded-full bg-[#1a3a22]" />
          <span className="ml-4 inline-block w-32 h-3" style={shimmerStyle} />
        </div>
        <div className="p-6 min-h-[360px] bg-[#020a04]/60 space-y-4">
          <div className="h-3 w-3/4" style={shimmerStyle} />
          <div className="h-3 w-1/2" style={shimmerStyle} />
          <div className="h-3 w-2/3" style={shimmerStyle} />
          <div className="h-3 w-1/3" style={shimmerStyle} />
          <div className="h-3 w-0" />
          <div className="h-3 w-4/5" style={shimmerStyle} />
          <div className="h-3 w-2/5" style={shimmerStyle} />
          <div className="h-3 w-3/5" style={shimmerStyle} />
          <div className="h-3 w-1/4" style={shimmerStyle} />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
      <div
        className="border border-[#00ff41]/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.15),0_0_60px_rgba(0,255,65,0.05)] cursor-text"
        style={{ animation: 'fadeIn 1.5s ease-in-out 0s 1 normal forwards running' }}
        onClick={() => inputRef.current?.focus()}
      >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1a0f] border-b border-[#1a3a22]">
        <span className="w-3 h-3 rounded-full bg-[#ff4500]" />
        <span className="w-3 h-3 rounded-full bg-[#ffd43b]" />
        <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
        <span className="ml-4 text-[#4a7a55] text-sm">bkness@forged ~</span>
      </div>

      {/* Output */}
      <div className="p-6 min-h-[360px] max-h-[500px] overflow-y-auto bg-[#020a04]/90 text-sm leading-6">
        {output.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input'
                ? 'text-[#00ff41] font-bold'
                : line.type === 'error'
                ? 'text-[#ff4500]'
                : line.type === 'system'
                ? 'text-[#4a7a55]'
                : 'text-[#c8ffd4]'
            }
          >
            {line.content || ' '}
          </div>
        ))}

        {/* Input line */}
        {booted && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#4a7a55]">❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-[#00ff41] caret-[#00ff41]"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
    </>
  );
}
