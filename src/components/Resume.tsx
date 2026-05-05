'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'downloading' | '404' | 'jk' | 'success';

const RESUME_LINES = [
  '# brandon michael kelly',
  '  cottonwood, az 86326  ·  928-274-6725',
  '  kbrandon863@gmail.com  ·  weballtech.com',
  '  linkedin  ·  github.com/bkness',
  '',
  '────────────────────────────────────────────────',
  '',
  '## summary',
  '',
  '  Full-stack developer and ASU bootcamp graduate',
  '  shipping production web apps and developer',
  '  tooling. Published npm package (Forged CLI) with',
  '  1.3k+ downloads. Proficient across the full',
  '  JavaScript ecosystem — React, React Native,',
  '  Node.js, Express, GraphQL, and multiple database',
  '  technologies. Additional experience in shell',
  '  automation, GitHub Actions workflows, and CLI',
  '  development. Background in high-pressure,',
  '  customer-facing environments brings strong',
  '  communication, problem-solving, and leadership',
  '  instincts to every team.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## skills',
  '',
  '  Languages    JavaScript · TypeScript · HTML5',
  '               CSS3 · Python',
  '  Frontend     React · React Native · Expo',
  '               Tailwind CSS · Bootstrap · Redux',
  '               Handlebars.js',
  '  Backend      Node.js · Express.js · GraphQL',
  '               REST APIs',
  '  Databases    MongoDB · MySQL · SQLite',
  '               Sequelize · Mongoose',
  '  Tools        Git · GitHub · Vercel · Render',
  '               Railway · Firebase · VS Code',
  '  Other        JWT · bcrypt · Apollo · Agile',
  '               npm publishing · CLI development',
  '               GitHub Actions',
  '',
  '────────────────────────────────────────────────',
  '',
  '## projects',
  '',
  '  forged-cli            Node.js · TypeScript · npm',
  '    Published CLI tool — 1.3k+ downloads.',
  '    Security scanner, password generator, and',
  '    interactive README builder. forged scan detects',
  '    typosquatting, validates tarball integrity,',
  '    and flags dangerous install scripts.',
  '    Shell integration: single-keybind GitHub',
  '    workflow (issue → branch → commit → PR),',
  '    fuzzy command palette, and project-type',
  '    detection for auto-activating environments.',
  '',
  '  night owlz            React Native · Expo · iOS',
  '    Sole developer — full-stack nightlife discovery',
  '    app. City search, venue profiles, saved favorites.',
  '    Apple MapKit JS + OpenStreetMap fallback,',
  '    JWT auth, bcrypt, MongoDB.',
  '',
  '  game hub              MERN · GraphQL · Apollo · JWT',
  '    MERN stack app with GraphQL API, JWT auth,',
  '    and full Agile workflow. Built blog section,',
  '    GraphQL type definitions and mutations.',
  '    Tested with Apollo Studio.',
  '',
  '  breweries             Node.js · Express · SQLite',
  '    Local brewery finder integrating Open Brewery DB',
  '    with user login, favorites, and map view.',
  '',
  '  devlog                Express · MySQL · Sequelize',
  '    Full-stack tech blog with user authentication,',
  '    sessions, and dynamic server-side rendering.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## experience',
  '',
  '  Prescott Resort  ·  Bartender',
  '  Jul 2025 – Present  ·  Prescott, AZ',
  '',
  '    Cocktail service, inventory, and bank',
  '    reconciliation in a full-service resort.',
  '',
  '  Kactus Kates  ·  Bartender',
  '  Dec 2016 – Present  ·  Cottonwood, AZ',
  '',
  '    Independently managed high-volume night shifts.',
  '    $2,000–$3,000 in nightly sales solo. Full',
  '    closing responsibilities, cash management,',
  '    and building security.',
  '',
  '  Enchantment Resort  ·  Head Bartender',
  '  Mar 2018 – Mar 2019  ·  Sedona, AZ',
  '',
  '    Promoted to Head Bartender at Che Ah Chi',
  '    (fine dining). Managed inventory across three',
  '    outlets. Assisted F&B Manager with wine cellar.',
  '',
  '  Abundant Organics  ·  Gardener',
  '  Jan 2020 – Dec 2023  ·  Cottonwood, AZ',
  '',
  '    Promoted to salaried position.',
  '    20–40% yield increase through optimized',
  '    watering, pruning, and soil management.',
  '',
  '────────────────────────────────────────────────',
  '',
  '## education',
  '',
  '  Arizona State University  ·  Phoenix, AZ',
  '  Full Stack Web Development Certificate',
  '  February 2024  ·  Graduated 92.5%',
  '',
  '  JavaScript · React · Node.js · MySQL · MongoDB',
  '  GraphQL · Agile development methodologies',
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
                  href="/resume.pdf"
                  download="brandon-kelly-resume.pdf"
                  className="px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
                >
                  ↓ download PDF
                </a>
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
                  ↺ try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
