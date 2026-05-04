'use client';

import { useEffect, useState } from 'react';

type Phase = 'dialing' | 'connecting' | 'welcome' | 'mail' | 'ad';

const DIAL_LINES = [
  'C:\\> ATDT 1-800-827-6364',
  '',
  'NO CARRIER',
  '',
  'C:\\> ATDT 1-800-827-6364',
  '',
  'CONNECT 28800',
  '',
  'Verifying username and password...',
];

const EMAILS = [
  {
    from: 'hiring@bigtech.com',
    subject: 'Re: Your Portfolio',
    preview: 'We need to talk. It 404s the resume ON PURPOSE??',
    time: '9:41 PM',
    unread: true,
  },
  {
    from: 'npm-registry@npmjs.com',
    subject: 'forged-cli milestone',
    preview: '1,312 downloads. We\'re as surprised as you are.',
    time: '8:12 PM',
    unread: true,
  },
  {
    from: 'noreply@asteroids1979.com',
    subject: 'New High Score Alert',
    preview: 'Someone just beat your 4,800. It was us. Sry.',
    time: '6:55 PM',
    unread: true,
  },
];

function playModem() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    const tone = (f1: number, f2: number, t: number, dur: number, vol = 0.12) => {
      [f1, f2].filter(Boolean).forEach(freq => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, ctx.currentTime + t);
        g.gain.setValueAtTime(0, ctx.currentTime + t + dur);
        osc.frequency.value = freq;
        osc.type = 'sine';
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + dur + 0.05);
      });
    };

    // Dial tone
    tone(350, 440, 0, 0.9);

    // DTMF dialing (1-800-827-6364)
    const dtmf: [number,number][] = [
      [697,1209],[941,1336],[941,1336],[941,1477],
      [852,1209],[770,1336],[770,1477],[852,1477],[697,1477],
      [770,1209],[852,1336],[852,1209],
    ];
    dtmf.forEach(([r,c], i) => tone(r, c, 1.1 + i * 0.12, 0.09, 0.1));

    // Ring
    tone(440, 480, 2.7, 0.4);
    tone(440, 480, 3.3, 0.4);

    // Carrier detect
    tone(2100, 0, 3.9, 0.35, 0.15);

    // Handshake squeals
    const freqs = [1200,2400,1800,3000,600,2100,1500,2700,900,1200,2400,1800];
    freqs.forEach((f, i) => tone(f, f * 1.3, 4.4 + i * 0.22, 0.18, 0.09));

    // Connected carrier hum
    tone(2400, 1200, 7.1, 1.2, 0.05);

    setTimeout(() => { try { ctx.close(); } catch (_) {} }, 9000);
  } catch (_) { /* audio not available */ }
}

// Win95 style helpers
const raised = { border: '2px solid', borderColor: '#ffffff #808080 #808080 #ffffff' } as React.CSSProperties;
const sunken = { border: '2px solid', borderColor: '#808080 #ffffff #ffffff #808080' } as React.CSSProperties;

