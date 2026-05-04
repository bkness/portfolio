'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';

type OutputLine = {
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
};

type Phase = 'intro' | 'shimmer' | 'live';

type FakeCmd = {
  cmd: string;
  out?: string;
  typo?: { at: number; extra: string };
};

const FAKE_CMDS: FakeCmd[] = [
  { cmd: 'cd ~/dev/portfolio' },
  {
    cmd: 'git status',
    typo: { at: 4, extra: 'statis' },
    out: 'On branch main · up to date',
  },
  { cmd: 'npm run dev', out: 'starting server...' },
];

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

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(0,255,65,0.04) 25%, rgba(0,255,65,0.12) 50%, rgba(0,255,65,0.04) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '4px',
};

export default function Terminal() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [introLines, setIntroLines] = useState<{ type: 'cmd' | 'out'; text: string }[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState('');
  const [booted, setBooted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const runBootSequence = useCallback(() => {
    setOutput([]);
    setBooted(false);
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
  }, []);

  // Intro → shimmer → live sequence
  useEffect(() => {
    let cancelled = false;
    const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

    const run = async () => {
      for (const { cmd, out, typo } of FAKE_CMDS) {
        // type up to typo point, then type the wrong chars
        if (typo) {
          for (let i = 1; i <= typo.at + typo.extra.length; i++) {
            if (cancelled) return;
            const base = cmd.slice(0, Math.min(i, typo.at));
            const wrong = i > typo.at ? typo.extra.slice(0, i - typo.at) : '';
            setCurrentTyping(base + wrong);
            await delay(70);
          }
          // pause — "wait a sec..."
          await delay(600);
          // backspace the typo
          const wrongLen = typo.extra.length;
          for (let i = wrongLen; i >= 0; i--) {
            if (cancelled) return;
            setCurrentTyping(cmd.slice(0, typo.at) + typo.extra.slice(0, i));
            await delay(55);
          }
          // continue typing the rest correctly
          for (let i = typo.at + 1; i <= cmd.length; i++) {
            if (cancelled) return;
            setCurrentTyping(cmd.slice(0, i));
            await delay(70);
          }
        } else {
          for (let i = 1; i <= cmd.length; i++) {
            if (cancelled) return;
            setCurrentTyping(cmd.slice(0, i));
            await delay(70);
          }
        }
        if (cancelled) return;
        setIntroLines(prev => [...prev, { type: 'cmd', text: cmd }]);
        setCurrentTyping('');
        await delay(250);
        if (out) {
          if (cancelled) return;
          setIntroLines(prev => [...prev, { type: 'out', text: out }]);
          await delay(320);
        }
      }
      if (cancelled) return;
      setPhase('shimmer');
      await delay(750);
      if (cancelled) return;
      setPhase('live');
      runBootSequence();
    };

    run();
    return () => { cancelled = true; };
  }, [runBootSequence]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setOutput(prev => [...prev, { type: 'input', content: `❯ ${cmd}` }]);

    if (trimmed === 'clear') {
      runBootSequence();
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
        { type: 'system', content: 'type  help  to see available commands.' },
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

  const titleBar = (dim = false) => (
    <div className={`flex items-center gap-2 px-4 py-3 border-b ${dim ? 'bg-[#0a1a0f]/50 border-[#1a3a22]/50' : 'bg-[#0a1a0f] border-[#1a3a22]'}`}>
      <span className={`w-3 h-3 rounded-full ${dim ? 'bg-[#1a3a22]' : 'bg-[#ff4500]'}`} />
      <span className={`w-3 h-3 rounded-full ${dim ? 'bg-[#1a3a22]' : 'bg-[#ffd43b]'}`} />
      <span className={`w-3 h-3 rounded-full ${dim ? 'bg-[#1a3a22]' : 'bg-[#00ff41]'}`} />
      {dim
        ? <span className="ml-4 inline-block w-32 h-3" style={shimmerStyle} />
        : <span className="ml-4 text-[#4a7a55] text-sm">bkness@forged ~</span>
      }
    </div>
  );

  // Phase 1 — fake typing intro
  if (phase === 'intro') {
    return (
      <div className="border border-[#00ff41]/30 rounded-lg overflow-hidden">
        {titleBar()}
        <div className="p-6 min-h-[360px] bg-[#020a04]/90 text-sm leading-6">
          {introLines.map((line, i) => (
            <div key={i} className={line.type === 'cmd' ? 'text-[#00ff41] font-bold' : 'text-[#4a7a55]'}>
              {line.type === 'cmd' ? `❯ ${line.text}` : `  ${line.text}`}
            </div>
          ))}
          {currentTyping && (
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[#4a7a55]">❯</span>
              <span className="text-[#00ff41] font-bold ml-1">{currentTyping}</span>
              <span className="inline-block w-[2px] h-4 bg-[#00ff41] ml-0.5 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Phase 2 — shimmer skeleton
  if (phase === 'shimmer') {
    return (
      <div className="border border-[#00ff41]/10 rounded-lg overflow-hidden">
        {titleBar(true)}
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

  // Phase 3 — live interactive terminal
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
        {titleBar()}
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
              {line.content || ' '}
            </div>
          ))}
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
