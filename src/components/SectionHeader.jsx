export default function SectionHeader({ icon: Icon, badge, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {badge && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">
            {badge}
          </span>
        )}
      </div>

      <h2 className="text-2xl font-bold text-[color:var(--bb-text)]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
