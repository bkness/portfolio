'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Dos?: (el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> };
  }
}

type DosInstance = { stop: () => Promise<void> };

// On-screen controls send Wolf3D's own keys. The bundled CONFIG.WL6 binds
// movement to WASD (W/S forward/back, A/D turn), fire Ctrl, strafe Alt,
// use Space. Wolf3D's menus only read the arrows and Enter, so each D-pad
// button sends its arrow (menus) and its WASD key (gameplay). Strafing is
// Alt held with a turn key. OPEN sends Space (doors) and Enter (menus).
const CONTROLS: Record<string, string[]> = {
  up:          ['ArrowUp', 'w'],
  down:        ['ArrowDown', 's'],
  left:        ['ArrowLeft', 'a'],
  right:       ['ArrowRight', 'd'],
  strafeLeft:  ['Alt', 'a'],
  strafeRight: ['Alt', 'd'],
  open:        [' ', 'Enter'],
  fire:        ['Control'],
};

export default function Wolfenstein() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef       = useRef<((el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> }) | null>(null);
  const ciRef        = useRef<DosInstance | null>(null);
  // Clicked the loading screen: start as soon as the engine loads. The ref is
  // for the async script callback, the state is for rendering the hint.
  const skipOverlay  = useRef(false);
  const [impatient, setImpatient] = useState(false);
  // <Script> only fires onLoad once per page. If DOOM (or an earlier Wolf)
  // already loaded js-dos, start ready instead of waiting forever.
  const [loaded, setLoaded]   = useState(() => typeof window.Dos === 'function');
  const [started, setStarted] = useState(false);
  const [loadMsg, setLoadMsg] = useState('loading wolf3d engine...');
  // How many held buttons want each key down. Two buttons can share a key
  // (◄ and ◀S both use A); the key only goes up when neither is held.
  const heldRef = useRef(new Map<string, number>());

  useEffect(() => {
    if (typeof window.Dos === 'function') dosRef.current = window.Dos;
  }, []);

  const initGame = () => {
    if (!dosRef.current || !containerRef.current) return;
    try {
      ciRef.current = dosRef.current(containerRef.current, {
        url: '/wolf3d.jsdos',
        pathPrefix: `${window.location.origin}/emulators/`,
        kiosk: true,
        // Our tap on MACH SCHNELL is the user gesture audio needs, so skip
        // js-dos's own ▶ screen (it rendered unstyled and ate the first tap)
        autoStart: true,
        // Our D-pad replaces js-dos's joystick overlay
        mobileControls: false,
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
        if (skipOverlay.current) initGame();
        else setLoaded(true);
      } else {
        setLoadMsg('failed to load engine — try refreshing');
      }
    }, 50);
  };

  useEffect(() => () => { ciRef.current?.stop(); }, []);

  // Belt and braces: hide js-dos's own touch UI even if it renders anyway
  useEffect(() => {
    if (!started) return;
    const style = document.createElement('style');
    style.textContent = [
      '.nipple, .emulator-button, .emulator-options, .emulator-control-select { display: none !important; }',
      // The bundle sets autolock=true, so js-dos covers the game with "Click to
      // capture mouse / Use Esc / slider" — meaningless on a touch screen.
      // Touch only: desktop players still get the mouse-capture prompt.
      '@media (hover: none) and (pointer: coarse) { .wolf-root .pointer-events-none:has(.text-4xl) { display: none !important; } }',
    ].join('\n');
    document.head.appendChild(style);
    return () => style.remove();
  }, [started]);

  const handleImpatientClick = () => {
    if (skipOverlay.current) return;
    skipOverlay.current = true;
    setImpatient(true);
  };

  // js-dos listens on window and reads keyCode; dispatch once, there
  const dispatchKey = useCallback((type: 'keydown' | 'keyup', key: string) => {
    const codeNum = keyCode(key);
    const event = new KeyboardEvent(type, { key, code: keyCode2code(key), bubbles: true, cancelable: true });
    Object.defineProperty(event, 'keyCode', { get: () => codeNum });
    Object.defineProperty(event, 'which', { get: () => codeNum });
    window.dispatchEvent(event);
  }, []);

  const pressControl = useCallback((control: string) => {
    for (const key of CONTROLS[control] ?? []) {
      const n = heldRef.current.get(key) ?? 0;
      heldRef.current.set(key, n + 1);
      if (n === 0) dispatchKey('keydown', key);
    }
  }, [dispatchKey]);

  const releaseControl = useCallback((control: string) => {
    // release in reverse, so Alt goes up after the arrow it modifies
    for (const key of [...(CONTROLS[control] ?? [])].reverse()) {
      const n = heldRef.current.get(key) ?? 0;
      if (n <= 1) {
        heldRef.current.delete(key);
        if (n === 1) dispatchKey('keyup', key);
      } else {
        heldRef.current.set(key, n - 1);
      }
    }
  }, [dispatchKey]);

  // If the page loses focus mid-press, nothing should stay held down
  useEffect(() => {
    if (!started) return;
    const releaseAll = () => {
      for (const key of heldRef.current.keys()) dispatchKey('keyup', key);
      heldRef.current.clear();
    };
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('blur', releaseAll);
      releaseAll();
    };
  }, [dispatchKey, started]);

  // One set of touch handlers for every button (each has data-control). A
  // touch's events always target the button it started on, so each finger
  // releases only its own button: hold ▲ and tap FIRE, and you keep moving.
  const touchControl = (e: React.TouchEvent) =>
    (e.target as HTMLElement).closest<HTMLElement>('[data-control]')?.dataset.control;
  const controlHandlers = {
    onTouchStart:  (e: React.TouchEvent) => { const c = touchControl(e); if (c) { e.preventDefault(); pressControl(c); } },
    onTouchEnd:    (e: React.TouchEvent) => { const c = touchControl(e); if (c) { e.preventDefault(); releaseControl(c); } },
    onTouchCancel: (e: React.TouchEvent) => { const c = touchControl(e); if (c) { e.preventDefault(); releaseControl(c); } },
  };

  const btnCls = 'bg-zinc-800/70 border border-zinc-500/40 text-white font-mono text-xs font-bold touch-none rounded';

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <Script src="/js-dos.js" onLoad={handleScriptLoad} />

      <div ref={containerRef} className="wolf-root w-full h-full" />

      {!loaded && !started && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleImpatientClick}
        >
          <div className="text-center space-y-2">
            <p className="text-[#c8a000] font-mono text-sm animate-pulse">{loadMsg}</p>
            {!impatient && (
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
        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 1001 }} {...controlHandlers}>
          {/* Left — D-pad */}
          <div className="absolute bottom-6 left-4 pointer-events-auto flex flex-col items-center gap-1.5">
            <button className={`w-12 h-12 ${btnCls}`} data-control="up" aria-label="Forward">▲</button>
            <div className="flex gap-1.5">
              <button className={`w-12 h-12 ${btnCls}`} data-control="left" aria-label="Turn left">◄</button>
              <button className={`w-12 h-12 ${btnCls}`} data-control="down" aria-label="Back">▼</button>
              <button className={`w-12 h-12 ${btnCls}`} data-control="right" aria-label="Turn right">►</button>
            </div>
          </div>

          {/* Right — strafe + action */}
          <div className="absolute bottom-6 right-4 pointer-events-auto flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <button className={`w-11 h-11 ${btnCls}`} data-control="strafeLeft" aria-label="Strafe left">◀S</button>
              <button className={`w-11 h-11 ${btnCls}`} data-control="strafeRight" aria-label="Strafe right">S▶</button>
            </div>
            <div className="flex gap-2">
              <button className={`w-14 h-14 rounded-full bg-zinc-700/70 border border-zinc-400/40 text-white font-mono text-xs font-bold touch-none`} data-control="open">OPEN</button>
              <button className={`w-14 h-14 rounded-full bg-[#8a6000]/70 border border-[#c8a000]/40 text-white font-mono text-xs font-bold touch-none`} data-control="fire">FIRE</button>
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
    Control: 17, Alt: 18, Enter: 13, ' ': 32, Escape: 27,
    w: 87, a: 65, s: 83, d: 68,
  };
  return map[key] ?? 0;
}

function keyCode2code(key: string): string {
  const map: Record<string, string> = {
    ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',
    Control: 'ControlLeft', Alt: 'AltLeft', Enter: 'Enter', ' ': 'Space', Escape: 'Escape',
    w: 'KeyW', a: 'KeyA', s: 'KeyS', d: 'KeyD',
  };
  return map[key] ?? key;
}
