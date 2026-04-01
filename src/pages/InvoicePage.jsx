import { ShieldCheck } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

export default function InvoicePage() {
  const { invoice } = useApp();

  if (!invoice) {
    return (
      <div className="page-card text-center text-[color:var(--bb-text-soft)]">
        No hay factura generada todavía.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl page-card">
      <SectionHeader
        icon={ShieldCheck}
        badge="Factura"
        title="Factura generada"
        subtitle="Resumen de la compra simulada con detalle de productos y totales."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-muted space-y-2 p-5 text-sm text-[color:var(--bb-text-soft)]">
          <p>
            <strong className="text-[color:var(--bb-text)]">Número:</strong> {invoice.id}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">Fecha:</strong> {invoice.date}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">Cliente:</strong> {invoice.customer}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">Correo:</strong> {invoice.email}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">Método:</strong> {invoice.method}
          </p>
        </div>
        <div className="surface-muted space-y-2 p-5 text-sm text-[color:var(--bb-text-soft)]">
          <p>
            <strong className="text-[color:var(--bb-text)]">Entrega:</strong> {invoice.deliveryAddress}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">Subtotal:</strong> {currency(invoice.subtotal)}
          </p>
          <p>
            <strong className="text-[color:var(--bb-text)]">IVA:</strong> {currency(invoice.tax)}
          </p>
          <p className="text-lg font-semibold text-[color:var(--bb-text)]">
            <strong>Total:</strong> {currency(invoice.total)}
          </p>
        </div>
      </div>

      <div className="table-shell mt-6">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[rgba(42,29,28,0.94)] text-white dark:text-[#1b1413]">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-t border-[rgba(118,92,76,0.14)]">
                <td className="px-4 py-3 text-[color:var(--bb-text)]">{item.name}</td>
                <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">{item.quantity}</td>
                <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">{currency(item.price)}</td>
                <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">
                  {currency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
