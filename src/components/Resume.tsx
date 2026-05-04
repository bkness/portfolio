'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'downloading' | '404' | 'jk' | 'success';

const RESUME_LINES = [
  '# brandon michael kelly',
  '  full stack developer  ·  cottonwood, az',
  '',
  '  928-274-6725  ·  kbrandon863@gmail.com',
  '  github.com/bkness  ·  npmjs.com/~bkness',
  '',
  '────────────────────────────────────────────────',
  '',
  '## summary',
  '',
  '  Full-stack bootcamp grad skilled in JS, TS,',
  '  React, Node, MongoDB, GraphQL, and SQL.',
  '  Background in high-pressure environments and',
  '  customer service — strong multitasker with a',
  '  keen eye for detail and a passion for building',
  '  tools that actually ship.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## skills',
  '',
  '  Languages    HTML · CSS · JavaScript · TypeScript',
  '  Frameworks   React · React Native · Next.js · Expo',
  '               Node.js · Express · Handlebars · Redux',
  '  Databases    MongoDB · MySQL · SQLite · PostgreSQL',
  '  Tools        Git · VS Code · Render · Firebase',
  '               Railway · Netlify · GraphQL · REST',
  '',
  '────────────────────────────────────────────────',
  '',
  '## projects',
  '',
  '  forged-cli            Node.js · npm · CLI · Security',
  '    Security-first developer CLI. Typosquat',
  '    detection, tarball integrity, binary scanning,',
  '    password generation. 1.3k+ npm downloads.',
  '',
  '  game-hub              MERN · GraphQL · Apollo · JWT',
  '    Full stack game tracker. GraphQL API with type',
  '    definitions and mutations, JWT auth, Render.',
  '',
  '  nightowlz             React Native · Expo · iOS',
  '    Nightlife discovery app. Apple MapKit JS +',
  '    OpenStreetMap fallback, JWT + bcrypt, MongoDB.',
  '    Sole developer. Deployed to Render.',
  '',
  '  breweries             Node · Handlebars · SQL',
  '    Brewery finder with Open Brewery DB API,',
  '    map integration, user favorites. Render.',
  '',
  '  tech blog             Express · MySQL · Sequelize',
  '    Full CRUD developer journal, session auth,',
  '    Handlebars + MySQL2/Sequelize.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## experience',
  '',
  '  Abundant Organics  ·  Gardener',
  '  Jan 2020 – Dec 2023  ·  Cottonwood, AZ',
  '',
  '    Organic growing, microbial + Neem pest control,',
  '    soil testing, transplanting and watering schedules.',
  '    Promoted to salaried position. 20–40% yield increase.',
  '',
  '  Main Stage  ·  Bartender',
  '  Jun 2015 – Nov 2023  ·  Cottonwood, AZ',
  '',
  '    High-volume nightclub service. Till management,',
  '    craft cocktails, live music environment.',
  '    Kept on call for exceptional performance.',
  '',
  '  Enchantment Resort  ·  Head Bartender',
  '  Mar 2018 – Mar 2019  ·  Sedona, AZ',
  '',
  '    Promoted to Head Bartender at Che Ah Chi,',
  '    fine dining. Managed 3 restaurant bars.',
  '    Wine cellar inventory + F&B manager support.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## education',
  '',
  '  Arizona State University  ·  Phoenix, AZ',
  '  Full Stack Web Development Bootcamp',
  '  Certificate  ·  February 2024',
  '',
  '  HTML · CSS · JS · React · Node · MongoDB',
  '  Agile methodologies · Project management',
  '',
  '────────────────────────────────────────────────',
  '',
  '  ✓ available for full-time remote roles',
  '  ✓ available for contract / freelance work',
];

function delay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

