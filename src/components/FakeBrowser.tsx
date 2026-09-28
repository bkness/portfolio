'use client';

import { useEffect, useState } from 'react';
import { TERMINAL_PROJECTS, ProjectData } from '@/data/projects';
import Asteroids from '@/components/Asteroids';
import DoomScroll from '@/components/DoomScroll';
import AolScreen from '@/components/AolScreen';
import Doom from '@/components/Doom';
import Wolfenstein from '@/components/Wolfenstein';

// ── Forged scan lines (module-level to avoid closure issues) ────────────────
const FORGED_LINES = [
  '$ npm install -g forged-cli',
  '',
  'added 23 packages in 1.2s',
  '',
  '$ forged scan react',
  '',
  '  scanning react@18.3.1...',
  '  typosquat check ......... ok',
  '  integrity check ......... ok',
  '  publisher check ......... trusted',
  '  binary scan ............. clean',
  '',
  '  safe to install',
  '',
  '$ forged pass --length 24',
  '',
  '  kV8#mP2$nX9@qL5*jR7!wE3&',
  '',
  '$ _',
];

// ── Project Previews ────────────────────────────────────────────────────────

function ForgedPreview() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < FORGED_LINES.length) {
        setLines(prev => [...prev, FORGED_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 110);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[#0a0a0a] font-mono text-sm overflow-auto p-8">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-[#00ff41]">forged-cli</span>
          <span className="text-xs text-gray-500 border border-[#2a2a2a] px-2 py-0.5 rounded">v0.3.9</span>
          <span className="text-xs text-green-400 border border-green-900 bg-green-950/30 px-2 py-0.5 rounded">1.3k+ downloads</span>
        </div>
        <p className="text-gray-500 text-xs leading-5 mb-8">
          Security-first developer CLI — scan packages before you install them.<br />
          Typosquat detection · tarball integrity · binary scanning · password generation.
        </p>
        <div className="space-y-0.5">
          {lines.map((line, i) => {
            const l = line ?? '';
            const cls = l.startsWith('$')
              ? 'text-[#00ff41]'
              : l.includes('safe to install')
              ? 'text-[#00ff41] font-bold'
              : l.includes('scanning')
              ? 'text-[#00ff41]'
              : l.includes('ok') || l.includes('trusted') || l.includes('clean')
              ? 'text-gray-300'
              : l.includes('kV8')
              ? 'text-[#ffd43b]'
              : 'text-gray-500';
            return <div key={i} className={cls}>{l || ' '}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

const GAMES = [
  { title: 'Elden Ring',      platform: 'PS5', status: 'Playing',   icon: '⚔️' },
  { title: "Baldur's Gate 3", platform: 'PC',  status: 'Completed', icon: '🎲' },
  { title: 'Hollow Knight',   platform: 'PC',  status: 'Playing',   icon: '🦋' },
  { title: 'God of War',      platform: 'PS5', status: 'Completed', icon: '🪓' },
];

function GameHubPreview() {

  return (
    <div className="h-full bg-[#0f0f1a] text-white overflow-auto">
      <nav className="bg-[#1a1a2e] px-6 py-4 flex items-center justify-between border-b border-[#2a2a4a]">
        <div className="text-xl font-bold text-purple-400">GameHub</div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Library</span>
          <span>Discover</span>
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">B</div>
        </div>
      </nav>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-lg font-bold text-white">My Library</h2>
          <span className="text-sm text-gray-500">4 games tracked</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {GAMES.map((game, i) => (
            <div key={i} className="bg-[#1a1a2e] rounded-lg p-4 border border-[#2a2a4a] hover:border-purple-500/50 transition-colors cursor-pointer">
              <div className="text-3xl mb-3">{game.icon}</div>
              <div className="font-semibold text-sm text-white">{game.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{game.platform}</div>
              <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full border ${
                game.status === 'Playing'
                  ? 'bg-green-900/40 text-green-400 border-green-800'
                  : 'bg-[#252535] text-gray-400 border-[#3a3a5a]'
              }`}>
                {game.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a2e] rounded-lg p-4 border border-[#2a2a4a]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">GraphQL API</div>
              <div className="text-xs text-gray-500 mt-0.5">JWT auth · Full CRUD · Conditional rendering</div>
            </div>
            <div className="text-xs text-purple-400 font-mono bg-purple-950/30 border border-purple-900 px-2 py-1 rounded">
              POST /graphql
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VENUES = [
  { name: 'The Owl Bar',    type: 'Bar · Live Music',         distance: '0.3 mi', open: true,  icon: '🦉' },
  { name: 'Neon Nights',    type: 'Club · Dancing',           distance: '0.7 mi', open: true,  icon: '🌃' },
  { name: 'Rooftop Social', type: 'Lounge · Craft Cocktails', distance: '1.1 mi', open: false, icon: '🌙' },
];

function NightOwlzPreview() {

  return (
    <div className="h-full bg-[#09000f] text-white overflow-auto flex flex-col md:flex-row items-center md:items-start justify-start md:justify-center gap-6 md:gap-10 py-8 px-6">
      <div className="w-[300px] shrink-0 bg-[#0d0018] rounded-[36px] border-2 border-[#2a1a4a] overflow-hidden shadow-2xl shadow-purple-900/20">
        <div className="bg-[#0d0018] px-6 pt-3 pb-1 flex items-center justify-between text-[10px] text-gray-500">
          <span>9:41</span>
          <div className="flex gap-1.5"><span>WiFi</span><span>100%</span></div>
        </div>

        <div className="px-5 pt-3 pb-4">
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            nightowlz 🦉
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">Near Downtown · 11:23 PM</div>
        </div>

        <div className="mx-5 mb-4 bg-[#180d2a] rounded-xl px-4 py-2 flex items-center gap-2 border border-[#2a1a4a]">
          <span className="text-gray-600 text-xs">Search venues...</span>
        </div>

        <div className="px-5 space-y-2.5 pb-5">
          {VENUES.map((v, i) => (
            <div key={i} className="bg-[#180d2a] rounded-2xl p-3.5 border border-[#2a1a4a]">
              <div className="flex items-start justify-between mb-1">
                <span className="text-lg">{v.icon}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${v.open ? 'bg-green-900/50 text-green-400' : 'bg-red-900/30 text-red-500'}`}>
                  {v.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="font-semibold text-xs text-white">{v.name}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{v.type}</div>
              <div className="text-[10px] text-purple-400 mt-0.5">{v.distance}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#0d0018] border-t border-[#2a1a4a] px-6 py-2.5 flex justify-around">
          {['🏠', '🗺️', '❤️', '👤'].map((icon, i) => (
            <div key={i} className={`text-base ${i === 0 ? 'text-purple-400' : 'text-gray-700'}`}>{icon}</div>
          ))}
        </div>
        <div className="flex justify-center py-1.5">
          <div className="w-20 h-0.5 bg-gray-700 rounded-full" />
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="text-base font-bold text-purple-300 mb-3">nightowlz</div>
        <div className="space-y-1.5 text-xs text-gray-500 leading-5">
          <div className="text-gray-400">React Native · Expo</div>
          <div>MongoDB backend</div>
          <div>JWT authentication</div>
          <div>iOS + web from one codebase</div>
          <div>Live on the web · TestFlight in progress</div>
        </div>
        <div className="mt-5 flex flex-col gap-2 items-center md:items-start">
          {[
            { label: 'Venues', color: 'bg-purple-900/40 text-purple-300' },
            { label: 'Auth',   color: 'bg-pink-900/40 text-pink-300' },
            { label: 'Maps',   color: 'bg-blue-900/40 text-blue-300' },
          ].map(b => (
            <span key={b.label} className={`text-xs px-2 py-0.5 rounded ${b.color} w-fit`}>{b.label}</span>
          ))}
        </div>
        <a href="https://github.com/bkness/nightowlz" target="_blank" rel="noopener noreferrer"
          className="mt-6 inline-block text-xs text-purple-400 hover:text-purple-300 border border-purple-800 px-3 py-1.5 rounded-lg transition-colors">
          github ↗
        </a>
      </div>
    </div>
  );
}

const BREWERIES = [
  { name: 'Sundown Brewing Co.',  city: 'Phoenix, AZ',    type: 'Micro',    beers: 12 },
  { name: 'Desert Hops',          city: 'Tempe, AZ',      type: 'Nano',     beers: 8  },
  { name: 'Copper State Ales',    city: 'Scottsdale, AZ', type: 'Regional', beers: 24 },
  { name: 'Red Rock Craft',       city: 'Mesa, AZ',       type: 'Brewpub',  beers: 16 },
];

function BreweriesPreview() {

  return (
    <div className="h-full bg-[#130e05] text-white overflow-auto">
      <div className="bg-[#1e1508] px-6 py-5 border-b border-[#2e2010]">
        <h1 className="text-xl font-bold text-[#d4a054]">Brewery Finder</h1>
        <p className="text-xs text-[#7a5030] mt-0.5">Find local craft breweries near you</p>
      </div>

      <div className="max-w-xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <div className="flex-1 bg-[#1e1508] border border-[#2e2010] rounded-lg px-4 py-2 text-sm text-[#d4a054] font-mono">
            Phoenix, AZ
          </div>
          <button className="bg-[#d4a054] text-[#130e05] px-4 py-2 rounded-lg text-sm font-bold">Search</button>
        </div>

        <div className="text-xs text-[#7a5030] mb-3">4 breweries found near Phoenix, AZ</div>

        <div className="space-y-2.5">
          {BREWERIES.map((b, i) => (
            <div key={i} className="bg-[#1e1508] rounded-lg p-4 border border-[#2e2010] hover:border-[#d4a054]/40 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-[#d4a054] text-sm">{b.name}</div>
                  <div className="text-xs text-[#7a5030] mt-0.5">{b.city}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-[#7a5030] border border-[#2e2010] px-2 py-0.5 rounded">{b.type}</span>
                  <span className="text-xs text-[#d4a054]">{b.beers} on tap</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#1e1508] rounded-lg p-4 border border-[#2e2010] font-mono text-xs">
          <div className="text-[#d4a054] font-bold mb-2">Stack</div>
          <div className="text-[#7a5030] space-y-0.5">
            <div>Node.js · Express · Sequelize</div>
            <div>PostgreSQL (Supabase) · rebuilt from a group project</div>
            <div>Handlebars templating · Deployed on Vercel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mirrors the real app: dark lanes with a thin accent, cards as the only
// solid objects, dot labels in mono. Content is the live starter board.
const KANBAN_LANES = [
  { title: 'Up next', accent: '#FBBF24', cards: [
    { title: 'Beginner setup walkthrough for forged init', labels: [['web', '#4F8EFF']], due: 'due oct 12' },
    { title: 'Auto-verify flagged npm publishers', labels: [['security', '#FB7185'], ['backend', '#A78BFA']] },
    { title: 'Sync this board to an account', labels: [['backend', '#A78BFA']] },
  ] },
  { title: 'In progress', accent: '#4F8EFF', cards: [
    { title: 'Kanban design pass', labels: [['web', '#4F8EFF']], due: 'due oct 1' },
    { title: 'Resume link refresh', labels: [['docs', '#FBBF24']], due: 'due sep 30', soon: true },
  ] },
  { title: 'Shipped', accent: '#34D399', done: true, cards: [
    { title: 'Night Owlz in the browser', labels: [['web', '#4F8EFF']] },
    { title: 'One-click demo accounts', labels: [['backend', '#A78BFA']] },
    { title: 'forged 0.4: known-malware lookup', labels: [['security', '#FB7185']] },
  ] },
] as { title: string; accent: string; done?: boolean; cards: { title: string; labels: string[][]; due?: string; soon?: boolean }[] }[];

function KanbanPreview() {
  return (
    // Sans like the real app; labels, stats and dates stay mono (font-mono)
    <div className="h-full bg-[#0C0C10] text-[#EEEEF5] overflow-auto flex flex-col"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <nav className="h-12 shrink-0 px-5 flex items-center justify-between border-b border-[#2A2A3A] bg-[#13131A]/85">
        <div className="flex items-center gap-2 text-sm font-bold">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#4F8EFF] to-[#A78BFA] flex items-center justify-center text-[11px]">⊞</div>
          Kanban
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 h-7 rounded-md border border-[#2A2A3A] text-[#8888A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" /> sam@example.com
          </span>
          <span className="px-3 h-7 flex items-center rounded-md bg-[#4F8EFF] text-white font-semibold">+ New card</span>
        </div>
      </nav>

      <div className="px-5 pt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.1em] text-[#4F8EFF]">PORTFOLIO</div>
          <div className="text-lg font-bold tracking-tight">Launch board</div>
          <div className="mt-1 font-mono text-[11px] text-[#55556A]">
            <span className="text-[#8888A8]">8</span> cards <span className="mx-2 text-[#38384C]">·</span>
            <span className="text-[#8888A8]">0</span> overdue <span className="mx-2 text-[#38384C]">·</span>
            <span className="text-[#8888A8]">3</span> done
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-40 px-2.5 py-1.5 rounded-md border border-[#2A2A3A] bg-[#1A1A24] text-[11px] text-[#55556A] flex justify-between">
            Search cards… <span className="font-mono border border-[#38384C] rounded px-1 text-[10px]">/</span>
          </div>
          {[['Web', '#4F8EFF'], ['Backend', '#A78BFA'], ['Security', '#FB7185']].map(([t, c]) => (
            <span key={t} className="hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: c, borderColor: c + '59' }}>{t}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-2.5 px-5 pt-3 pb-4 overflow-x-auto">
        {KANBAN_LANES.map(lane => (
          <div key={lane.title} className="flex-1 min-w-[200px] max-w-[300px] flex flex-col">
            <div className="h-0.5 rounded opacity-85" style={{ background: lane.accent }} />
            <div className="flex items-center justify-between px-1 pt-3 pb-2">
              <span className="text-[13px] font-semibold">{lane.title}</span>
              <span className="font-mono text-[11px] text-[#55556A]">{lane.cards.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              {lane.cards.map(card => (
                <div key={card.title} className={`rounded-md bg-[#13131A] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${lane.done ? 'opacity-75' : ''}`}>
                  <div className="flex flex-wrap gap-3 mb-1.5">
                    {card.labels.map(([t, c]) => (
                      <span key={t} className="flex items-center gap-1.5 font-mono text-[10px] text-[#8888A8]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />{t}
                      </span>
                    ))}
                  </div>
                  <div className={`text-[12px] font-medium leading-snug ${lane.done ? 'text-[#8888A8]' : ''}`}>{card.title}</div>
                  {card.due && <div className={`mt-2 font-mono text-[10px] ${card.soon ? 'text-[#FBBF24]' : 'text-[#55556A]'}`}>{card.due}</div>}
                </div>
              ))}
              <div className="px-2 py-1 text-[11px] text-[#55556A]">＋ Add card</div>
            </div>
          </div>
        ))}
        {/* a collapsed lane, like the real board's rails */}
        <div className="w-8 shrink-0 mt-2 rounded-md bg-[#13131A]/60 flex flex-col items-center gap-2 py-3 text-[#8888A8]">
          <span className="font-mono text-[10px] text-[#55556A]">6</span>
          <span className="text-[12px] font-semibold [writing-mode:vertical-rl]">Ideas</span>
        </div>
      </div>

      <div className="shrink-0 border-t border-[#2A2A3A] px-5 py-2 font-mono text-[10px] text-[#55556A] flex flex-wrap gap-x-4 gap-y-1">
        <span>React · TypeScript · Zustand · dnd-kit</span>
        <span>Vercel Functions · Postgres (Neon)</span>
        <span>versioned sync · 36 Playwright tests</span>
      </div>
    </div>
  );
}

// Mirrors devlogger's "cyber" theme. Entries are real work from this week.
const DEVLOGS = [
  { title: 'Moved devlogger from Render to Vercel', body: 'No more 50s cold start. Functions in pdx1, next to the Neon database.', tags: ['deploy', 'vercel'], when: '2d ago' },
  { title: 'Fixed the missing Log.tags migration', body: 'Tags were added with db push, so prod never got the column. Always migrate dev.', tags: ['prisma', 'bugfix'], when: '3d ago' },
  { title: 'One-click demo account', body: '"// try the demo" signs in with seeded sample logs, no sign-up needed.', tags: ['auth', 'ux'], when: '3d ago' },
];

function DevloggerPreview() {
  return (
    <div
      className="h-full text-[rgba(200,240,255,0.85)] overflow-auto font-mono"
      style={{
        background: '#040a10',
        backgroundImage: 'linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <nav className="h-12 px-5 flex items-center justify-between border-b border-[rgba(0,229,255,0.15)] bg-[#071018]/90">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.3)]">DL</div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#00e5ff]">DEVLOGGER</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] tracking-widest text-[rgba(200,240,255,0.35)]">
          <span className="text-[#00e5ff]">LOGS</span>
          <span className="hidden sm:inline">STATS</span>
          <span className="px-2.5 py-1 border border-[rgba(0,255,136,0.4)] bg-[rgba(0,255,136,0.13)] text-[#00ff88]">+ NEW LOG</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-5">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 min-w-[180px] px-3 py-2 border border-[rgba(0,229,255,0.15)] bg-[#050d14] text-[11px] text-[rgba(200,240,255,0.35)]">
            search logs...
          </div>
          <div className="px-3 py-2 border border-[rgba(0,229,255,0.15)] bg-[#050d14] text-[11px]">newest ▾</div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {[['34', 'logs'], ['6', 'weeks'], ['3', 'themes']].map(([n, l]) => (
            <div key={l} className="border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.06)] px-3 py-2.5">
              <div className="text-lg font-bold text-[#00e5ff]">{n}</div>
              <div className="text-[9px] tracking-widest uppercase text-[rgba(200,240,255,0.35)]">{l}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5">
          {DEVLOGS.map(log => (
            <div key={log.title} className="border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.06)] p-4 hover:border-[rgba(0,229,255,0.35)] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[13px] font-bold text-[#00e5ff]">{log.title}</div>
                <div className="text-[10px] text-[rgba(200,240,255,0.35)] shrink-0">{log.when}</div>
              </div>
              <div className="text-[11px] leading-5 mt-1.5">{log.body}</div>
              <div className="flex gap-1.5 mt-2.5">
                {log.tags.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 border border-[rgba(0,255,136,0.4)] text-[#00ff88]">#{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-[10px] text-[rgba(200,240,255,0.35)] leading-5">
          Next.js 16 · Prisma 7 · Postgres (Neon) · NextAuth<br />
          3 themes × 3 navbars × 3 toasts · rate-limited auth · one-click demo
        </div>
      </div>
    </div>
  );
}

// ── Preview registry ────────────────────────────────────────────────────────

const PREVIEWS: Record<number, () => React.JSX.Element> = {
  1: ForgedPreview,
  2: GameHubPreview,
  3: NightOwlzPreview,
  4: BreweriesPreview,
  5: KanbanPreview,
  6: DevloggerPreview,
};

// ── Main component ──────────────────────────────────────────────────────────

type Props = {
  projectId: number | null;
  onClose: () => void;
};

export default function FakeBrowser({ projectId, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);

  const isGame     = projectId === 0;
  const isDoom     = projectId === -1;
  const isAol      = projectId === -2;
  const isDoomGame = projectId === -3;
  const isWolf     = projectId === -4;
  const isSpecial  = isGame || isDoom || isAol || isDoomGame || isWolf;
  const project: ProjectData | undefined = !isSpecial && projectId
    ? TERMINAL_PROJECTS.find(p => p.id === projectId)
    : undefined;
  const Preview = !isSpecial && projectId ? PREVIEWS[projectId] : null;

  useEffect(() => {
    if (projectId !== null) {
      setLoaded(false);
      const t = setTimeout(() => setLoaded(true), isSpecial ? 200 : 500);
      return () => clearTimeout(t);
    } else {
      setLoaded(false);
    }
  }, [projectId, isSpecial]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ESC is used for mouse-unlock inside DOOM — don't let it close the browser
      if (e.key === 'Escape' && !isDoomGame && !isWolf) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, isDoomGame, isWolf]);

  if (projectId === null) return null;
  if (!isSpecial && !project) return null;

  const displayUrl = isGame ? 'game://asteroids' : isDoom ? 'social://doom-scroll' : isAol ? 'aol://you-ve-got-mail' : isDoomGame ? 'doom://shareware.wad' : isWolf ? 'wolf3d://episode1.wl6' : `http://localhost:${project!.localPort}`;
  const tabName    = isGame ? 'asteroids.exe'    : isDoom ? 'feedr — doom scroll'  : isAol ? 'AOL 9.0'              : isDoomGame ? 'DOOM.EXE'            : isWolf ? 'WOLF3D.EXE'          : project!.name;

  return (
    <>
      <style>{`
        @keyframes browserIn {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:p-8 sm:pb-6"
        style={{ background: 'rgba(0,5,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="w-full max-w-5xl rounded-xl overflow-hidden border border-[#2a2a2a] shadow-[0_0_80px_rgba(0,255,65,0.07)]"
          style={{ height: '88vh', maxHeight: '88vh', animation: 'browserIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards' }}
        >
          {/* ── Chrome ── */}
          <div className="bg-[#1c1c1c] border-b border-[#2a2a2a] select-none">
            {/* Tab bar — hidden on mobile */}
            <div className="hidden sm:flex items-end gap-0 px-3 pt-2">
              <div className="flex gap-1.5 items-center mr-3 pb-2">
                <button onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group"
                  title="Close (Esc)">
                  <span className="text-[#7a0000] text-[7px] opacity-0 group-hover:opacity-100 font-bold leading-none">x</span>
                </button>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="bg-[#252525] rounded-t-lg px-4 pt-2 pb-2.5 text-xs text-gray-300 font-mono border-t border-l border-r border-[#333] flex items-center gap-2 min-w-[140px]">
                <span className="text-[#4a7a55] text-[10px]">●</span>
                {tabName}
              </div>
            </div>

            {/* Address bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#181818]">
              {/* Traffic lights on mobile (replace tab bar) */}
              <div className="flex sm:hidden gap-1.5 items-center">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>

              {/* Nav buttons — desktop only */}
              <div className="hidden sm:flex gap-0.5 text-gray-600 text-xs">
                <button className="px-1.5 py-1 rounded hover:bg-[#2a2a2a] hover:text-gray-400 transition-colors">←</button>
                <button className="px-1.5 py-1 rounded hover:bg-[#2a2a2a] hover:text-gray-400 transition-colors">→</button>
                <button className="px-1.5 py-1 rounded hover:bg-[#2a2a2a] hover:text-gray-400 transition-colors text-sm">↺</button>
              </div>

              <div className="flex-1 bg-[#252525] rounded-md px-2 py-1.5 text-xs font-mono text-gray-400 border border-[#333] flex items-center gap-2 min-w-0">
                <span className={`text-[10px] shrink-0 ${isGame ? 'text-yellow-500' : isDoom ? 'text-pink-500' : isAol ? 'text-blue-400' : isDoomGame ? 'text-red-500' : isWolf ? 'text-[#c8a000]' : 'text-green-500'}`}>
                  {isGame ? '🎮' : isDoom ? '📱' : isAol ? '📬' : isDoomGame ? '💀' : isWolf ? '🐺' : '🔒'}
                </span>
                <span className="truncate">{displayUrl}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!isSpecial && project?.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="hidden sm:block text-[10px] text-[#4a7a55] hover:text-[#00ff41] font-mono px-2.5 py-1 border border-[#2a3a2a] rounded-md hover:border-[#00ff41]/40 transition-colors whitespace-nowrap">
                    open live ↗
                  </a>
                )}
                {!isSpecial && (
                  <a href={project!.github} target="_blank" rel="noopener noreferrer"
                    className="hidden sm:block text-[10px] text-gray-500 hover:text-gray-300 font-mono px-2.5 py-1 border border-[#2a2a2a] rounded-md hover:border-[#444] transition-colors">
                    github ↗
                  </a>
                )}
                <button onClick={onClose}
                  className="text-[10px] text-gray-600 hover:text-gray-400 font-mono px-2.5 py-1 border border-[#2a2a2a] rounded-md hover:border-[#444] transition-colors">
                  esc
                </button>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className={isGame ? 'overflow-hidden' : 'overflow-auto'} style={{ height: 'calc(88vh - 52px)' }}>
            {!loaded ? (
              <div className="h-full flex items-center justify-center bg-[#010a04]">
                <div className="flex items-center gap-3 font-mono text-sm text-[#4a7a55]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#4a7a55] animate-ping" />
                  {isGame ? 'initializing...' : isAol ? 'connecting...' : isDoomGame ? 'loading wad...' : isWolf ? 'loading episode 1...' : 'loading...'}
                </div>
              </div>
            ) : isGame ? (
              <Asteroids />
            ) : isDoom ? (
              <DoomScroll />
            ) : isAol ? (
              <AolScreen />
            ) : isDoomGame ? (
              <Doom />
            ) : isWolf ? (
              <Wolfenstein />
            ) : (
              Preview && <Preview />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
