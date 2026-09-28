'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export default function Doom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef       = useRef<((el: HTMLElement, opts: Record<string, unknown>) => { stop: () => Promise<void> }) | null>(null);
  const ciRef        = useRef<{ stop: () => Promise<void> } | null>(null);
  // Clicked the loading screen: start as soon as the engine loads. The ref is
  // for the async script callback, the state is for rendering the hint.
  const skipOverlay  = useRef(false);
  const [impatient, setImpatient] = useState(false);
  // If Dos is already on window from an earlier mount, <Script> won't fire
  // onLoad again, so start in the loaded state (this only renders client-side)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loaded, setLoaded]   = useState(() => typeof (window as any).Dos === 'function');
  const [started, setStarted] = useState(false);
  const [loadMsg, setLoadMsg] = useState('loading doom engine...');
  const held = useRef(new Set<string>());

  const initGame = () => {
    if (!dosRef.current || !containerRef.current) {
      console.error('[Doom] initGame guard failed', { dos: dosRef.current, container: containerRef.current });
      return;
    }
    try {
      ciRef.current = dosRef.current(containerRef.current, {
        url: '/doom.jsdos',
        pathPrefix: `${window.location.origin}/emulators/`,
        kiosk: true,
        mobileControls: false,
      });
      setStarted(true);
    } catch (err) {
      console.error('[Doom] run failed', err);
    }
  };

  const handleScriptLoad = () => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const D = (window as any).Dos;
      console.log('[Doom] window.Dos after load:', typeof D);
      if (typeof D === 'function') {
        dosRef.current = D;
        if (skipOverlay.current) initGame();
        else setLoaded(true);
      } else {
        console.error('[Doom] window.Dos not found');
        setLoadMsg('failed to load doom engine — try refreshing');
      }
    }, 50);
  };

  useEffect(() => {
    // Pairs with the `loaded` initializer: grab the already-loaded engine
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const D = (window as any).Dos;
    if (typeof D === 'function') dosRef.current = D;
  }, []);

  useEffect(() => () => { ciRef.current?.stop(); }, []);

  // js-dos v8 injects its own mobile UI (nipple joystick + emulator buttons).
  // CSS injection beats MutationObserver here — hides them even if js-dos re-creates them.
  useEffect(() => {
    if (!started) return;
    const style = document.createElement('style');
    style.textContent = '.nipple, .emulator-button, .emulator-options, .emulator-control-select { display: none !important; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, [started]);

  const handleImpatientClick = () => {
    if (skipOverlay.current) return;
    skipOverlay.current = true;
    setImpatient(true);
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

  // One set of touch handlers for all control buttons (each has data-key).
  // A touch's events always target the element it started on, so holding two
  // buttons at once still sends two independent keys.
  const touchKey = (e: React.TouchEvent) =>
    (e.target as HTMLElement).closest<HTMLElement>('[data-key]')?.dataset.key;
  const controlHandlers = {
    onTouchStart:  (e: React.TouchEvent) => { const k = touchKey(e); if (k) { e.preventDefault(); press(k); } },
    onTouchEnd:    (e: React.TouchEvent) => { const k = touchKey(e); if (k) { e.preventDefault(); release(k); } },
    onTouchCancel: (e: React.TouchEvent) => { const k = touchKey(e); if (k) { e.preventDefault(); release(k); } },
  };

  const btnCls = 'bg-zinc-800/70 border border-zinc-500/40 text-white font-mono text-xs font-bold touch-none rounded';

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <Script src="/js-dos.js" onLoad={handleScriptLoad} />

      {/* js-dos mounts here */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading state */}
      {!loaded && !started && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleImpatientClick}
        >
          <div className="text-center space-y-2">
            <p className="text-[#00ff41] font-mono text-sm animate-pulse">{loadMsg}</p>
            {!impatient && (
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

      {/* Mobile controls */}
      {started && (
        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 1001 }} {...controlHandlers}>
          {/* Left — D-pad */}
          <div className="absolute bottom-6 left-4 pointer-events-auto flex flex-col items-center gap-1.5">
            <button className={`w-12 h-12 ${btnCls}`} data-key="w">▲</button>
            <div className="flex gap-1.5">
              <button className={`w-12 h-12 ${btnCls}`} data-key="ArrowLeft">◄</button>
              <button className={`w-12 h-12 ${btnCls}`} data-key="s">▼</button>
              <button className={`w-12 h-12 ${btnCls}`} data-key="ArrowRight">►</button>
            </div>
          </div>

          {/* Right — strafe + action */}
          <div className="absolute bottom-6 right-4 pointer-events-auto flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <button className={`w-11 h-11 ${btnCls}`} data-key="a">◀S</button>
              <button className={`w-11 h-11 ${btnCls}`} data-key="d">S▶</button>
            </div>
            <div className="flex gap-2">
              <button className={`w-14 h-14 rounded-full bg-zinc-700/70 border border-zinc-400/40 text-white font-mono text-xs font-bold touch-none`} data-key="Enter">USE</button>
              <button className={`w-14 h-14 rounded-full bg-red-800/70 border border-red-500/40 text-white font-mono text-xs font-bold touch-none`} data-key="Control">FIRE</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function keyCode(key: string): number {
  const map: Record<string, number> = {
    ArrowLeft: 37, ArrowRight: 39,
    Control: 17, Enter: 13, ' ': 32, Escape: 27,
    w: 87, s: 83, a: 65, d: 68,
  };
  return map[key] ?? 0;
}

function keyCode2code(key: string): string {
  const map: Record<string, string> = {
    ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',
    Control: 'ControlLeft', Enter: 'Enter', ' ': 'Space', Escape: 'Escape',
    w: 'KeyW', s: 'KeyS', a: 'KeyA', d: 'KeyD',
  };
  return map[key] ?? key;
}
