import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { heroHighlights } from "../data/stats";

const editorialStats = [
  { label: "Curaduría", value: "Premium" },
  { label: "Entrega", value: "Costa Rica" },
  { label: "Experiencia", value: "Boutique" },
];

const serviceNotes = [
  { icon: Sparkles, text: "Selección visual limpia y editorial" },
  { icon: Truck, text: "Proceso de compra simple y directo" },
  { icon: ShieldCheck, text: "Acceso demo para cliente y admin" },
];

export default function Hero() {
  const { currentUser } = useApp();

  return (
    <section className="page-section mb-10">
      <div className="relative overflow-hidden rounded-[2.4rem] border border-[rgba(118,92,76,0.14)] bg-[linear-gradient(135deg,rgba(255,250,246,0.82)_0%,rgba(248,240,235,0.8)_48%,rgba(236,226,220,0.72)_100%)] p-6 shadow-[0_30px_70px_rgba(32,26,24,0.1)] backdrop-blur-2xl dark:bg-[linear-gradient(135deg,rgba(44,36,42,0.9)_0%,rgba(34,28,34,0.94)_52%,rgba(27,22,28,0.96)_100%)] md:p-8 lg:p-10">
        <div className="absolute right-[-5rem] top-[-6rem] h-56 w-56 rounded-full bg-[rgba(214,188,173,0.32)] blur-3xl dark:bg-[rgba(222,193,178,0.16)]" />
        <div className="absolute bottom-[-4rem] left-[16%] h-48 w-48 rounded-full bg-[rgba(255,255,255,0.45)] blur-3xl dark:bg-[rgba(255,255,255,0.08)]" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:gap-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-[rgba(118,92,76,0.16)] bg-white/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7f675c] dark:bg-white/[0.04] dark:text-[#ceb8ad]">
                Nueva colección · Bellas Boutique
              </span>

              <div className="max-w-4xl space-y-4">
                <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--bb-text)] sm:text-5xl lg:text-6xl">
                  Moda femenina con presencia boutique, composición editorial y
                  compra clara.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--bb-text-soft)] sm:text-base">
                  Descubre nuestra nueva colección diseñada para destacar en
                  cada detalle.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#catalogo" className="btn-primary">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </a>

              {!currentUser && (
                <Link to="/login" className="btn-secondary">
                  Iniciar sesión
                </Link>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {editorialStats.map((item) => (
                <div key={item.label} className="surface-muted px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--bb-text-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[color:var(--bb-text)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="card p-5">
              <p className="eyebrow">Acceso demo</p>
              <div className="mt-4 space-y-3 text-sm text-[color:var(--bb-text-soft)]">
                <p>
                  <span className="font-semibold text-[color:var(--bb-text)]">
                    Admin:
                  </span>{" "}
                  admin@bellasboutique.com / Admin123!
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--bb-text)]">
                    Cliente:
                  </span>{" "}
                  cliente@bellasboutique.com / Cliente123!
                </p>
              </div>
            </div>

            <div className="card p-5">
              <p className="eyebrow">Valor de la experiencia</p>
              <ul className="mt-4 space-y-3">
                {serviceNotes.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 text-sm text-[color:var(--bb-text-soft)]"
                  >
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(42,29,28,0.08)] text-[color:var(--bb-text)] dark:bg-white/[0.05]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <p className="eyebrow">Incluye</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {heroHighlights.map((item) => (
                  <span key={item} className="badge-soft">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
