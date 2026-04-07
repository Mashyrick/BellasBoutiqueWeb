import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { cart, subtotal, tax, total, checkout, currentUser } = useApp();

  const [method, setMethod] = useState("tarjeta");

  const [form, setForm] = useState({
    cardNumber: "",
    cardName: "",
    sinpe: "",
    bankRef: "",
    address: currentUser?.address || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = checkout({
      method,
      ...form,
    });

    if (success) {
      navigate("/invoice");
    }
  };

  if (!cart.length) {
    return (
      <div className="page-card text-center">
        Tu carrito está vacío. Agrega productos antes de continuar.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="page-card">
        <SectionHeader
          icon={CreditCard}
          badge="Checkout"
          title="Proceso de pago"
          subtitle="Selecciona un método de pago, completa los datos y genera la factura."
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* MÉTODOS DE PAGO */}
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setMethod("tarjeta")}
              className={`btn-secondary ${
                method === "tarjeta" ? "ring-2 ring-black" : ""
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Tarjeta
            </button>

            <button
              type="button"
              onClick={() => setMethod("sinpe")}
              className={`btn-secondary ${
                method === "sinpe" ? "ring-2 ring-black" : ""
              }`}
            >
              <Smartphone className="h-4 w-4" />
              SINPE
            </button>

            <button
              type="button"
              onClick={() => setMethod("transferencia")}
              className={`btn-secondary ${
                method === "transferencia" ? "ring-2 ring-black" : ""
              }`}
            >
              <Landmark className="h-4 w-4" />
              Transferencia
            </button>
          </div>

          {/* FORMULARIOS SEGÚN MÉTODO */}
          {method === "tarjeta" && (
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Número de tarjeta"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cardNumber: e.target.value }))
                }
              />

              <InputField
                label="Nombre en tarjeta"
                value={form.cardName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cardName: e.target.value }))
                }
              />
            </div>
          )}

          {method === "sinpe" && (
            <InputField
              label="Número SINPE"
              value={form.sinpe}
              onChange={(e) =>
                setForm((p) => ({ ...p, sinpe: e.target.value }))
              }
            />
          )}

          {method === "transferencia" && (
            <InputField
              label="Número de referencia bancaria"
              value={form.bankRef}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankRef: e.target.value }))
              }
            />
          )}

          {/* DIRECCIÓN */}
          <InputField
            label="Dirección de entrega"
            value={form.address}
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
          />

          <button className="btn-primary w-full">
            Confirmar pago y generar factura
          </button>
        </form>
      </section>

      {/* RESUMEN */}
      <aside className="page-card">
        <SectionHeader
          icon={CreditCard}
          badge="Resumen"
          title="Detalle de pago"
          subtitle="Revisa el total antes de confirmar."
        />

        <div className="surface-muted p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <strong>{currency(subtotal)}</strong>
          </div>

          <div className="flex justify-between">
            <span>IVA (13%)</span>
            <strong>{currency(tax)}</strong>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <strong>{currency(total)}</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
