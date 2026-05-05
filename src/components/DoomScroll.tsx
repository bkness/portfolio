'use client';

const FEED = [
  {
    platform: 'github' as const,
    type: 'profile',
    user: 'bkness',
    time: '2m ago',
    content: 'Full Stack Developer · Cottonwood, AZ\nBuilds CLIs, web apps, and mobile tools.',
    meta: '12 repos · forged-cli · dotfiles',
    link: 'https://github.com/bkness',
    cta: 'Follow',
  },
  {
    platform: 'npm' as const,
    type: 'package',
    user: 'bkness',
    time: '3d ago',
    content: 'forged-cli@0.3.9 — Security-first developer CLI. Typosquat detection, tarball integrity, binary scanning, password gen.',
    meta: '1,312 total downloads · growing',
    link: 'https://www.npmjs.com/package/forged-cli',
    cta: 'npm install -g forged-cli',
  },
  {
    platform: 'x' as const,
    type: 'post',
    user: 'bkness',
    handle: '@bkness',
    time: '1h ago',
    content: 'just deployed a portfolio that 404s the resume on purpose 😭\n\nit\'s called brand awareness',
    meta: '💬 0   🔁 2   ❤️ 14',
    link: null,
    cta: null,
  },
  {
    platform: 'github' as const,
    type: 'activity',
    user: 'bkness',
    repo: 'bkness/dotfiles',
    time: '6h ago',
    content: 'pushed 3 commits to main\n\nfeat: asteroids in the terminal, because obviously',
    meta: 'bkness/dotfiles · main',
    link: 'https://github.com/bkness/dotfiles',
    cta: 'View repo',
  },
  {
    platform: 'linkedin' as const,
    type: 'post',
    user: 'Brandon Kelly',
    title: 'Full Stack Developer',
    time: '2d ago',
    content: '🚀 Actively looking for new opportunities!\n\nOpen to full-time remote roles and contract work. I build CLIs, web apps, and mobile tools — check the pinned projects.',
    meta: '👍 23 reactions',
    link: null,
    cta: 'Connect',
  },
  {
    platform: 'npm' as const,
    type: 'milestone',
    user: 'bkness',
    time: '1w ago',
    content: '🎉 forged-cli just crossed 1,000 downloads.\n\nFree security scanning for npm packages, forever.',
    meta: '1,312 downloads and counting',
    link: 'https://www.npmjs.com/~bkness',
    cta: 'View all packages',
  },
  {
    platform: 'x' as const,
    type: 'post',
    user: 'bkness',
    handle: '@bkness',
    time: '3d ago',
    content: 'shipping code at 2am is a personality trait\n\nalso my asteroids high score is 4,800 and no bugs are getting fixed until i beat it',
    meta: '💬 1   🔁 0   ❤️ 8',
    link: null,
    cta: null,
  },
  {
    platform: 'github' as const,
    type: 'repo',
    user: 'bkness',
    repo: 'bkness/forged-cli',
    time: '5d ago',
    content: 'Security-first developer CLI for the paranoid npm user.\nTyposquats, integrity checks, binary scans.',
    meta: '⭐ 12   🍴 3   Node.js',
    link: 'https://github.com/bkness/forged-cli',
    cta: '⭐ Star',
  },
  {
    platform: 'linkedin' as const,
    type: 'post',
    user: 'Brandon Kelly',
    title: 'Full Stack Developer',
    time: '1w ago',
    content: 'Finished the ASU Full Stack Bootcamp 🎓\n\nShipped 5 projects, learned GraphQL, React Native, and somehow ended up building a CLI tool that people actually use.',
    meta: '👍 47 reactions · 3 comments',
    link: null,
    cta: 'Connect',
  },
];

