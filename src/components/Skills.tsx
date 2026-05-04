'use client';

import { useEffect, useRef, useState } from 'react';

const SKILLS = [
  {
    category: 'Languages',
    color: '#00ff41',
    items: [
      { name: 'JavaScript', short: 'JS',  level: 85 },
      { name: 'TypeScript', short: 'TS',  level: 75 },
      { name: 'Python',     short: 'Py',  level: 60 },
      { name: 'SQL',        short: 'SQL', level: 70 },
    ],
  },
  {
    category: 'Frontend',
    color: '#00e63a',
    items: [
      { name: 'React',        short: 'Re', level: 85 },
      { name: 'Next.js',      short: 'Nx', level: 80 },
      { name: 'React Native', short: 'RN', level: 70 },
      { name: 'Tailwind',     short: 'TW', level: 80 },
    ],
  },
  {
    category: 'Backend',
    color: '#00cc33',
    items: [
      { name: 'Node.js',  short: 'No', level: 85 },
      { name: 'Express',  short: 'Ex', level: 80 },
      { name: 'GraphQL',  short: 'GQ', level: 70 },
      { name: 'FastAPI',  short: 'FA', level: 55 },
    ],
  },
  {
    category: 'Databases',
    color: '#00992b',
    items: [
      { name: 'MySQL',      short: 'My', level: 75 },
      { name: 'MongoDB',    short: 'Mo', level: 75 },
      { name: 'SQLite',     short: 'SL', level: 70 },
      { name: 'PostgreSQL', short: 'PG', level: 60 },
    ],
  },
  {
    category: 'Tools',
    color: '#006618',
    items: [
      { name: 'Git',     short: 'Git', level: 85 },
      { name: 'Docker',  short: 'Dok', level: 55 },
      { name: 'npm/CLI', short: 'npm', level: 90 },
      { name: 'zsh',     short: 'zsh', level: 85 },
    ],
  },
];

const ALL_SKILLS = SKILLS.flatMap(g => g.items);
const BAR_CHARS = 16;
const GRAPH_ROWS = 10;
const RINGS = [80, 63, 47, 32, 18];

function barStr(level: number) {
  const filled = Math.round((level / 100) * BAR_CHARS);
  return '█'.repeat(filled) + '░'.repeat(BAR_CHARS - filled);
}

function getGraphRow(level: number) {
  return Math.max(0, Math.min(GRAPH_ROWS - 1, Math.floor((100 - level) / 10)));
}

