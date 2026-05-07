'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Dos?: (el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> };
  }
}

type DosInstance = {
  stop: () => Promise<void>;
  sendKeyEvent?: (key: number, pressed: boolean) => void;
};

export default function Wolfenstein() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef       = useRef<((el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> }) | null>(null);
  const ciRef        = useRef<DosInstance | null>(null);
  const [skipOverlay, setSkipOverlay] = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [started, setStarted] = useState(false);
  const [loadMsg, setLoadMsg] = useState('loading wolf3d engine...');
  const heldRef = useRef(new Set<string>());

  const initGame = () => {
    if (!dosRef.current || !containerRef.current) return;
    try {
      ciRef.current = dosRef.current(containerRef.current, {
        url: '/wolf3d.jsdos',
        pathPrefix: `${window.location.origin}/emulators/`,
        kiosk: true,
        mobileControls: true,
      });
      setStarted(true);
    } catch (err) {
      console.error('[Wolf3D] run failed', err);
    }
  };

  const handleScriptLoad = () => {
    setTimeout(() => {
      const D = window.Dos;
      if (typeof D === 'function') {
        dosRef.current = D;
        if (skipOverlay) initGame();
        else setLoaded(true);
      } else {
        setLoadMsg('failed to load engine — try refreshing');
      }
    }, 50);
  };

  useEffect(() => () => { ciRef.current?.stop(); }, []);


  const handleImpatientClick = useCallback(() => {
    if (skipOverlay) return;
    setSkipOverlay(true);
  }, [skipOverlay]);

  const dispatchKey = useCallback((type: 'keydown' | 'keyup', key: string) => {
    const code = keyCode2code(key);
    const codeNum = keyCode(key);

    if (ciRef.current?.sendKeyEvent) {
      ciRef.current.sendKeyEvent(codeNum, type === 'keydown');
      return;
    }

    const event = new KeyboardEvent(type, {
      key,
      code,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'keyCode', { get: () => codeNum });
    Object.defineProperty(event, 'which', { get: () => codeNum });
    Object.defineProperty(event, 'charCode', { get: () => 0 });

    containerRef.current?.dispatchEvent(event);
    document.dispatchEvent(event);
    window.dispatchEvent(event);
  }, []);

  const press = useCallback((key: string) => {
    if (heldRef.current.has(key)) return;
    heldRef.current.add(key);
    dispatchKey('keydown', key);
  }, [dispatchKey]);

  const release = useCallback((key: string) => {
    if (!heldRef.current.has(key)) return;
    heldRef.current.delete(key);
    dispatchKey('keyup', key);
  }, [dispatchKey]);

  useEffect(() => {
    if (!started) return;
    const releaseAll = () => {
      for (const key of heldRef.current) {
        dispatchKey('keyup', key);
      }
      heldRef.current.clear();
    };
    window.addEventListener('touchend', releaseAll, { passive: true });
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('touchend', releaseAll);
      window.removeEventListener('blur', releaseAll);
      releaseAll();
    };
  }, [dispatchKey, started]);

  const btn = useCallback((key: string) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      press(key);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      release(key);
    },
    onTouchCancel: (e: React.TouchEvent) => {
      e.preventDefault();
      release(key);
    },
  }), [press, release]);

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
            {!skipOverlay && (
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
        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 1001 }}>
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
              <button className={`w-11 h-11 ${btnCls}`} {...btn(',')}>◀S</button>
              <button className={`w-11 h-11 ${btnCls}`} {...btn('.')}>S▶</button>
            </div>
            <div className="flex gap-2">
              <button className={`w-14 h-14 rounded-full bg-zinc-700/70 border border-zinc-400/40 text-white font-mono text-xs font-bold touch-none`} {...btn('Enter')}>OPEN</button>
              <button className={`w-14 h-14 rounded-full bg-[#8a6000]/70 border border-[#c8a000]/40 text-white font-mono text-xs font-bold touch-none`} {...btn('Control')}>FIRE</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function keyCode(key: string): number {
  const map: Record<string, number> = {
    ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39,
    Control: 17, Enter: 13, ' ': 32, Escape: 27, ',': 188, '.': 190,
  };
  return map[key] ?? 0;
}

function keyCode2code(key: string): string {
  const map: Record<string, string> = {
    ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',
    Control: 'ControlLeft', Enter: 'Enter', ' ': 'Space', Escape: 'Escape', ',': 'Comma', '.': 'Period',
  };
  return map[key] ?? key;
}
