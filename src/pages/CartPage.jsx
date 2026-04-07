import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    total,
  } = useApp();

  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="page-card">
        <SectionHeader
          icon={ShoppingBag}
          badge="Carrito de compras"
          title="Productos seleccionados"
          subtitle="El carrito está asociado al usuario actual y permite modificar cantidades antes de pasar al módulo de pago."
        />

        {cart.length ? (
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item.id}
                className="surface-muted flex flex-col gap-4 p-4 md:flex-row md:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-full rounded-2xl object-cover md:w-28"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[color:var(--bb-text)]">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                    Categoría: {item.category} · Proveedor: {item.provider}
                  </p>

                  <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                    Precio unitario: {currency(item.price)}
                  </p>

                  <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                    Stock disponible: {item.stock}
                  </p>

                  <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                    Subtotal: {currency(item.price * item.quantity)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(118,92,76,0.14)] bg-white/60 px-3 py-2 dark:bg-white/[0.04]">
                    <button
                      onClick={() => updateQuantity(item.id, "dec")}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="min-w-[32px] text-center text-sm font-semibold text-[color:var(--bb-text)]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, "inc")}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 transition hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={clearCart} className="btn-secondary">
                Vaciar carrito
              </button>

              <Link to="/checkout" className="btn-primary">
                Continuar al pago
              </Link>
            </div>
          </div>
        ) : (
          <div className="surface-muted p-10 text-center">
            <p className="text-lg font-semibold text-[color:var(--bb-text)]">
              Tu carrito está vacío.
            </p>
            <p className="mt-2 text-sm text-[color:var(--bb-text-soft)]">
              Agrega productos desde el catálogo para continuar con la compra.
            </p>

            <div className="mt-5">
              <Link to="/" className="btn-primary">
                Ir al catálogo
              </Link>
            </div>
          </div>
        )}
      </section>

      <aside className="page-card">
        <SectionHeader
          icon={ShoppingBag}
          badge="Resumen de compra"
          title="Totales del carrito"
          subtitle="El sistema calcula subtotal, impuesto del 13% y total general antes de generar la factura."
        />

        <div className="surface-muted grid gap-4 p-5 text-sm text-[color:var(--bb-text-soft)]">
          <div className="flex items-center justify-between">
            <span>Productos diferentes</span>
            <strong className="text-[color:var(--bb-text)]">
              {cart.length}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <strong className="text-[color:var(--bb-text)]">
              {currency(subtotal)}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span>IVA (13%)</span>
            <strong className="text-[color:var(--bb-text)]">
              {currency(tax)}
            </strong>
          </div>

          <div className="flex items-center justify-between text-base font-semibold text-[color:var(--bb-text)]">
            <span>Total</span>
            <strong>{currency(total)}</strong>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[color:var(--bb-text-soft)] dark:border-white/10 dark:bg-white/5">
          Aquí puedes ajustar cantidades antes de confirmar la compra. El pago y
          la factura se procesan en el siguiente módulo.
        </div>

        {cart.length ? (
          <div className="mt-5">
            <Link to="/checkout" className="btn-primary w-full justify-center">
              Ir a checkout
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
