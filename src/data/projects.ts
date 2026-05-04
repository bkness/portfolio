export type ProjectData = {
  id: number;
  name: string;
  liveUrl: string | null;
  localPort: string;
  tags: string[];
  description: string;
  github: string;
};

export const TERMINAL_PROJECTS: ProjectData[] = [
  {
    id: 1,
    name: 'forged-cli',
    liveUrl: null,
    localPort: '3000',
    tags: ['Node.js', 'npm', 'Security', 'CLI'],
    description: 'Security-first developer CLI',
    github: 'https://github.com/bkness/forged-cli',
  },
  {
    id: 2,
    name: 'game-hub',
    liveUrl: 'https://video-gaming-hub.onrender.com/',
    localPort: '3001',
    tags: ['GraphQL', 'React', 'MongoDB', 'JWT'],
    description: 'Full stack game tracker with GraphQL API and JWT auth',
    github: 'https://github.com/bkness/game-hub',
  },
  {
    id: 3,
    name: 'nightowlz',
    liveUrl: null,
    localPort: '8081',
    tags: ['React Native', 'Expo', 'MongoDB', 'iOS'],
    description: 'iOS nightlife discovery app',
    github: 'https://github.com/bkness/nightowlz',
  },
  {
    id: 4,
    name: 'breweries',
    liveUrl: 'https://brewery-search.onrender.com',
    localPort: '3002',
    tags: ['Node.js', 'SQLite', 'Sequelize', 'Handlebars'],
    description: 'Brewery finder with full search',
    github: 'https://github.com/bkness/breweries',
  },
];
