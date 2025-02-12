import Markets from '@/components/markets';

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Markets />
      </div>
    </main>
  );
}
