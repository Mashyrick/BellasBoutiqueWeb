import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const styles = {
    success:
      "border-emerald-200/70 bg-emerald-50/95 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-950/80 dark:text-emerald-100",
    error:
      "border-rose-200/70 bg-rose-50/95 text-rose-900 dark:border-rose-500/20 dark:bg-rose-950/80 dark:text-rose-100",
    info:
      "border-sky-200/70 bg-sky-50/95 text-sky-900 dark:border-sky-500/20 dark:bg-sky-950/80 dark:text-sky-100",
    warning:
      "border-amber-200/70 bg-amber-50/95 text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/80 dark:text-amber-100",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-toast-in">
      <div
        className={`min-w-[280px] max-w-sm rounded-2xl border px-4 py-3 text-sm font-medium shadow-[0_20px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl ${
          styles[toast.type] || styles.info
        }`}
      >
        {toast.message}
      </div>
    </div>
  );
}