export default function Resume() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [resumeLines, setResumeLines] = useState<string[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const run = async () => {
    if (phase !== 'idle') return;
    setPhase('downloading');
    setProgress(0);

    // fake chunked download
    const chunks = [
      { target: 18,  spd: 89  },
      { target: 35,  spd: 134 },
      { target: 52,  spd: 201 },
      { target: 61,  spd: 88  },
      { target: 78,  spd: 176 },
      { target: 91,  spd: 220 },
      { target: 99,  spd: 143 },
    ];

    for (const chunk of chunks) {
      setSpeed(chunk.spd);
      const steps = chunk.target;
      await new Promise<void>(resolve => {
        let cur = 0;
        const iv = setInterval(() => {
          cur++;
          setProgress(chunk.target - (steps - cur) * 1.2 | 0);
          if (cur >= steps) { clearInterval(iv); resolve(); }
        }, 28);
      });
      await delay(120);
    }
    setProgress(100);
    await delay(400);

    // 404
    setPhase('404');
    await delay(2800);

    // jk
    setPhase('jk');
    await delay(1800);

    // reveal resume
    setPhase('success');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setResumeLines(RESUME_LINES.slice(0, i));
      if (i >= RESUME_LINES.length) clearInterval(iv);
    }, 40);
  };

  const reset = () => {
    setPhase('idle');
    setProgress(0);
    setSpeed(0);
    setResumeLines([]);
  };

  const bar = (pct: number) => {
    const filled = Math.max(0, Math.min(20, Math.round(pct / 100 * 20)));
    return '█'.repeat(filled) + '░'.repeat(20 - filled);
  };

  return (
    <section ref={ref} className="px-4 py-20 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ cat resume.pdf</p>
        <h2 className="text-[#00ff41] font-mono text-2xl font-bold">Resume</h2>
      </div>

      <div className={`border border-[#1a3a22] rounded-lg bg-[#020a04]/80 font-mono text-xs transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>

        {/* idle */}
        {phase === 'idle' && (
          <div className="p-6 space-y-3">
            <div className="text-[#4a7a55]">
              <span className="text-[#00ff41]">❯</span> cat resume.pdf
            </div>
            <div className="text-[#4a7a55]">Binary file — use download flag to view.</div>
            <button
              onClick={run}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
            >
              ↓ download resume.pdf
            </button>
          </div>
        )}

        {/* downloading */}
        {phase === 'downloading' && (
          <div className="p-6 space-y-2">
            <div className="text-[#4a7a55]"><span className="text-[#00ff41]">❯</span> cat resume.pdf</div>
            <div className="text-[#4a7a55] mt-2">fetching resume.pdf...</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[#00ff41]">{bar(progress)}</span>
              <span className="text-[#4a7a55] w-8">{progress}%</span>
              <span className="text-[#1a4a28]">{speed} KB/s</span>
            </div>
          </div>
        )}

        {/* BIG 404 */}
        {phase === '404' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
            <div
              className="text-[#ff4500] font-bold leading-none"
              style={{ fontSize: 'clamp(80px, 18vw, 160px)', textShadow: '0 0 40px rgba(255,69,0,0.6), 0 0 80px rgba(255,69,0,0.3)' }}
            >
              404
            </div>
            <div className="text-[#ff4500] text-lg font-bold tracking-widest" style={{ textShadow: '0 0 12px rgba(255,69,0,0.5)' }}>
              FILE NOT FOUND
            </div>
            <div className="space-y-1 text-[#8a3a22] max-w-sm">
              <div>resume.pdf does not exist on this server.</div>
              <div className="text-[#4a2a18] mt-2">
                (how every recruiter feels, probably)
              </div>
            </div>
            <div className="text-[#3a1a0a] text-[10px] space-y-0.5 mt-4">
              <div>GET /resume.pdf HTTP/1.1</div>
              <div>Host: bkness.dev</div>
              <div className="text-[#8a3a22]">Error: ENOENT: no such file or directory</div>
            </div>
          </div>
        )}

        {/* jk */}
        {phase === 'jk' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-3">
            <div className="text-[#00ff41] text-2xl font-bold">jk 😂</div>
            <div className="text-[#c8ffd4]">you know the drill by now</div>
            <div className="text-[#4a7a55]">loading actual resume...</div>
          </div>
        )}

        {/* success — resume */}
        {phase === 'success' && (
          <div className="p-6">
            <div className="text-[#4a7a55] mb-4">❯ resume --format=text</div>
            <div className="space-y-0.5 leading-5">
              {resumeLines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.startsWith('# ')     ? 'text-[#00ff41] font-bold text-sm mt-1' :
                    line.startsWith('## ')    ? 'text-[#00ff41] font-bold mt-3' :
                    line.startsWith('  ✓')   ? 'text-[#00ff41]' :
                    line.startsWith('  ─') || line.startsWith('──') ? 'text-[#1a3a22]' :
                    line.startsWith('  ') && !line.startsWith('    ') && line.includes('·')
                                              ? 'text-[#c8ffd4]' :
                    line.startsWith('    ')   ? 'text-[#4a7a55]' :
                    line.startsWith('  ')     ? 'text-[#c8ffd4]' :
                    line === ''               ? '' :
                    'text-[#4a7a55]'
                  }
                >
                  {line || ' '}
                </div>
              ))}
            </div>

            {resumeLines.length >= RESUME_LINES.length && (
              <div className="mt-8 pt-4 border-t border-[#1a3a22] flex flex-wrap gap-3">
                <a
                  href="mailto:kbrandon863@gmail.com"
                  className="px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
                >
                  ✉ get in touch
                </a>
                <button
                  onClick={reset}
                  className="px-4 py-2 border border-[#1a3a22] text-[#4a7a55] rounded hover:border-[#00ff41]/40 hover:text-[#00ff41] transition-all duration-200"
                >
                  ↺ try downloading again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
