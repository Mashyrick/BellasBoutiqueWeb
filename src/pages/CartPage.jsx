import {
  CreditCard,
  Minus,
  Plus,
  ShoppingCart,
  Trash,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    tax,
    total,
    updateQuantity,
    clearCart,
    removeFromCart,
  } = useApp();

  const handleRemove = (item) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${item.name}" del carrito?`,
    );

    if (confirmed) {
      removeFromCart(item.id);
    }
  };

  const handleClearCart = () => {
    const confirmed = window.confirm("¿Deseas vaciar todo el carrito?");
    if (confirmed) {
      clearCart();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <div className="page-card">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            icon={ShoppingCart}
            badge="Compra"
            title="Carrito de compras"
            subtitle="Ajusta cantidades, elimina productos y valida el resumen antes del pago."
          />

          {cart.length ? (
            <button onClick={handleClearCart} className="btn-danger self-start">
              <Trash className="h-4 w-4" />
              Vaciar carrito
            </button>
          ) : null}
        </div>

        {!cart.length ? (
          <div className="surface-muted p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(42,29,28,0.08)] dark:bg-white/[0.05]">
              <ShoppingCart className="h-8 w-8 text-[color:var(--bb-text-soft)]" />
            </div>
            <p className="text-lg font-semibold text-[color:var(--bb-text)]">
              Tu carrito está vacío.
            </p>
            <p className="mt-2 text-sm text-[color:var(--bb-text-soft)]">
              Agrega productos desde el catálogo para verlos aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="surface-muted flex flex-col gap-4 p-4 md:flex-row md:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-full rounded-[1.25rem] object-cover md:w-28"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[color:var(--bb-text)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[color:var(--bb-text-soft)]">
                    {item.category}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-[color:var(--bb-text-soft)]">
                    <p className="font-semibold text-[color:var(--bb-text)]">
                      {currency(item.price)} c/u
                    </p>
                    <p>Subtotal: {currency(item.price * item.quantity)}</p>
                    <p>Stock disponible: {item.stock}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, "dec")}
                    className="btn-secondary rounded-xl px-3 py-3"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold text-[color:var(--bb-text)]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, "inc")}
                    disabled={item.quantity >= item.stock}
                    className="btn-secondary rounded-xl px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item)}
                  className="btn-secondary rounded-xl px-3 py-3 text-rose-700 dark:text-rose-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="page-card h-fit">
        <SectionHeader
          icon={CreditCard}
          badge="Resumen"
          title="Total de la compra"
          subtitle="Subtotal, impuesto y monto final antes del checkout."
        />
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between text-[color:var(--bb-text-soft)]">
            <span>Productos</span>
            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex items-center justify-between text-[color:var(--bb-text-soft)]">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[color:var(--bb-text-soft)]">
            <span>IVA 13%</span>
            <span>{currency(tax)}</span>
          </div>
          <div className="surface-muted px-4 py-4">
            <div className="flex items-center justify-between text-lg font-semibold text-[color:var(--bb-text)]">
              <span>Total</span>
              <span>{currency(total)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            disabled={!cart.length}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
          >
            Ir al pago
          </button>
        </div>
      </div>
    </div>
  );
}
