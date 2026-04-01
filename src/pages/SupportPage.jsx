import { HelpCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { faqItems } from "../data/faq";

export default function SupportPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="page-card">
        <SectionHeader
          icon={HelpCircle}
          badge="Soporte"
          title="Preguntas frecuentes"
          subtitle="Dudas comunes y respuestas rápidas con una presentación más ordenada y legible."
        />
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="surface-muted p-4">
              <h3 className="font-semibold text-[color:var(--bb-text)]">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--bb-text-soft)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-card">
        <SectionHeader
          icon={Mail}
          badge="Contacto"
          title="Contacto y sugerencias"
          subtitle="Formulario simple para soporte al cliente y retroalimentación."
        />
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
          />
          <InputField
            label="Correo"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--bb-text)]">Mensaje</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Escribe tu consulta, sugerencia o comentario"
              rows={6}
              className="input-field"
            />
          </label>
          <button className="btn-primary w-full">Enviar mensaje</button>
          {sent ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Se registró correctamente la solicitud de soporte.
            </p>
          ) : null}
        </form>

        <div className="mt-6 grid gap-3 surface-muted p-5 text-sm text-[color:var(--bb-text-soft)]">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> +506 2222-1111
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> soporte@bellasboutique.com
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> San José, Costa Rica
          </div>
        </div>
      </div>
    </div>
  );
}
