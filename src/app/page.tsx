import Terminal from '@/components/Terminal';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-3xl">
          <Terminal />
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

      {/* Resume */}
      <section className="px-4 py-20 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-[#4a7a55] text-sm font-mono mb-2">❯ cat resume.pdf</p>
          <h2 className="text-[#00ff41] font-mono text-2xl font-bold">Resume</h2>
        </div>
        <div className="border border-[#1a3a22] rounded-lg bg-[#020a04]/80 p-6 font-mono text-xs space-y-4">
          <p className="text-[#4a7a55]">Binary file — use download flag to view.</p>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#00ff41]/40 text-[#00ff41] rounded hover:bg-[#00ff41]/5 hover:border-[#00ff41] transition-all duration-200"
          >
            ↓ download resume.pdf
          </a>
        </div>
      </section>
    </main>
  );
}
