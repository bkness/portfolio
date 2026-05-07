"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ── constants ──────────────────────────────────────────────────────────────
const CW = 820;
const CH = 520;
const SHIP_R = 14;
const TURN = 0.054;
const THRUST = 0.17;
const FRICTION = 0.986;
const MAX_SPD = 6.5;
const BULLET_SPD = 9.5;
const BULLET_LIFE = 54;
const INVINCIBLE = 150;
const FIRE_COOLDOWN = 175;
const COL = "#00ff41";

// ── types ──────────────────────────────────────────────────────────────────
type V = { x: number; y: number };
type SZ = "L" | "M" | "S";

interface Ship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  thrusting: boolean;
  inv: number;
}
interface Rock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  spin: number;
  sz: SZ;
  r: number;
  pts: V[];
}
interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}
interface GS {
  phase: "title" | "continue" | "play" | "dead" | "over";
  ship: Ship;
  rocks: Rock[];
  bullets: Bullet[];
  particles: Particle[];
  score: number;
  hi: number;
  lives: number;
  level: number;
  deadTimer: number;
  nid: number;
}

const RADII: Record<SZ, number> = { L: 58, M: 32, S: 14 };
const SCORES: Record<SZ, number> = { L: 20, M: 50, S: 100 };
const SPDS: Record<SZ, number> = { L: 0.85, M: 1.5, S: 2.6 };

// ── helpers ────────────────────────────────────────────────────────────────
function rr(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makePts(r: number): V[] {
  const n = 9 + Math.floor(Math.random() * 5);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return {
      x: Math.cos(a) * r * rr(0.6, 1.0),
      y: Math.sin(a) * r * rr(0.6, 1.0),
    };
  });
}

function makeRock(id: number, x: number, y: number, sz: SZ): Rock {
  const r = RADII[sz];
  const spd = SPDS[sz] * rr(0.7, 1.35);
  const ang = Math.random() * Math.PI * 2;
  return {
    id,
    x,
    y,
    sz,
    r,
    pts: makePts(r),
    vx: Math.cos(ang) * spd,
    vy: Math.sin(ang) * spd,
    a: 0,
    spin: rr(-0.025, 0.025),
  };
}

function spawnRocks(level: number, nid: number): [Rock[], number] {
  const count = 2 + level;
  const rocks: Rock[] = [];
  let id = nid;
  for (let i = 0; i < count; i++) {
    const edge = Math.floor(Math.random() * 4);
    let x = 0,
      y = 0;
    if (edge === 0) {
      x = rr(0, CW);
      y = -70;
    } else if (edge === 1) {
      x = CW + 70;
      y = rr(0, CH);
    } else if (edge === 2) {
      x = rr(0, CW);
      y = CH + 70;
    } else {
      x = -70;
      y = rr(0, CH);
    }
    rocks.push(makeRock(id++, x, y, "L"));
  }
  return [rocks, id];
}

function wrap(v: number, max: number): number {
  if (v < -80) return v + max + 160;
  if (v > max + 80) return v - max - 160;
  return v;
}

function initGS(hi = 0): GS {
  const [rocks, nid] = spawnRocks(1, 1);
  return {
    phase: "title",
    ship: {
      x: CW / 2,
      y: CH / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      thrusting: false,
      inv: 0,
    },
    rocks,
    bullets: [],
    particles: [],
    score: 0,
    hi,
    lives: 3,
    level: 1,
    deadTimer: 0,
    nid,
  };
}

const SAVE_KEY = "asteroids_save";
function loadSave(): { hi: number; level: number; unlocked?: number[] } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (typeof s.hi === "number" && typeof s.level === "number") return s;
  } catch {}
  return null;
}
function writeSave(hi: number, level: number, unlocked: number[]) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ hi, level, unlocked }));
  } catch {}
}

const MILESTONES: Record<number, string> = {
  5: "🔓 type 'doom' in the terminal",
  7: "🔓 type 'wolf' in the terminal",
  10: "🔓 type 'aol' in the terminal",
};

