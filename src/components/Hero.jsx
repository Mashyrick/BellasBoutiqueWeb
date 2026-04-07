import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Hero() {
  const { currentUser, products, inventorySummary } = useApp();

  const isAdminView =
    currentUser && ["admin", "vendedor"].includes(currentUser.role);

  return (
    <section className="hero-grid">
      <div className="hero-card">
        <div className="space-y-6">
          <span className="hero-badge">
            <Sparkles className="h-4 w-4" />
            Experiencia UI moderna
          </span>

          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--bb-text)] sm:text-5xl lg:text-6xl">
              Bellas Boutique, una tienda online con vista de cliente y
              administración.
            </h2>

            <p className="max-w-2xl text-base leading-7 text-[color:var(--bb-text-soft)] sm:text-lg">
              Explora el catálogo, gestiona productos, procesa compras, genera
              facturas y da seguimiento a soporte desde una experiencia visual
              coherente, moderna y funcional.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {currentUser ? (
              isAdminView ? (
                <Link to="/admin" className="btn-primary">
                  Ir al panel administrativo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link to="/cart" className="btn-primary">
                  Ver carrito
                  <ShoppingBag className="h-4 w-4" />
                </Link>
              )
            ) : (
              <>
                <Link to="/login" className="btn-primary">
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link to="/register" className="btn-secondary">
                  Crear cuenta
                </Link>
              </>
            )}

            <a href="#catalogo" className="btn-secondary">
              Ver catálogo
            </a>
          </div>

          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
                Productos
              </p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--bb-text)]">
                {products.length}
              </p>
            </div>

            <div className="surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
                Stock bajo
              </p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--bb-text)]">
                {inventorySummary.lowStock}
              </p>
            </div>

            <div className="surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
                Acceso
              </p>
              <p className="mt-2 text-base font-semibold text-[color:var(--bb-text)]">
                {currentUser
                  ? `${currentUser.fullName} · ${currentUser.role}`
                  : "Invitado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-side-card">
        <div className="space-y-5">
          <div className="rounded-3xl border border-[rgba(118,92,76,0.14)] bg-white/55 p-5 dark:bg-white/[0.03]">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(42,29,28,0.92)] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <h3 className="text-lg font-semibold text-[color:var(--bb-text)]">
              Requerimientos académicos cubiertos
            </h3>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--bb-text-soft)]">
              <li>• Login y registro de usuarios</li>
              <li>• Catálogo con filtros y stock</li>
              <li>• Carrito, pagos y factura digital</li>
              <li>• Soporte, encuestas y chat</li>
              <li>• Panel administrativo y reportes</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[rgba(118,92,76,0.14)] bg-[rgba(42,29,28,0.92)] p-5 text-white shadow-[0_22px_50px_rgba(32,26,24,0.18)]">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">
              Estado del sistema
            </p>

            <p className="mt-3 text-lg font-semibold">
              {currentUser
                ? "Sesión activa y lista para operar"
                : "Puedes navegar el catálogo y luego iniciar sesión"}
            </p>

            <p className="mt-2 text-sm leading-6 text-white/80">
              Esta versión integra una lógica frontend simulada para demostrar
              seguridad, trazabilidad, soporte, compras y administración.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
