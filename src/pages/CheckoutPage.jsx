import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutForm, setCheckoutForm, subtotal, tax, total, processCheckout } =
    useApp();

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = processCheckout();
    if (success) navigate("/invoice");
  };

  return (
    <div className="mx-auto max-w-4xl page-card">
      <SectionHeader
        icon={CreditCard}
        badge="Pago"
        title="Checkout y pago"
        subtitle="Simulación del proceso de pago con dirección de entrega, método y resumen financiero dentro del mismo sistema visual."
      />
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-[color:var(--bb-text)]">
            Método de pago
          </span>
          <select
            value={checkoutForm.method}
            onChange={(e) => setCheckoutForm({ ...checkoutForm, method: e.target.value })}
            className="input-field"
          >
            <option>Tarjeta</option>
            <option>SINPE</option>
            <option>Transferencia</option>
          </select>
        </label>
        <InputField
          label="Nombre del titular"
          value={checkoutForm.cardName}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, cardName: e.target.value })}
          placeholder="Nombre del titular"
        />
        <InputField
          label="Número de referencia / tarjeta"
          value={checkoutForm.cardNumber}
          onChange={(e) => setCheckoutForm({ ...checkoutForm, cardNumber: e.target.value })}
          placeholder="0000 0000 0000 0000"
        />
        <div className="md:col-span-2">
          <InputField
            label="Dirección de entrega"
            value={checkoutForm.deliveryAddress}
            onChange={(e) =>
              setCheckoutForm({ ...checkoutForm, deliveryAddress: e.target.value })
            }
            placeholder="Dirección completa"
          />
        </div>
        <div className="md:col-span-2 surface-muted grid gap-3 p-5 text-sm text-[color:var(--bb-text-soft)]">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <strong className="text-[color:var(--bb-text)]">{currency(subtotal)}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>IVA</span>
            <strong className="text-[color:var(--bb-text)]">{currency(tax)}</strong>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-[color:var(--bb-text)]">
            <span>Total</span>
            <strong>{currency(total)}</strong>
          </div>
        </div>
        <div className="md:col-span-2">
          <button className="btn-primary w-full">Confirmar compra</button>
        </div>
      </form>
    </div>
  );
}
