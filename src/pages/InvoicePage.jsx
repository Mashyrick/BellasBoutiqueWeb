import { MailCheck, ReceiptText, ShieldCheck } from "lucide-react";
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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="page-card">
        <SectionHeader
          icon={ShieldCheck}
          badge="Facturación"
          title="Factura digital generada"
          subtitle="Detalle completo de la transacción, pago realizado, productos comprados y datos de entrega."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-muted space-y-3 p-5 text-sm text-[color:var(--bb-text-soft)]">
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Número de factura:
              </strong>{" "}
              {invoice.id}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Fecha de emisión:
              </strong>{" "}
              {invoice.date}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">Cliente:</strong>{" "}
              {invoice.customer}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">Correo:</strong>{" "}
              {invoice.email}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Usuario asociado:
              </strong>{" "}
              {invoice.userId}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Carrito creado:
              </strong>{" "}
              {new Date(invoice.cartCreatedAt).toLocaleString("es-CR")}
            </p>
          </div>

          <div className="surface-muted space-y-3 p-5 text-sm text-[color:var(--bb-text-soft)]">
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Método de pago:
              </strong>{" "}
              {invoice.method}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Estado del pago:
              </strong>{" "}
              {invoice.paymentStatus}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Fecha del pago:
              </strong>{" "}
              {new Date(invoice.paymentDate).toLocaleString("es-CR")}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Dirección de entrega:
              </strong>{" "}
              {invoice.deliveryAddress}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">Subtotal:</strong>{" "}
              {currency(invoice.subtotal)}
            </p>
            <p>
              <strong className="text-[color:var(--bb-text)]">
                Impuesto (13%):
              </strong>{" "}
              {currency(invoice.tax)}
            </p>
            <p className="text-lg font-semibold text-[color:var(--bb-text)]">
              <strong>Total:</strong> {currency(invoice.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="page-card">
        <SectionHeader
          icon={ReceiptText}
          badge="Detalle"
          title="Productos facturados"
          subtitle="Cada compra queda registrada con cantidad, precio unitario, subtotal y fecha."
        />

        <div className="table-shell">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[rgba(42,29,28,0.94)] text-white dark:text-white">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Precio unitario</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3">Fecha de compra</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[rgba(118,92,76,0.14)]"
                >
                  <td className="px-4 py-3 text-[color:var(--bb-text)]">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">
                    {currency(item.price)}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">
                    {currency(item.price * item.quantity)}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--bb-text-soft)]">
                    {new Date(item.purchaseDate).toLocaleString("es-CR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <SectionHeader
          icon={MailCheck}
          badge="Confirmación"
          title="Comprobante enviado"
          subtitle="En esta versión académica, el sistema simula el envío del correo de confirmación con la factura y dirección de entrega."
        />

        <div className="surface-muted p-5 text-sm leading-6 text-[color:var(--bb-text-soft)]">
          <p>
            Se registró el envío de un correo de confirmación al usuario con los
            detalles de la compra, método de pago, total facturado y dirección
            de entrega.
          </p>
        </div>
      </div>
    </div>
  );
}