function SkillBar({ name, level, animate }: { name: string; level: number; animate: boolean }) {
  const frameRef = useRef(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = animate ? level : 0;
    const interval = setInterval(() => {
      const diff = target - frameRef.current;
      if (Math.abs(diff) <= 3) {
        frameRef.current = target;
      } else {
        frameRef.current += diff > 0 ? 3 : -3;
      }
      setDisplay(frameRef.current);
      if (frameRef.current === target) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [animate, level]);

  const label = name.padEnd(12, ' ');
  const pct = `${display}%`.padStart(4, ' ');

  return (
    <div className="font-mono text-xs leading-6 flex items-center gap-2 whitespace-pre">
      <span className="text-[#4a7a55]">  {label}</span>
      <span className="text-[#00ff41]">{barStr(display)}</span>
      <span className="text-[#4a7a55]">{pct}</span>
    </div>
  );
}

function Graph({ animate }: { animate: boolean }) {
  const colRef = useRef(0);
  const [visibleCols, setVisibleCols] = useState(0);

  useEffect(() => {
    const target = animate ? ALL_SKILLS.length : 0;
    const step = animate ? 1 : -1;
    const interval = setInterval(() => {
      const next = colRef.current + step;
      const clamped = animate ? Math.min(next, target) : Math.max(next, target);
      colRef.current = clamped;
      setVisibleCols(clamped);
      if (clamped === target) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [animate]);

  const rowLabels = ['100', ' 90', ' 80', ' 70', ' 60', ' 50', ' 40', ' 30', ' 20', ' 10'];

  return (
    <div className="font-mono text-xs select-none">
      <div className="text-[#4a7a55] mb-1">── sys.health ─────────────────</div>
      <div className="flex">
        <div className="flex flex-col mr-1">
          {rowLabels.map((l, i) => (
            <div key={i} className="text-[#1a3a22] leading-5">{l}│</div>
          ))}
          <div className="text-[#1a3a22] leading-5">    └</div>
        </div>
        <div className="flex flex-col">
          {Array.from({ length: GRAPH_ROWS }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex leading-5">
              {ALL_SKILLS.map((skill, colIdx) => {
                const isDot = getGraphRow(skill.level) === rowIdx;
                const visible = colIdx < visibleCols;
                return (
                  <span
                    key={colIdx}
                    className={`w-[18px] text-center transition-opacity duration-100 ${
                      !visible ? 'opacity-0' : isDot ? 'text-[#00ff41]' : 'text-[#0d1f0f]'
                    }`}
                  >
                    {isDot ? '●' : '─'}
                  </span>
                );
              })}
            </div>
          ))}
          <div className="flex leading-5 mt-0.5">
            {ALL_SKILLS.map((skill, i) => (
              <span key={i} className={`w-[18px] text-center text-[#1a3a22] transition-opacity duration-100 ${i < visibleCols ? 'opacity-100' : 'opacity-0'}`}>
                {skill.short[0]}
              </span>
            ))}
          </div>
          <div className="flex leading-3">
            {ALL_SKILLS.map((skill, i) => (
              <span key={i} className={`w-[18px] text-center text-[#1a3a22] text-[9px] transition-opacity duration-100 ${i < visibleCols ? 'opacity-100' : 'opacity-0'}`}>
                {skill.short[1] ?? ' '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RingChart({ animate }: { animate: boolean }) {
  const categories = SKILLS.map(g => ({
    name: g.category,
    color: g.color,
    avg: Math.round(g.items.reduce((s, i) => s + i.level, 0) / g.items.length),
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="font-mono text-xs text-[#4a7a55] mb-3 self-start">── sys.vitals ──────────────────</div>
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {categories.map((cat, i) => {
            const r = RINGS[i];
            const circ = 2 * Math.PI * r;
            const fill = animate ? circ * (cat.avg / 100) : 0;
            return (
              <g key={cat.name}>
                <circle cx="100" cy="100" r={r} fill="none" stroke="#0d1f0f" strokeWidth="8" />
                <circle
                  cx="100" cy="100" r={r}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={circ - fill}
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </g>
            );
          })}
          <text x="100" y="96" textAnchor="middle" className="font-mono" fill="#00ff41" fontSize="11" fontFamily="monospace">
            sys
          </text>
          <text x="100" y="110" textAnchor="middle" fill="#4a7a55" fontSize="9" fontFamily="monospace">
            health
          </text>
        </svg>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
            <span style={{ color: cat.color }}>●</span>
            <span className="text-[#4a7a55]">{cat.name.padEnd(10, ' ')}</span>
            <span className="text-[#00ff41]">{animate ? cat.avg : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setAnimate(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-4 py-20 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ skills --list</p>
        <h2 className="text-[#00ff41] font-mono text-2xl font-bold">Tech Stack</h2>
      </div>

      <div className="border border-[#1a3a22] rounded-lg bg-[#020a04]/80 p-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Skill bars */}
          <div className="flex-1 space-y-5">
            {SKILLS.map((group) => (
              <div key={group.category}>
                <div className="font-mono text-xs text-[#4a7a55] mb-1">
                  {`── ${group.category} ${'─'.repeat(Math.max(0, 22 - group.category.length))}`}
                </div>
                {group.items.map((skill) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} animate={animate} />
                ))}
              </div>
            ))}
          </div>

          {/* Graph + rings */}
          <div className="flex flex-col gap-8 lg:items-end">
            <Graph animate={animate} />
            <RingChart animate={animate} />
          </div>

        </div>
      </div>
    </section>
  );
}
