import { AlertTriangle, ArrowRight, PackageCheck, Tag } from "lucide-react";
import { currency } from "../utils";

export default function ProductCard({
  product,
  onAdd,
  disablePurchase = false,
}) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="card group overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[rgba(255,255,255,0.92)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5d4b42] shadow-sm">
            {product.category}
          </span>

          {isLowStock ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800 shadow-sm">
              Stock bajo
            </span>
          ) : null}

          {isOutOfStock ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-800 shadow-sm">
              Agotado
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold tracking-tight text-[color:var(--bb-text)]">
                {product.name}
              </h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-[color:var(--bb-text-soft)]">
                <Tag className="h-4 w-4" />
                Proveedor: {product.provider}
              </p>
            </div>

            <p className="shrink-0 text-xl font-semibold text-[color:var(--bb-text)]">
              {currency(product.price)}
            </p>
          </div>

          <p className="min-h-[4rem] text-sm leading-6 text-[color:var(--bb-text-soft)]">
            {product.description}
          </p>

          <div className="grid gap-2 text-sm text-[color:var(--bb-text-soft)]">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4" />
              <span>Stock disponible: {product.stock}</span>
            </div>

            {isLowStock ? (
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                <span>Quedan pocas unidades.</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={() => onAdd(product)}
            disabled={isOutOfStock || disablePurchase}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
          >
            {disablePurchase
              ? "Solo clientes pueden comprar"
              : isOutOfStock
                ? "Sin stock"
                : "Agregar al carrito"}
            {!disablePurchase && !isOutOfStock ? (
              <ArrowRight className="h-4 w-4" />
            ) : null}
          </button>
        </div>
      </div>
    </article>
  );
}