export default function AolScreen() {
  const [phase, setPhase] = useState<Phase>('dialing');
  const [dialLines, setDialLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    playModem();

    // Print dial lines
    let i = 0;
    const lineInterval = setInterval(() => {
      if (i < DIAL_LINES.length) {
        setDialLines(prev => [...prev, DIAL_LINES[i]]);
        i++;
      } else {
        clearInterval(lineInterval);
      }
    }, 280);

    // Progress bar
    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progInterval); return 100; }
        return p + (Math.random() > 0.7 ? 1 : 2); // uneven like real dial-up
      });
    }, 80);

    const t1 = setTimeout(() => setPhase('connecting'), 2800);
    const t2 = setTimeout(() => setPhase('welcome'), 6200);
    const t3 = setTimeout(() => setPhase('mail'), 7800);
    const t4 = setTimeout(() => setShowAd(true), 9500);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progInterval);
      [t1, t2, t3, t4].forEach(clearTimeout);
    };
  }, []);

  const bar = (pct: number) => {
    const filled = Math.max(0, Math.min(20, Math.round(pct / 100 * 20)));
    return '█'.repeat(filled) + '░'.repeat(20 - filled);
  };

  // Dialing phase — dark terminal look
  if (phase === 'dialing') {
    return (
      <div className="h-full bg-black font-mono text-sm p-6 text-green-400 overflow-auto">
        {dialLines.map((l, i) => (
          <div key={i} className={l.startsWith('NO') ? 'text-red-500' : l.startsWith('CONNECT') ? 'text-green-300 font-bold' : 'text-green-400'}>
            {l || ' '}
          </div>
        ))}
        {dialLines.length >= 3 && (
          <div className="mt-2 animate-pulse text-green-600">▋</div>
        )}
      </div>
    );
  }

  // Connecting — progress bar
  if (phase === 'connecting') {
    return (
      <div className="h-full bg-black font-mono text-sm p-6 text-green-400 overflow-auto">
        {DIAL_LINES.map((l, i) => (
          <div key={i} className={l.startsWith('NO') ? 'text-red-500' : l.startsWith('CONNECT') ? 'text-green-300 font-bold' : 'text-green-400'}>
            {l || ' '}
          </div>
        ))}
        <div className="mt-4 space-y-1">
          <div>Signing on as <span className="text-green-300">bkness</span>...</div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-green-300">{bar(progress)}</span>
            <span className="text-green-600">{progress}%</span>
          </div>
          <div className="text-green-700 text-xs mt-1">28.8 Kbps · {Math.floor(progress * 148)} bytes received</div>
        </div>
      </div>
    );
  }

  // Welcome / Mail — Windows 95 style
  return (
    <div className="h-full overflow-auto" style={{ background: '#008080', fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: '11px' }}>
      {/* Welcome banner */}
      {phase === 'welcome' && (
        <div className="flex items-center justify-center h-full">
          <div style={{ background: '#c0c0c0', ...raised, padding: '0', width: '360px' }}>
            <div style={{ background: '#000080', color: 'white', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-bold">America Online</span>
              <div className="flex gap-1">
                {['_','□','✕'].map(b => (
                  <button key={b} style={{ background: '#c0c0c0', color: 'black', border: '1px solid', borderColor: '#ffffff #808080 #808080 #ffffff', width: 16, height: 14, fontSize: 9, cursor: 'pointer', lineHeight: 1 }}>{b}</button>
                ))}
              </div>
            </div>
            <div className="text-center p-8">
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#000080', letterSpacing: -1 }}>AOL</div>
              <div style={{ fontSize: 13, marginTop: 8, color: '#000080' }}>America Online</div>
              <div style={{ fontSize: 18, marginTop: 16, color: '#000080', fontWeight: 'bold' }}>Welcome, bkness!</div>
              <div style={{ marginTop: 8, color: '#444' }}>You are now connected at 28,800 bps</div>
            </div>
          </div>
        </div>
      )}

      {/* Mail inbox */}
      {phase === 'mail' && (
        <div className="p-4">
          {/* Toolbar */}
          <div style={{ background: '#c0c0c0', ...raised, marginBottom: 4 }}>
            <div style={{ background: '#000080', color: 'white', padding: '3px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <span className="font-bold">AOL Mail — bkness</span>
              <div className="flex gap-1">
                {['_','□','✕'].map(b => (
                  <button key={b} style={{ background: '#c0c0c0', color: 'black', border: '1px solid', borderColor: '#ffffff #808080 #808080 #ffffff', width: 16, height: 14, fontSize: 9, cursor: 'pointer' }}>{b}</button>
                ))}
              </div>
            </div>

            {/* Toolbar buttons */}
            <div className="flex gap-2 p-2">
              {['Write', 'Reply', 'Forward', 'Delete', 'Read'].map(label => (
                <button key={label} style={{ background: '#c0c0c0', ...raised, padding: '3px 10px', cursor: 'pointer', fontSize: 11 }}>{label}</button>
              ))}
            </div>
          </div>

          {/* You've got mail banner */}
          <div style={{ background: '#ffff99', border: '2px solid #cccc00', padding: '10px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
            <span style={{ fontSize: 28 }}>📬</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#000080', fontSize: 16 }}>You've Got Mail!</div>
              <div style={{ color: '#444', fontSize: 11 }}>3 unread messages · Inbox</div>
            </div>
          </div>

          {/* Email list */}
          <div style={{ background: 'white', ...sunken }}>
            {/* Header */}
            <div className="flex" style={{ background: '#c0c0c0', borderBottom: '1px solid #808080' }}>
              {['', 'From', 'Subject', 'Time'].map((h, i) => (
                <div key={i} style={{ ...raised, padding: '3px 8px', flex: i === 2 ? 2 : 1, fontSize: 11, fontWeight: 'bold' }}>{h}</div>
              ))}
            </div>

            {EMAILS.map((email, i) => (
              <div
                key={i}
                className="flex items-center hover:bg-blue-100 cursor-pointer"
                style={{
                  background: email.unread ? '#e8e8ff' : 'white',
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: email.unread ? 'bold' : 'normal',
                }}
              >
                <div style={{ padding: '5px 8px', flex: 0.3, textAlign: 'center' }}>
                  {email.unread ? '📧' : '📨'}
                </div>
                <div style={{ padding: '5px 8px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email.from}
                </div>
                <div style={{ padding: '5px 8px', flex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email.subject}
                  <span style={{ fontWeight: 'normal', color: '#666', marginLeft: 8 }}>— {email.preview}</span>
                </div>
                <div style={{ padding: '5px 8px', flex: 0.7, color: '#666', whiteSpace: 'nowrap' }}>
                  {email.time}
                </div>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex gap-2 mt-2">
            <div style={{ ...sunken, padding: '2px 8px', flex: 2, color: '#444' }}>3 messages, 3 unread</div>
            <div style={{ ...sunken, padding: '2px 8px', flex: 1, color: '#444' }}>28.8 Kbps</div>
            <div style={{ ...sunken, padding: '2px 8px', flex: 1, color: '#008000', fontWeight: 'bold' }}>● Connected</div>
          </div>
        </div>
      )}

      {/* Pop-up ad */}
      {showAd && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 100 }} onClick={e => e.stopPropagation()}>
          <div style={{ background: '#c0c0c0', ...raised, width: 320, position: 'relative' }}>
            <div style={{ background: '#000080', color: 'white', padding: '3px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
              <span className="font-bold">Congratulations!!!</span>
              <button
                onClick={() => setShowAd(false)}
                style={{ background: '#c0c0c0', color: 'black', border: '1px solid', borderColor: '#ffffff #808080 #808080 #ffffff', width: 16, height: 14, fontSize: 9, cursor: 'pointer' }}
              >✕</button>
            </div>
            <div className="p-5 text-center space-y-3">
              <div style={{ fontSize: 22 }}>🎉🎊🎉</div>
              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#cc0000' }}>
                YOU ARE THE 1,000,000th VISITOR!!!
              </div>
              <div style={{ fontSize: 11 }}>
                You have been selected to receive a<br />
                <strong>FREE VACATION</strong> to beautiful<br />
                Cottonwood, AZ!
              </div>
              <div style={{ fontSize: 9, color: '#888' }}>
                (just hire the developer. that's the joke.)
              </div>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setShowAd(false)}
                  style={{ background: '#c0c0c0', ...raised, padding: '4px 20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  CLAIM PRIZE
                </button>
                <button
                  onClick={() => setShowAd(false)}
                  style={{ background: '#c0c0c0', ...raised, padding: '4px 20px', cursor: 'pointer' }}
                >
                  No Thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