// ── component ──────────────────────────────────────────────────────────────
export default function Asteroids({
  onUnlock,
}: {
  onUnlock?: (level: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS>(
    ((): GS => {
      const save = loadSave();
      const gs = initGS(save?.hi ?? 0);
      if (save) gs.phase = "continue";
      return gs;
    })(),
  );
  const keysRef = useRef(new Set<string>());
  const frameRef = useRef(0);
  const lastFireRef = useRef(0);
  const toastRef = useRef<{ msg: string; timer: number } | null>(null);
  const shownRef = useRef(new Set<number>(loadSave()?.unlocked ?? []));
  const startRef = useRef<(() => void) | null>(null);
  const continueRef = useRef<(() => void) | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: CW / 2,
    y: CH / 2,
    active: false,
  });
  const joystickRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [joystickUi, setJoystickUi] = useState<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleJoyMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = t.clientX - cx;
    const dy = t.clientY - cy;
    const max = Math.min(rect.width, rect.height) * 0.34;
    const dist = Math.hypot(dx, dy);
    const clamped = dist > max ? max / dist : 1;
    const px = dx * clamped;
    const py = dy * clamped;
    const nx = px / max;
    const ny = py / max;

    joystickRef.current = { x: nx, y: ny, active: true };
    setJoystickUi({ x: px, y: py, active: true });
  }, []);

  const resetJoy = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    joystickRef.current = { x: 0, y: 0, active: false };
    setJoystickUi({ x: 0, y: 0, active: false });
  }, []);

  const onFireStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    keysRef.current.add("Space");
    const { phase } = gsRef.current;
    if (phase === "continue") continueRef.current?.();
    else if (phase === "title" || phase === "over") startRef.current?.();
  }, []);

  const onFireEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    keysRef.current.delete("Space");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const keys = keysRef.current;

    // ── start / restart ──────────────────────────────────────────────────
    const startGame = () => {
      const hi = Math.max(gsRef.current.hi, gsRef.current.score);
      const [rocks, nid] = spawnRocks(1, 1);
      gsRef.current = { ...initGS(hi), phase: "play", rocks, nid };
    };
    const continueGame = () => {
      const save = loadSave();
      if (!save) {
        startGame();
        return;
      }
      const [rocks, nid] = spawnRocks(save.level, 1);
      gsRef.current = {
        ...initGS(save.hi),
        phase: "play",
        rocks,
        nid,
        level: save.level,
      };
    };
    startRef.current = startGame;
    continueRef.current = continueGame;

    // ── input ─────────────────────────────────────────────────────────────
    const onKey = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "KeyW",
          "KeyA",
          "KeyD",
        ].includes(e.code)
      )
        e.preventDefault();
      if (e.type === "keydown") {
        keys.add(e.code);
        const gs = gsRef.current;
        if (gs.phase === "continue") {
          if (e.code === "Space" || e.code === "Enter") continueGame();
          if (e.code === "KeyN") startGame();
        } else if (
          (gs.phase === "title" || gs.phase === "over") &&
          (e.code === "Space" || e.code === "Enter")
        ) {
          startGame();
        }
      } else {
        keys.delete(e.code);
      }
    };

    const getCanvasPoint = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * CW,
        y: ((e.clientY - rect.top) / rect.height) * CH,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      const p = getCanvasPoint(e);
      mouseRef.current = { x: p.x, y: p.y, active: true };
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      keys.add("Space");
      const gs = gsRef.current;
      if (gs.phase === "continue") continueGame();
      else if (gs.phase === "title" || gs.phase === "over") startGame();
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      keys.delete("Space");
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      keys.delete("Space");
    };

    const shoot = (gs: GS) => {
      const now = Date.now();
      if (now - lastFireRef.current < FIRE_COOLDOWN) return;
      lastFireRef.current = now;
      const s = gs.ship;
      gs.bullets.push({
        id: gs.nid++,
        x: s.x + Math.cos(s.angle) * (SHIP_R + 2),
        y: s.y + Math.sin(s.angle) * (SHIP_R + 2),
        vx: s.vx + Math.cos(s.angle) * BULLET_SPD,
        vy: s.vy + Math.sin(s.angle) * BULLET_SPD,
        life: BULLET_LIFE,
      });
    };

    const explode = (gs: GS, x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2,
          spd = rr(0.8, 3.5);
        const life = 25 + Math.floor(Math.random() * 35);
        gs.particles.push({
          x,
          y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd,
          life,
          maxLife: life,
        });
      }
    };

    // ── draw helpers ──────────────────────────────────────────────────────
    const drawShip = (s: Ship) => {
      if (s.inv > 0 && Math.floor(s.inv / 5) % 2 === 0) return;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);
      ctx.strokeStyle = COL;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = COL;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(SHIP_R, 0);
      ctx.lineTo(-SHIP_R * 0.7, SHIP_R * 0.62);
      ctx.lineTo(-SHIP_R * 0.38, 0);
      ctx.lineTo(-SHIP_R * 0.7, -SHIP_R * 0.62);
      ctx.closePath();
      ctx.stroke();
      if (s.thrusting) {
        const j = Math.random() * SHIP_R * 0.7;
        ctx.strokeStyle = Math.random() > 0.4 ? "#ffd43b" : "#ff7700";
        ctx.shadowColor = "#ffd43b";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-SHIP_R * 0.38, SHIP_R * 0.28);
        ctx.lineTo(-SHIP_R - j, 0);
        ctx.lineTo(-SHIP_R * 0.38, -SHIP_R * 0.28);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawRock = (rock: Rock) => {
      ctx.save();
      ctx.translate(rock.x, rock.y);
      ctx.rotate(rock.a);
      ctx.strokeStyle = COL;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = COL;
      ctx.shadowBlur = 5;
      ctx.beginPath();
      rock.pts.forEach(({ x, y }, i) =>
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
      );
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const drawMiniShip = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.strokeStyle = COL;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = COL;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, 4.5);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-6, -4.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    // ── main draw ─────────────────────────────────────────────────────────
    const draw = (gs: GS) => {
      ctx.fillStyle = "#010a04";
      ctx.fillRect(0, 0, CW, CH);
      // Scanlines
      for (let y = 0; y < CH; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.055)";
        ctx.fillRect(0, y, CW, 2);
      }

      // Rocks always draw
      ctx.shadowBlur = 0;
      for (const r of gs.rocks) drawRock(r);

      if (gs.phase === "continue") {
        const save = loadSave();
        ctx.textAlign = "center";
        ctx.font = "bold 52px monospace";
        ctx.fillStyle = COL;
        ctx.shadowColor = COL;
        ctx.shadowBlur = 22;
        ctx.fillText("ASTEROIDS", CW / 2, CH / 2 - 90);
        ctx.shadowBlur = 0;
        ctx.shadowColor = COL;
        ctx.shadowBlur = 14;
        ctx.font = "18px monospace";
        ctx.fillStyle = COL;
        ctx.fillText("[ CONTINUE ]", CW / 2, CH / 2 - 18);
        ctx.shadowBlur = 0;
        ctx.font = "11px monospace";
        ctx.fillStyle = "#4a7a55";
        ctx.fillText(
          `level ${save?.level ?? 1}  ·  hi ${save?.hi ?? 0}`,
          CW / 2,
          CH / 2 + 10,
        );
        ctx.font = "14px monospace";
        ctx.fillStyle = "#2d5a38";
        ctx.fillText("[ N ]  new game", CW / 2, CH / 2 + 50);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#1a3a22";
        ctx.fillText("space / fire to continue", CW / 2, CH / 2 + 80);
        return;
      }

      if (gs.phase === "title") {
        ctx.textAlign = "center";
        ctx.font = "bold 52px monospace";
        ctx.fillStyle = COL;
        ctx.shadowColor = COL;
        ctx.shadowBlur = 22;
        ctx.fillText("ASTEROIDS", CW / 2, CH / 2 - 62);
        ctx.shadowBlur = 0;
        ctx.font = "12px monospace";
        ctx.fillStyle = "#2d5a38";
        ctx.fillText(
          "ARROWS / W-A-D move  ·  SPACE / LEFT CLICK fire",
          CW / 2,
          CH / 2 + 6,
        );
        ctx.shadowColor = COL;
        ctx.shadowBlur = 12;
        ctx.font = "15px monospace";
        ctx.fillStyle = COL;
        if (Math.floor(Date.now() / 560) % 2 === 0)
          ctx.fillText("[ PRESS SPACE TO START ]", CW / 2, CH / 2 + 55);
        ctx.shadowBlur = 0;
        ctx.font = "10px monospace";
        ctx.fillStyle = "#1a3a22";
        ctx.fillText(
          "reach level 5 to unlock something cool...",
          CW / 2,
          CH / 2 + 90,
        );
        ctx.fillText(
          "forged-shell v0.3.9  ·  idle since: never",
          CW / 2,
          CH - 14,
        );
        return;
      }

      // Particles
      for (const p of gs.particles) {
        const a = p.life / p.maxLife;
        ctx.fillStyle = `rgba(0,255,65,${(a * 0.85).toFixed(2)})`;
        ctx.shadowColor = COL;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bullets
      ctx.fillStyle = COL;
      ctx.shadowColor = COL;
      ctx.shadowBlur = 8;
      for (const b of gs.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ship
      if (gs.phase === "play") drawShip(gs.ship);

      // HUD
      ctx.shadowBlur = 0;
      ctx.font = "13px monospace";
      ctx.fillStyle = COL;
      ctx.textAlign = "left";
      ctx.fillText(`SCORE  ${gs.score}`, 14, 22);
      ctx.textAlign = "right";
      ctx.fillText(`HI  ${Math.max(gs.hi, gs.score)}`, CW - 14, 22);
      ctx.textAlign = "center";
      ctx.fillText(`LVL ${gs.level}`, CW / 2, 22);
      for (let i = 0; i < gs.lives; i++) drawMiniShip(14 + i * 20, 38);

      // Toast
      const toast = toastRef.current;
      if (toast && toast.timer > 0) {
        const alpha = Math.min(1, toast.timer / 30);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(1,10,4,0.82)";
        ctx.roundRect(CW / 2 - 210, CH - 70, 420, 36, 6);
        ctx.fill();
        ctx.font = "13px monospace";
        ctx.fillStyle = COL;
        ctx.shadowColor = COL;
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.fillText(toast.msg, CW / 2, CH - 47);
        ctx.restore();
        toast.timer--;
      }

      if (gs.phase === "over") {
        ctx.fillStyle = "rgba(1,10,4,0.72)";
        ctx.fillRect(0, 0, CW, CH);
        ctx.textAlign = "center";
        ctx.shadowColor = COL;
        ctx.shadowBlur = 20;
        ctx.fillStyle = COL;
        ctx.font = "bold 42px monospace";
        ctx.fillText("GAME OVER", CW / 2, CH / 2 - 52);
        ctx.shadowBlur = 0;
        ctx.font = "15px monospace";
        ctx.fillStyle = "#4a7a55";
        ctx.fillText(`SCORE: ${gs.score}    HI: ${gs.hi}`, CW / 2, CH / 2 + 2);
        ctx.shadowColor = COL;
        ctx.shadowBlur = 10;
        ctx.fillStyle = COL;
        ctx.font = "13px monospace";
        if (Math.floor(Date.now() / 560) % 2 === 0)
          ctx.fillText("[ PRESS SPACE TO PLAY AGAIN ]", CW / 2, CH / 2 + 60);
      }
    };

    // ── game tick ─────────────────────────────────────────────────────────
    const tick = () => {
      const gs = gsRef.current;
      const s = gs.ship;

      // Rocks always move (looks cool on title/over screens too)
      for (const r of gs.rocks) {
        r.x = wrap(r.x + r.vx, CW);
        r.y = wrap(r.y + r.vy, CH);
        r.a += r.spin;
      }

      if (gs.phase === "play") {
        const joy = joystickRef.current;
        if (keys.has("ArrowLeft") || keys.has("KeyA")) s.angle -= TURN;
        if (keys.has("ArrowRight") || keys.has("KeyD")) s.angle += TURN;
        if (mouseRef.current.active) {
          s.angle = Math.atan2(
            mouseRef.current.y - s.y,
            mouseRef.current.x - s.x,
          );
        }
        const joyMag = Math.hypot(joy.x, joy.y);
        if (joy.active && joyMag > 0.14) {
          s.angle = Math.atan2(joy.y, joy.x);
        }
        const forward =
          keys.has("ArrowUp") ||
          keys.has("KeyW") ||
          (joy.active && joyMag > 0.18);
        s.thrusting = forward;
        if (keys.has("Space")) shoot(gs);

        if (s.thrusting) {
          s.vx += Math.cos(s.angle) * THRUST;
          s.vy += Math.sin(s.angle) * THRUST;
          const spd = Math.hypot(s.vx, s.vy);
          if (spd > MAX_SPD) {
            s.vx = (s.vx / spd) * MAX_SPD;
            s.vy = (s.vy / spd) * MAX_SPD;
          }
        }
        s.vx *= FRICTION;
        s.vy *= FRICTION;
        s.x = wrap(s.x + s.vx, CW);
        s.y = wrap(s.y + s.vy, CH);
        if (s.inv > 0) s.inv--;

        gs.bullets = gs.bullets.filter((b) => {
          b.x = wrap(b.x + b.vx, CW);
          b.y = wrap(b.y + b.vy, CH);
          return --b.life > 0;
        });

        gs.particles = gs.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          return --p.life > 0;
        });

        // Bullet-rock collisions
        const dead = new Set<number>();
        const newRocks: Rock[] = [];
        for (const b of gs.bullets) {
          if (b.life <= 0) continue;
          for (const r of gs.rocks) {
            if (dead.has(r.id)) continue;
            if (Math.hypot(b.x - r.x, b.y - r.y) < r.r) {
              dead.add(r.id);
              b.life = 0;
              gs.score += SCORES[r.sz];
              explode(gs, r.x, r.y, r.sz === "L" ? 14 : r.sz === "M" ? 9 : 5);
              if (r.sz === "L") {
                newRocks.push(makeRock(gs.nid++, r.x, r.y, "M"));
                newRocks.push(makeRock(gs.nid++, r.x, r.y, "M"));
              }
              if (r.sz === "M") {
                newRocks.push(makeRock(gs.nid++, r.x, r.y, "S"));
                newRocks.push(makeRock(gs.nid++, r.x, r.y, "S"));
              }
              break;
            }
          }
        }
        gs.rocks = gs.rocks.filter((r) => !dead.has(r.id)).concat(newRocks);
        gs.bullets = gs.bullets.filter((b) => b.life > 0);

        // Ship-rock collision
        if (s.inv === 0) {
          for (const r of gs.rocks) {
            if (Math.hypot(s.x - r.x, s.y - r.y) < r.r + SHIP_R * 0.75) {
              gs.lives--;
              explode(gs, s.x, s.y, 22);
              if (gs.lives <= 0) {
                gs.phase = "over";
                gs.hi = Math.max(gs.hi, gs.score);
                writeSave(gs.hi, gs.level, [...shownRef.current]);
              } else {
                gs.phase = "dead";
                gs.deadTimer = 100;
              }
              break;
            }
          }
        }

        // Next level
        if (gs.rocks.length === 0) {
          gs.level++;
          const [rocks, nid] = spawnRocks(gs.level, gs.nid);
          gs.rocks = rocks;
          gs.nid = nid;
          const extraLife = gs.level % 5 === 0;
          if (extraLife) gs.lives++;
          const msg = MILESTONES[gs.level];
          if (msg && !shownRef.current.has(gs.level)) {
            shownRef.current.add(gs.level);
            writeSave(gs.hi, gs.level, [...shownRef.current]);
            toastRef.current = {
              msg: extraLife ? `+1 LIFE  ·  ${msg}` : msg,
              timer: 240,
            };
            onUnlock?.(gs.level);
          } else if (extraLife) {
            toastRef.current = { msg: "+1 LIFE", timer: 240 };
          }
        }
      }

      if (gs.phase === "dead") {
        gs.particles = gs.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          return --p.life > 0;
        });
        if (--gs.deadTimer <= 0) {
          gs.phase = "play";
          gs.ship = {
            x: CW / 2,
            y: CH / 2,
            vx: 0,
            vy: 0,
            angle: -Math.PI / 2,
            thrusting: false,
            inv: INVINCIBLE,
          };
          gs.bullets = [];
        }
      }

      draw(gs);
      frameRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [onUnlock]);

  return (
    <div className="w-full h-full bg-[#010a04] flex flex-col items-center justify-center">
      <div
        className="relative w-full"
        style={{ maxWidth: CW, aspectRatio: `${CW}/${CH}` }}
      >
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {/* Mobile controls — overlaid on canvas */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Left — joystick */}
          <div className="absolute bottom-4 left-3 pointer-events-auto">
            <div
              className="relative w-28 h-28 rounded-full border border-green/40 bg-[#010a04]/75 touch-none"
              onTouchStart={handleJoyMove}
              onTouchMove={handleJoyMove}
              onTouchEnd={resetJoy}
              onTouchCancel={resetJoy}
            >
              <div className="absolute inset-4 rounded-full border border-green/25" />
              <div
                className="absolute left-1/2 top-1/2 w-11 h-11 -ml-5.5 -mt-5.5 rounded-full border border-green/60 bg-green/10"
                style={{
                  transform: `translate(${joystickUi.x}px, ${joystickUi.y}px)`,
                  transition: joystickUi.active
                    ? "none"
                    : "transform 110ms ease-out",
                }}
              />
            </div>
          </div>

          {/* Right — fire */}
          <button
            className="absolute bottom-4 right-4 w-20 h-20 rounded-full border border-green/40 bg-green/10 text-green font-mono text-xs font-bold pointer-events-auto touch-none"
            onTouchStart={onFireStart}
            onTouchEnd={onFireEnd}
            onTouchCancel={onFireEnd}
          >
            FIRE
          </button>
        </div>
      </div>
    </div>
  );
}
