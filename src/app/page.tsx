'use client';

import { useState, useCallback } from 'react';
import Terminal from '@/components/Terminal';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Contact from '@/components/Contact';
import FakeBrowser from '@/components/FakeBrowser';
import Resume from '@/components/Resume';

export default function Home() {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const handleOpenProject = useCallback((id: number) => setOpenProject(id), []);
  const handleCloseBrowser = useCallback(() => setOpenProject(null), []);

  return (
    <main className="flex flex-col min-h-screen">
      <FakeBrowser projectId={openProject} onClose={handleCloseBrowser} />

      <section className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-3xl">
          <Terminal onOpenProject={handleOpenProject} />
        </div>
      </section>

      <div className="border-t border-[#1a3a22]/50" />

      <div className="flex justify-center w-full">
        <Projects />
      </div>

      <div className="border-t border-[#1a3a22]/50" />

      <div className="flex justify-center w-full">
        <Skills />
      </div>

      <div className="border-t border-[#1a3a22]/50" />

      <div className="flex justify-center w-full">
        <About />
      </div>

      <div className="border-t border-[#1a3a22]/50" />

      <div className="flex justify-center w-full">
        <Contact />
      </div>

      <div className="border-t border-[#1a3a22]/50" />

      <div className="flex justify-center w-full">
        <Resume />
      </div>
    </main>
  );
}
