export default function SectionHeader({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(118,92,76,0.14)] bg-white/55 text-[color:var(--bb-text)] shadow-[0_12px_28px_rgba(32,26,24,0.06)] backdrop-blur-xl dark:bg-white/[0.04]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        {badge ? <p className="eyebrow mb-2">{badge}</p> : null}
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle mt-2">{subtitle}</p>
      </div>
    </div>
  );
}
