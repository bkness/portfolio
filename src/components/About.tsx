'use client';

import { useEffect, useRef, useState } from 'react';

const COMMITS = [
  { hash: 'a3f9c1b', date: 'May 2026',  ref: 'HEAD -> main', message: 'feat: actively seeking next opportunity' },
  { hash: '7d2e8f4', date: 'Apr 2026',  ref: null,           message: 'ship: forged-cli v0.3.9 — 1.3k+ downloads' },
  { hash: 'c91b3a2', date: 'Jan 2026',  ref: null,           message: 'feat: published nightowlz to app store' },
  { hash: 'f84a110', date: 'Dec 2025',  ref: null,           message: 'cert: ASU full stack bootcamp completed' },
  { hash: 'b2d7e93', date: 'Oct 2025',  ref: null,           message: 'init: first React Native app shipped' },
  { hash: '9c3f821', date: 'Aug 2025',  ref: null,           message: 'feat: fell in love with the terminal' },
  { hash: 'e17c4d5', date: 'Jun 2025',  ref: null,           message: 'fix: switched careers, no regrets' },
  { hash: 'd509b3a', date: '????',      ref: 'root',         message: 'init: started writing code' },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setAnimate(entry.isIntersecting),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (animate) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisible(i);
        if (i >= COMMITS.length) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    } else {
      setVisible(0);
    }
  }, [animate]);

  return (
    <section ref={ref} className="px-4 py-20 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ git log --oneline --author=bkness</p>
        <h2 className="text-[#00ff41] font-mono text-2xl font-bold">About</h2>
      </div>

      <div className="border border-[#1a3a22] rounded-lg bg-[#020a04]/80 p-6 font-mono text-sm">
        {/* Graph line + commits */}
        <div className="flex gap-4">
          {/* Graph column */}
          <div className="flex flex-col items-center">
            {COMMITS.map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-[2px] ${i === 0 ? 'h-3' : 'h-4'} bg-[#1a3a22] transition-opacity duration-300 ${i < visible ? 'opacity-100' : 'opacity-0'}`} />
                <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                  i === 0
                    ? 'border-[#00ff41] bg-[#00ff41] shadow-[0_0_6px_rgba(0,255,65,0.8)]'
                    : 'border-[#00ff41] bg-[#020a04]'
                } ${i < visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                {i < COMMITS.length - 1 && (
                  <div className={`w-[2px] h-8 bg-[#1a3a22] transition-opacity duration-300 ${i < visible ? 'opacity-100' : 'opacity-0'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Commit info */}
          <div className="flex flex-col gap-0">
            {COMMITS.map((c, i) => (
              <div
                key={i}
                className={`flex flex-col justify-center transition-all duration-300 ${
                  i < COMMITS.length - 1 ? 'h-[52px]' : 'h-[28px]'
                } ${i < visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#ffd43b] text-xs">{c.hash}</span>
                  {c.ref && (
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${
                      c.ref.includes('HEAD')
                        ? 'text-[#00ff41] border-[#00ff41]/40 bg-[#00ff41]/5'
                        : 'text-[#4a7a55] border-[#1a3a22]'
                    }`}>
                      {c.ref}
                    </span>
                  )}
                  <span className="text-[#4a7a55] text-xs">{c.date}</span>
                </div>
                <div className="text-[#c8ffd4] text-xs mt-0.5">{c.message}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio below the log */}
        <div className={`mt-8 pt-6 border-t border-[#1a3a22] transition-all duration-700 ${visible >= COMMITS.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="text-[#4a7a55] text-xs mb-3">❯ cat README.md</div>
          <div className="space-y-2 text-xs leading-5">
            <p className="text-[#c8ffd4]">
              Full stack developer who came up through the terminal. I build tools that make developers' lives easier —
              CLIs, shell environments, mobile apps, and web platforms.
            </p>
            <p className="text-[#c8ffd4]">
              I care about the craft: clean APIs, fast feedback loops, and code that actually ships.
              When I'm not building, I'm automating something that probably didn't need automating.
            </p>
            <p className="text-[#4a7a55]">
              Based in the US · Remote-first · Open to full-time roles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