const PLATFORM_STYLES = {
  github: {
    bg: '#0d1117',
    border: '#30363d',
    header: '#161b22',
    accent: '#238636',
    label: 'GitHub',
    badge: 'bg-[#238636]/20 text-[#3fb950] border-[#238636]/30',
    logo: (
      <svg viewBox="0 0 16 16" width="14" height="14" fill="#c9d1d9">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
  },
  npm: {
    bg: '#1a0505',
    border: '#3a1515',
    header: '#250a0a',
    accent: '#cc3534',
    label: 'npm',
    badge: 'bg-[#cc3534]/20 text-[#f47272] border-[#cc3534]/30',
    logo: (
      <span className="font-bold text-[#cc3534] text-xs leading-none">npm</span>
    ),
  },
  x: {
    bg: '#000000',
    border: '#2f3336',
    header: '#000000',
    accent: '#e7e9ea',
    label: 'X',
    badge: 'bg-white/10 text-white border-white/20',
    logo: (
      <span className="font-bold text-white text-sm leading-none">𝕏</span>
    ),
  },
  linkedin: {
    bg: '#000e1a',
    border: '#0a2a40',
    header: '#001529',
    accent: '#0a66c2',
    label: 'LinkedIn',
    badge: 'bg-[#0a66c2]/20 text-[#4d9fdc] border-[#0a66c2]/30',
    logo: (
      <span className="font-bold text-[#0a66c2] text-xs leading-none bg-white px-0.5 rounded-sm">in</span>
    ),
  },
};

type FeedItem = typeof FEED[number];

function FeedCard({ item }: { item: FeedItem }) {
  const s = PLATFORM_STYLES[item.platform];
  const lines = item.content.split('\n');

  return (
    <div
      className="rounded-xl overflow-hidden border text-xs"
      style={{ background: s.bg, borderColor: s.border }}
    >
      {/* card header */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: s.header }}>
        <div className="flex items-center justify-center w-5 h-5">
          {s.logo}
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${s.badge}`}>
          {s.label}
        </span>
        <span className="ml-auto text-[10px]" style={{ color: '#555' }}>{item.time}</span>
      </div>

      {/* avatar + user row */}
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          style={{ background: s.accent + '33', color: s.accent, border: `1px solid ${s.accent}44` }}
        >
          {item.user === 'Brandon Kelly' ? 'BK' : item.user.slice(0,2).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold leading-tight" style={{ color: '#e0e0e0' }}>
            {item.user}
          </div>
          {'title' in item && item.title && (
            <div className="text-[9px]" style={{ color: '#666' }}>{item.title}</div>
          )}
          {'handle' in item && item.handle && (
            <div className="text-[9px]" style={{ color: '#555' }}>{item.handle}</div>
          )}
          {'repo' in item && item.repo && (
            <div className="text-[9px] font-mono" style={{ color: s.accent }}>{item.repo}</div>
          )}
        </div>
      </div>

      {/* content */}
      <div className="px-3 pt-2 pb-1 leading-4 space-y-0.5" style={{ color: '#bbb' }}>
        {lines.map((line, i) => (
          <div key={i} className={line === '' ? 'h-1' : ''}>{line}</div>
        ))}
      </div>

      {/* meta + cta */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className="text-[9px]" style={{ color: '#444' }}>{item.meta}</span>
        {item.cta && item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] px-2 py-1 rounded font-mono border transition-colors"
            style={{ color: s.accent, borderColor: s.accent + '55' }}
          >
            {item.cta} ↗
          </a>
        )}
        {item.cta && !item.link && (
          <span
            className="text-[9px] px-2 py-1 rounded font-mono border"
            style={{ color: s.accent + '88', borderColor: s.accent + '33' }}
          >
            {item.cta}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DoomScroll() {
  return (
    <div className="h-full bg-[#050505] overflow-auto flex flex-col md:flex-row items-center md:items-start justify-start md:justify-center py-8 px-6 gap-6 md:gap-10">
      {/* Phone */}
      <div className="w-[300px] shrink-0 bg-[#0a0a0a] rounded-[36px] border-2 border-[#1a1a1a] overflow-hidden shadow-2xl">
        {/* Status bar */}
        <div className="bg-black px-6 pt-3 pb-1 flex items-center justify-between text-[10px] text-gray-600">
          <span>9:41</span>
          <div className="flex gap-1.5">●●● WiFi 100%</div>
        </div>

        {/* App header */}
        <div className="bg-black px-4 py-2.5 border-b border-[#1a1a1a] flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">feedr</div>
            <div className="text-[9px] text-gray-600">doom scroll mode active</div>
          </div>
          <div className="text-[10px] text-gray-600 border border-[#222] px-2 py-1 rounded-full">
            For You
          </div>
        </div>

        {/* Feed */}
        <div className="overflow-y-auto space-y-2 p-2" style={{ maxHeight: 'calc(76vh - 180px)' }}>
          {FEED.map((item, i) => (
            <FeedCard key={i} item={item} />
          ))}

          {/* End of feed */}
          <div className="text-center py-6 text-[10px] text-[#333] font-mono">
            you've reached the end<br />
            <span className="text-[#1a1a1a]">there is no end</span>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="bg-black border-t border-[#1a1a1a] px-6 py-2.5 flex justify-around">
          {['🏠', '🔍', '🔔', '👤'].map((icon, i) => (
            <div key={i} className={`text-base ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>{icon}</div>
          ))}
        </div>
        <div className="flex justify-center py-1.5 bg-black">
          <div className="w-20 h-0.5 bg-[#222] rounded-full" />
        </div>
      </div>

      {/* Side info */}
      <div className="mt-4 max-w-[180px] flex flex-col items-center md:items-start text-center md:text-left">
        <div className="text-sm font-bold text-white mb-3">bkness</div>
        <div className="space-y-3 text-[10px] text-gray-600 font-mono">
          <a
            href="https://github.com/bkness"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#3fb950] transition-colors group"
          >
            <span className="w-4 opacity-60 group-hover:opacity-100">GH</span>
            github.com/bkness ↗
          </a>
          <a
            href="https://www.npmjs.com/~bkness"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#f47272] transition-colors group"
          >
            <span className="w-4 opacity-60 group-hover:opacity-100 text-[8px]">npm</span>
            npmjs.com/~bkness ↗
          </a>
        </div>
        <div className="mt-5 text-[9px] text-[#333] font-mono leading-4">
          1.3k+ downloads<br />
          open to work<br />
          remote-first
        </div>
      </div>
    </div>
  );
}
