'use client';

import { useState } from 'react';

const PROJECTS = [
  {
    number: '01',
    name: 'forged-cli',
    description: 'Security-first developer CLI — typosquat detection, tarball integrity, binary scanning, and password generation. Published on npm with 1.3k+ downloads.',
    tags: ['Node.js', 'npm', 'Security', 'CLI'],
    github: 'https://github.com/bkness/forged-cli',
    demo: 'https://www.npmjs.com/package/forged-cli',
    demoLabel: 'npm',
    highlight: true,
  },
  {
    number: '02',
    name: 'game-hub',
    description: 'Full stack game tracker with GraphQL API, JWT auth, and full CRUD. Conditional rendering based on auth state throughout.',
    tags: ['GraphQL', 'React', 'Node.js', 'MongoDB', 'JWT'],
    github: 'https://github.com/bkness/game-hub',
    demo: null,
    demoLabel: null,
  },
  {
    number: '03',
    name: 'nightowlz',
    description: 'iOS nightlife discovery app built with React Native and Expo. JWT auth, MongoDB backend, real-time venue data.',
    tags: ['React Native', 'Expo', 'MongoDB', 'JWT', 'iOS'],
    github: 'https://github.com/bkness/nightowlz',
    demo: null,
    demoLabel: null,
  },
  {
    number: '04',
    name: 'breweries',
    description: 'Brewery finder rebuilt from the ground up — migrated from MySQL/Heroku to SQLite/Render. Covers the full migration story from legacy stack to modern deploy.',
    tags: ['Node.js', 'SQLite', 'Sequelize', 'MySQL', 'Render'],
    github: 'https://github.com/bkness/breweries',
    demo: 'https://breweries.onrender.com',
    demoLabel: 'live',
  },
  {
    number: '05',
    name: 'devlog',
    description: 'Full CRUD developer journal with session-based auth, MySQL persistence, and Handlebars templating.',
    tags: ['Node.js', 'MySQL', 'Express', 'Handlebars', 'Auth'],
    github: 'https://github.com/bkness/devlog',
    demo: null,
    demoLabel: null,
  },
  {
    number: '06',
    name: 'dotfiles',
    description: 'Terminal-first dev environment — custom zsh shell with hooks, plugin registry, GitHub workflow automation, and forged-cli integration.',
    tags: ['zsh', 'Shell', 'Automation', 'CLI', 'DevOps'],
    github: 'https://github.com/bkness/dotfiles',
    demo: null,
    demoLabel: null,
  },
];

export default function Projects() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="px-4 py-20 max-w-5xl mx-auto w-full">
      <style>{`
        .projects-wrap {
          overflow: hidden;
          transition: max-height 0.5s ease, mask-image 0.3s ease;
          max-height: 2000px;
        }
        .projects-wrap.collapsed {
          max-height: 420px;
          mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent 100%);
        }
        @media (max-width: 767px) {
          .projects-wrap.collapsed {
            max-height: 540px;
            mask-image: linear-gradient(to bottom, #000 28%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, #000 28%, transparent 100%);
          }
        }
      `}</style>

      <div className="mb-12">
        <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ projects --featured</p>
        <h2 className="text-[#00ff41] font-mono text-2xl font-bold">Featured Work</h2>
        <p className="text-[#4a7a55] font-mono text-sm mt-2">
          MySQL · MongoDB · SQLite · PostgreSQL · GraphQL — intentional coverage, not coincidence.
        </p>
      </div>

      <div className={`projects-wrap${expanded ? '' : ' collapsed'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        {PROJECTS.map((p) => (
          <div
            key={p.number}
            className={`group relative border rounded-lg p-6 bg-[#020a04]/80 transition-all duration-300
              ${p.highlight
                ? 'border-[#00ff41]/50 shadow-[0_0_20px_rgba(0,255,65,0.08)]'
                : 'border-[#1a3a22] hover:border-[#00ff41]/40 hover:shadow-[0_0_20px_rgba(0,255,65,0.06)]'
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[#1a3a22] font-mono text-xs">{p.number}</span>
              <div className="flex gap-3">
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4a7a55] hover:text-[#00ff41] font-mono text-xs transition-colors"
                  >
                    {p.demoLabel} ↗
                  </a>
                )}
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4a7a55] hover:text-[#00ff41] font-mono text-xs transition-colors"
                >
                  github ↗
                </a>
              </div>
            </div>

            <h3 className="text-[#00ff41] font-mono font-bold text-base mb-2">{p.name}</h3>
            <p className="text-[#c8ffd4] font-mono text-xs leading-5 mb-4">{p.description}</p>

            <div className="flex flex-wrap gap-2">
              {p.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[#4a7a55] border border-[#1a3a22] font-mono text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="font-mono text-sm text-[#4a7a55] border border-[#1a3a22] px-6 py-2 rounded hover:border-[#00ff41]/40 hover:text-[#00ff41] transition-all duration-200"
        >
          {expanded ? '❯ collapse --projects' : '❯ view --all-projects'}
        </button>
      </div>
    </section>
  );
}
