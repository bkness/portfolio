'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export default function Wolfenstein() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dosRef       = useRef<((el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> }) | null>(null);
  const ciRef        = useRef<{ stop: () => Promise<void> } | null>(null);
  const skipOverlay  = useRef(false);
  const [loaded, setLoaded]   = useState(false);
  const [started, setStarted] = useState(false);
  const [loadMsg, setLoadMsg] = useState('loading wolf3d engine...');
  const held = useRef(new Set<string>());

  const initGame = () => {
    if (!dosRef.current || !containerRef.current) return;
    try {
      ciRef.current = dosRef.current(containerRef.current, {
        url: '/wolf3d.jsdos',
        pathPrefix: `${window.location.origin}/emulators/`,
        kiosk: true,
      });
      setStarted(true);
    } catch (err) {
      console.error('[Wolf3D] run failed', err);
    }
  };

  const handleScriptLoad = () => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const D = (window as any).Dos;
      if (typeof D === 'function') {
        dosRef.current = D;
        skipOverlay.current ? initGame() : setLoaded(true);
      } else {
        setLoadMsg('failed to load engine — try refreshing');
      }
    }, 50);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const D = (window as any).Dos;
    if (typeof D === 'function') {
      dosRef.current = D;
      setLoaded(true);
    }
  }, []);

  useEffect(() => () => { ciRef.current?.stop(); }, []);

  const handleImpatientClick = () => {
    if (skipOverlay.current) return;
    skipOverlay.current = true;
  };

  const press = (key: string) => {
    if (held.current.has(key)) return;
    held.current.add(key);
    window.dispatchEvent(new KeyboardEvent('keydown', { key, code: keyCode2code(key), keyCode: keyCode(key), bubbles: true }));
  };

  const release = (key: string) => {
    held.current.delete(key);
    window.dispatchEvent(new KeyboardEvent('keyup', { key, code: keyCode2code(key), keyCode: keyCode(key), bubbles: true }));
  };

  const btn = (key: string) => ({
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); press(key); },
    onTouchEnd:   (e: React.TouchEvent) => { e.preventDefault(); release(key); },
    onTouchCancel:(e: React.TouchEvent) => { e.preventDefault(); release(key); },
  });

  const btnCls = 'bg-zinc-800/70 border border-zinc-500/40 text-white font-mono text-xs font-bold touch-none rounded';

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <Script src="/js-dos.js" onLoad={handleScriptLoad} />

      <div ref={containerRef} className="w-full h-full" />

      {!loaded && !started && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleImpatientClick}
        >
          <div className="text-center space-y-2">
            <p className="text-[#c8a000] font-mono text-sm animate-pulse">{loadMsg}</p>
            {!skipOverlay.current && (
              <p className="text-zinc-600 font-mono text-xs">first load may take 10–20 seconds</p>
            )}
          </div>
        </div>
      )}

      {loaded && !started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85">
          <button
            onClick={initGame}
            className="font-mono text-2xl font-bold tracking-widest text-[#c8a000] border border-[#8a6000] px-10 py-5 hover:bg-[#c8a000]/10 transition-all"
          >
            [ MACH SCHNELL ]
          </button>
        </div>
      )}

      {started && (
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Left — D-pad */}
          <div className="absolute bottom-6 left-4 pointer-events-auto flex flex-col items-center gap-1.5">
            <button className={`w-12 h-12 ${btnCls}`} {...btn('ArrowUp')}>▲</button>
            <div className="flex gap-1.5">
              <button className={`w-12 h-12 ${btnCls}`} {...btn('ArrowLeft')}>◄</button>
              <button className={`w-12 h-12 ${btnCls}`} {...btn('ArrowDown')}>▼</button>
              <button className={`w-12 h-12 ${btnCls}`} {...btn('ArrowRight')}>►</button>
            </div>
          </div>

          {/* Right — strafe + action */}
          <div className="absolute bottom-6 right-4 pointer-events-auto flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <button className={`w-11 h-11 ${btnCls}`} {...btn('[')}>◀S</button>
              <button className={`w-11 h-11 ${btnCls}`} {...btn(']')}>S▶</button>
            </div>
            <div className="flex gap-2">
              <button className={`w-14 h-14 rounded-full bg-zinc-700/70 border border-zinc-400/40 text-white font-mono text-xs font-bold touch-none`} {...btn(' ')}>OPEN</button>
              <button className={`w-14 h-14 rounded-full bg-[#8a6000]/70 border border-[#c8a000]/40 text-white font-mono text-xs font-bold touch-none`} {...btn('Control')}>FIRE</button>
            </div>
          </div>

          <button
            className="absolute top-3 right-3 px-3 py-1 bg-zinc-900/80 border border-zinc-600/40 text-white font-mono text-xs pointer-events-auto touch-none"
            {...btn('Escape')}
          >
            ESC
          </button>
        </div>
      )}
    </div>
  );
}

function keyCode(key: string): number {
  const map: Record<string, number> = {
    ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39,
    Control: 17, ' ': 32, Escape: 27, '[': 219, ']': 221,
  };
  return map[key] ?? 0;
}

function keyCode2code(key: string): string {
  const map: Record<string, string> = {
    ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',
    Control: 'ControlLeft', ' ': 'Space', Escape: 'Escape', '[': 'BracketLeft', ']': 'BracketRight',
  };
  return map[key] ?? key;
}
