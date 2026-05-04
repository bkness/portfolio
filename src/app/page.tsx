import Terminal from '@/components/Terminal';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';

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
    </main>
  );
}
