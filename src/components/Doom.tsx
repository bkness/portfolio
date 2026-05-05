'use client';

import Script from 'next/script';
import { useRef, useState } from 'react';

declare global {
  interface Window {
    Dos: (element: HTMLElement, options?: Record<string, unknown>) => {
      run: (bundleUrl: string) => Promise<unknown>;
    };
  }
}

export default function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef       = useRef<Window['Dos'] | null>(null);
  const skipOverlay  = useRef(false);
  const [loaded, setLoaded]   = useState(false);
  const [started, setStarted] = useState(false);
  const [loadMsg, setLoadMsg] = useState('loading doom engine...');
  const held     = useRef(new Set<string>());
  const stickOrigin = useRef<{ cx: number; cy: number } | null>(null);

  const press = (key: string) => {
    if (held.current.has(key)) return;
    held.current.add(key);
    document.dispatchEvent(new KeyboardEvent('keydown', { key, keyCode: keyCode(key), bubbles: true }));
  };

  const release = (key: string) => {
    held.current.delete(key);
    document.dispatchEvent(new KeyboardEvent('keyup', { key, keyCode: keyCode(key), bubbles: true }));
  };

  const initGame = () => {
    if (!dosRef.current || !containerRef.current) {
      console.error('[Doom] initGame guard failed', { dos: dosRef.current, container: containerRef.current });
      return;
    }
    try {
      dosRef.current(containerRef.current).run('https://cdn.dos.zone/custom/dos/doom.jsdos');
      setStarted(true);
    } catch (err) {
      console.error('[Doom] run failed', err);
    }
  };

  const handleScriptLoad = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const D = (window as any).Dos as Window['Dos'] | undefined;
    if (D) {
      dosRef.current = D;
      skipOverlay.current ? initGame() : setLoaded(true);
    } else {
      console.error('[Doom] js-dos loaded but window.Dos is not set');
      setLoadMsg('failed to load doom engine — try refreshing');
    }
  };

  const handleImpatientClick = () => {
    if (skipOverlay.current) return;
    skipOverlay.current = true;
    setLoadMsg("fine. don't acknowledge the work put into this.");
  };

  // Joystick
  const onStickStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    stickOrigin.current = { cx: t.clientX, cy: t.clientY };
  };

  const onStickMove = (e: React.TouchEvent) => {
    if (!stickOrigin.current) return;
    e.preventDefault();
    const t  = e.touches[0];
    const dx = t.clientX - stickOrigin.current.cx;
    const dy = t.clientY - stickOrigin.current.cy;
    const DEAD = 14;
    dy < -DEAD ? press('ArrowUp')    : release('ArrowUp');
    dy >  DEAD ? press('ArrowDown')  : release('ArrowDown');
    dx < -DEAD ? press('ArrowLeft')  : release('ArrowLeft');
    dx >  DEAD ? press('ArrowRight') : release('ArrowRight');
  };

  const onStickEnd = () => {
    stickOrigin.current = null;
    ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].forEach(release);
  };

  const btn = (key: string) => ({
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); press(key); },
    onTouchEnd:   (e: React.TouchEvent) => { e.preventDefault(); release(key); },
    onTouchCancel:(e: React.TouchEvent) => { e.preventDefault(); release(key); },
  });

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <Script src="https://js-dos.com/v7/build/js-dos.js" onLoad={handleScriptLoad} />
      <link rel="stylesheet" href="https://js-dos.com/v7/build/js-dos.css" />

      {/* js-dos mounts here */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading state */}
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleImpatientClick}
        >
          <div className="text-center space-y-2">
            <p className="text-[#00ff41] font-mono text-sm animate-pulse">{loadMsg}</p>
            {!skipOverlay.current && (
              <p className="text-zinc-600 font-mono text-xs">first load may take 10–20 seconds</p>
            )}
          </div>
        </div>
      )}

      {/* Start overlay */}
      {loaded && !started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85">
          <button
            onClick={initGame}
            className="font-mono text-2xl font-bold tracking-widest text-red-500 border border-red-700 px-10 py-5 hover:bg-red-900/20 transition-all"
          >
            [ RUN DOOM ]
          </button>
        </div>
      )}

      {/* Mobile controls — only renders after game starts */}
      {started && (
        <div className="absolute inset-0 pointer-events-none select-none">

          {/* Left — joystick */}
          <div
            className="absolute bottom-8 left-8 w-28 h-28 rounded-full border-2 border-white/25 bg-white/8 pointer-events-auto touch-none flex items-center justify-center"
            onTouchStart={onStickStart}
            onTouchMove={onStickMove}
            onTouchEnd={onStickEnd}
            onTouchCancel={onStickEnd}
          >
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/35" />
          </div>

          {/* Right — action buttons */}
          <div className="absolute bottom-8 right-8 pointer-events-auto flex flex-col gap-3 items-end">
            <div className="flex gap-3">
              {/* Weapon prev / next */}
              <button className="w-11 h-11 rounded bg-zinc-800/70 border border-zinc-500/40 text-white font-mono text-xs touch-none" {...btn('[')}>◀W</button>
              <button className="w-11 h-11 rounded bg-zinc-800/70 border border-zinc-500/40 text-white font-mono text-xs touch-none" {...btn(']')}>W▶</button>
            </div>
            <div className="flex gap-3">
              {/* USE (Space) */}
              <button className="w-16 h-16 rounded-full bg-zinc-700/70 border border-zinc-400/40 text-white font-mono text-xs font-bold touch-none" {...btn(' ')}>USE</button>
              {/* FIRE (Ctrl) */}
              <button className="w-16 h-16 rounded-full bg-red-800/70 border border-red-500/40 text-white font-mono text-xs font-bold touch-none" {...btn('Control')}>FIRE</button>
            </div>
          </div>

          {/* ESC — top right */}
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

// js-dos v7 listens for keyCode, not key string
function keyCode(key: string): number {
  const map: Record<string, number> = {
    ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39,
    Control: 17, ' ': 32, Escape: 27, '[': 219, ']': 221,
  };
  return map[key] ?? 0;
}
