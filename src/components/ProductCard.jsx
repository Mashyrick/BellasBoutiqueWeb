import { ArrowRight } from "lucide-react";
import { currency } from "../utils";

export default function ProductCard({ product, onAdd }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-[rgba(118,92,76,0.14)] bg-[rgba(255,252,250,0.72)] shadow-[0_22px_48px_rgba(32,26,24,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(32,26,24,0.12)] dark:bg-[rgba(22,18,22,0.76)]">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="badge-soft">{product.category}</span>
          <span
            className={`badge-soft ${
              isOutOfStock
                ? "!border-transparent !bg-rose-100 !text-rose-700 dark:!bg-rose-950/40 dark:!text-rose-300"
                : ""
            }`}
          >
            {isOutOfStock ? "Agotado" : `${product.stock} disponibles`}
          </span>
        </div>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[color:var(--bb-text)]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                Proveedor: {product.provider}
              </p>
            </div>
            <p className="text-xl font-semibold text-[color:var(--bb-text)]">
              {currency(product.price)}
            </p>
          </div>

          <p className="min-h-[3.5rem] text-sm leading-6 text-[color:var(--bb-text-soft)]">
            {product.description}
          </p>
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={() => onAdd(product)}
            disabled={isOutOfStock}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-300 disabled:text-slate-600 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
          >
            {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
            {!isOutOfStock ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </div>
      </div>
    </article>
  );
}
