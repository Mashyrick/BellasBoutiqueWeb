export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,247,0.92)_0%,rgba(246,241,238,0.96)_50%,rgba(240,234,230,0.98)_100%)] dark:bg-[linear-gradient(180deg,rgba(14,12,15,0.96)_0%,rgba(16,13,17,0.98)_55%,rgba(10,9,11,1)_100%)]" />

      <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[rgba(206,172,154,0.22)] blur-3xl animate-float-soft dark:bg-[rgba(196,160,141,0.1)]" />
      <div className="absolute right-[-8rem] top-[12%] h-[24rem] w-[24rem] rounded-full bg-[rgba(130,102,92,0.16)] blur-3xl animate-float-slower dark:bg-[rgba(148,118,106,0.08)]" />
      <div className="absolute bottom-[-9rem] left-[18%] h-[22rem] w-[22rem] rounded-full bg-[rgba(232,215,207,0.65)] blur-3xl animate-float-slowest dark:bg-[rgba(255,255,255,0.04)]" />

      <div className="absolute inset-0 opacity-[0.45] dark:opacity-[0.12] bg-[linear-gradient(rgba(120,91,72,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,91,72,0.05)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_42%),radial-gradient(circle_at_bottom,rgba(88,60,48,0.08),transparent_32%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_36%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.03),transparent_32%)]" />
    </div>
  );
}
