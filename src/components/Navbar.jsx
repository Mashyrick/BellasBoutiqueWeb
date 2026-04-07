import {
  HelpCircle,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Receipt,
  ShoppingBag,
  Sun,
  UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

function NavItem({ to, icon: Icon, children, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200",
          isActive
            ? "border border-[rgba(42,29,28,0.12)] bg-[rgba(42,29,28,0.92)] text-white shadow-[0_16px_32px_rgba(32,26,24,0.18)] dark:text-white"
            : "border border-transparent bg-white/38 text-[color:var(--bb-text)] hover:border-[rgba(118,92,76,0.14)] hover:bg-white/62 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]",
        ].join(" ")
      }
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>

      {badge ? (
        <span className="rounded-full bg-black/80 px-2 py-0.5 text-[11px] text-white dark:bg-white/15 dark:text-white">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}

export default function Navbar() {
  const { currentUser, logout, cartCount, theme, toggleTheme, invoice } =
    useApp();

  const isAdminView =
    currentUser && ["admin", "vendedor"].includes(currentUser.role);

  const roleLabel = currentUser
    ? currentUser.role === "admin"
      ? "Administrador"
      : currentUser.role === "vendedor"
        ? "Vendedor"
        : "Cliente"
    : "Invitado";

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="container-page rounded-[2rem] border border-[rgba(118,92,76,0.12)] bg-[rgba(255,249,246,0.66)] shadow-[0_22px_50px_rgba(32,26,24,0.08)] backdrop-blur-2xl dark:bg-[rgba(18,15,19,0.72)]">
        <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div className="min-w-0">
            <p className="eyebrow mb-2">Boutique premium</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--bb-text)] sm:text-[2rem]">
              Bellas Boutique
            </h1>
            <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
              Sistema web con vista de cliente y administración para catálogo,
              compras, soporte y control interno.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap items-center gap-2">
              <NavItem to="/" icon={Home}>
                Inicio
              </NavItem>

              <NavItem to="/support" icon={HelpCircle}>
                Soporte
              </NavItem>

              {!isAdminView && (
                <NavItem
                  to="/cart"
                  icon={ShoppingBag}
                  badge={cartCount || undefined}
                >
                  Carrito
                </NavItem>
              )}

              {invoice && currentUser?.role === "cliente" && (
                <NavItem to="/invoice" icon={Receipt}>
                  Factura
                </NavItem>
              )}

              {!currentUser ? (
                <>
                  <NavItem to="/login" icon={LogIn}>
                    Ingresar
                  </NavItem>

                  <NavItem to="/register" icon={UserPlus}>
                    Crear cuenta
                  </NavItem>
                </>
              ) : (
                <>
                  {isAdminView && (
                    <NavItem to="/admin" icon={LayoutDashboard}>
                      Panel
                    </NavItem>
                  )}

                  <button onClick={logout} className="btn-secondary">
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </>
              )}
            </nav>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="badge-soft">
                {currentUser
                  ? `${currentUser.fullName} · ${roleLabel}`
                  : "Invitado · sin sesión"}
              </div>

              <button
                onClick={toggleTheme}
                className="btn-secondary px-4 py-2.5"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
