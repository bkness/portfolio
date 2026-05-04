'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'installing' | 'error' | 'jk' | 'success';

const INSTALL_LINES = [
  'npm warn deprecated feelings@1.0.0: please update your work-life balance',
  'npm warn deprecated excuses@3.2.1: no longer maintained',
  '',
  'added 1 developer (brandon-kelly@1.0.0) in 2s',
  '',
  '1 package is looking for work',
  'run `npm fund` to find out how you can help',
];

const README = [
  '# brandon-kelly',
  '',
  '> Full stack developer. Ships things. Breaks things. Fixes things.',
  '',
  '## Install',
  '',
  '  npm install brandon-kelly',
  '',
  '## Contact',
  '',
  '  Email     kbrandon863@gmail.com',
  '  GitHub    github.com/bkness',
  '  npm       npmjs.com/~bkness',
  '',
  '## Availability',
  '',
  '  ✓ Full-time remote roles',
  '  ✓ Contract / freelance',
  '  ✗ 9-5 in an office without coffee',
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [installLines, setInstallLines] = useState<string[]>([]);
  const [readmeLines, setReadmeLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const runInstall = async () => {
    if (phase !== 'idle') return;
    setPhase('installing');
    setInstallLines([]);
    setProgress(0);

    // progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 2;
      });
    }, 40);

    await delay(2200);
    clearInterval(progressInterval);
    setProgress(100);
    await delay(300);

    // print install lines one by one
    for (const line of INSTALL_LINES) {
      await delay(120);
      setInstallLines(prev => [...prev, line]);
    }

    await delay(600);

    // 404 troll
    setPhase('error');
    await delay(2200);

    // jk
    setPhase('jk');
    await delay(2000);

    // success — show README
    setPhase('success');
    let i = 0;
    const readmeInterval = setInterval(() => {
      i++;
      setReadmeLines(README.slice(0, i));
      if (i >= README.length) clearInterval(readmeInterval);
    }, 60);
  };

  const reset = () => {
    setPhase('idle');
    setInstallLines([]);
    setReadmeLines([]);
    setProgress(0);
  };

  return (
    <section ref={ref} className="px-4 py-20 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ npm install brandon-kelly</p>
        <h2 className="text-[#00ff41] font-mono text-2xl font-bold">Contact</h2>
      </div>

      <div className={`border border-[#1a3a22] rounded-lg bg-[#020a04]/80 p-6 font-mono text-xs transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>

        {/* Idle — run button */}
        {phase === 'idle' && (
          <div className="space-y-3">
            <div className="text-[#4a7a55]">
              <span className="text-[#00ff41]">❯</span> npm install brandon-kelly
            </div>
            <button
              onClick={runInstall}
              className="mt-2 px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
            >
              ↵ run
            </button>
          </div>
        )}

        {/* Installing */}
        {(phase === 'installing' || phase === 'error' || phase === 'jk' || phase === 'success') && (
          <div className="space-y-1">
            <div className="text-[#4a7a55]">
              <span className="text-[#00ff41]">❯</span> npm install brandon-kelly
            </div>

            {phase === 'installing' && (
              <div className="mt-2 space-y-1">
                <div className="text-[#4a7a55]">npm <span className="text-[#c8ffd4]">info</span> fetching package...</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-[#0d1f0f] rounded overflow-hidden max-w-xs">
                    <div
                      className="h-full bg-[#00ff41] rounded transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[#4a7a55]">{progress}%</span>
                </div>
              </div>
            )}

            {(phase === 'error' || phase === 'jk' || phase === 'success') && (
              <div className="mt-2 space-y-0.5">
                {installLines.map((line, i) => (
                  <div key={i} className={
                    line.startsWith('npm warn') ? 'text-[#ffd43b]' :
                    line.startsWith('added') ? 'text-[#00ff41]' :
                    line.startsWith('1 package') ? 'text-[#4a7a55]' :
                    'text-[#4a7a55]'
                  }>
                    {line || ' '}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 404 error */}
        {phase === 'error' && (
          <div className="mt-4 border border-[#ff4500]/40 rounded p-4 bg-[#ff4500]/5 space-y-1 animate-pulse">
            <div className="text-[#ff4500] font-bold">npm ERR! code E404</div>
            <div className="text-[#ff4500]">npm ERR! 404 Not Found — brandon-kelly</div>
            <div className="text-[#ff4500]">npm ERR! 404</div>
            <div className="text-[#ff4500]">npm ERR! 404 brandon-kelly is not in this registry.</div>
            <div className="text-[#ff4500]">npm ERR! 404 Did you mean to contact a real developer?</div>
            <div className="mt-3">
              <button onClick={reset} className="text-[#4a7a55] hover:text-[#00ff41] underline transition-colors">
                go back
              </button>
            </div>
          </div>
        )}

        {/* jk */}
        {phase === 'jk' && (
          <div className="mt-4 border border-[#00ff41]/40 rounded p-4 bg-[#00ff41]/5 space-y-1">
            <div className="text-[#00ff41] font-bold">jk 😂</div>
            <div className="text-[#c8ffd4]">How's it feel to be a dev for a day?</div>
            <div className="text-[#4a7a55]">loading actual contact info...</div>
          </div>
        )}

        {/* Success — README */}
        {phase === 'success' && (
          <div className="mt-4 space-y-0.5">
            <div className="text-[#4a7a55] mb-2">❯ cat node_modules/brandon-kelly/README.md</div>
            {readmeLines.map((line, i) => (
              <div key={i} className={
                line.startsWith('#') ? 'text-[#00ff41] font-bold mt-2' :
                line.startsWith('>') ? 'text-[#ffd43b] italic' :
                line.startsWith('  ✓') ? 'text-[#00ff41]' :
                line.startsWith('  ✗') ? 'text-[#ff4500]' :
                line.startsWith('  ') ? 'text-[#c8ffd4]' :
                line === '' ? ' ' && <br /> as unknown as string :
                'text-[#4a7a55]'
              }>
                {line || ' '}
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-[#1a3a22] flex gap-4">
              <a
                href="mailto:kbrandon863@gmail.com"
                className="px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
              >
                ✉ send email
              </a>
              <button
                onClick={reset}
                className="px-4 py-2 border border-[#1a3a22] text-[#4a7a55] rounded hover:border-[#00ff41]/40 hover:text-[#00ff41] transition-all duration-200"
              >
                ↺ reinstall
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
