import Terminal from '@/components/Terminal';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-3xl">
          <Terminal />
        </div>
      </section>
    </main>
  );
}
