import {
  HelpCircle,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { faqItems } from "../data/faq";

const initialSupportForm = {
  name: "",
  email: "",
  message: "",
};

const initialSurveyForm = {
  score: 5,
  comment: "",
};

export default function SupportPage() {
  const {
    currentUser,
    createSupportTicket,
    submitSatisfactionSurvey,
    chatMessages,
    sendChatMessage,
    createAutomatedVendorReply,
  } = useApp();

  const [supportForm, setSupportForm] = useState(() => ({
    ...initialSupportForm,
    name: currentUser?.fullName || "",
    email: currentUser?.email || "",
  }));

  const [surveyForm, setSurveyForm] = useState(initialSurveyForm);
  const [chatText, setChatText] = useState("");

  const welcomeText = useMemo(() => {
    if (!currentUser) {
      return "Puedes usar el soporte como visitante, pero si inicias sesión la experiencia queda asociada a tu usuario.";
    }

    return `Sesión activa como ${currentUser.role}. Tus solicitudes de soporte pueden quedar asociadas a tu perfil.`;
  }, [currentUser]);

  const handleSupportSubmit = (event) => {
    event.preventDefault();

    const success = createSupportTicket(supportForm);

    if (success) {
      setSupportForm({
        name: currentUser?.fullName || "",
        email: currentUser?.email || "",
        message: "",
      });
    }
  };

  const handleSurveySubmit = (event) => {
    event.preventDefault();

    const success = submitSatisfactionSurvey(surveyForm);

    if (success) {
      setSurveyForm(initialSurveyForm);
    }
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();

    const success = sendChatMessage(chatText, "cliente");

    if (success) {
      setChatText("");
      window.setTimeout(() => {
        createAutomatedVendorReply();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-card">
        <SectionHeader
          icon={HelpCircle}
          badge="Soporte al cliente"
          title="Centro de ayuda Bellas Boutique"
          subtitle="Incluye preguntas frecuentes, sugerencias, encuesta de satisfacción y chat en línea simulado."
        />

        <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
          {welcomeText}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="page-card">
          <SectionHeader
            icon={HelpCircle}
            badge="FAQ"
            title="Preguntas frecuentes"
            subtitle="Dudas comunes que los usuarios pueden consultar rápidamente."
          />

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="surface-muted p-4">
                <h3 className="font-semibold text-[color:var(--bb-text)]">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--bb-text-soft)]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="page-card">
            <SectionHeader
              icon={Mail}
              badge="Sugerencias"
              title="Formulario de contacto"
              subtitle="Los usuarios pueden enviar dudas, sugerencias o comentarios al administrador."
            />

            <form onSubmit={handleSupportSubmit} className="space-y-5">
              <InputField
                label="Nombre"
                value={supportForm.name}
                onChange={(e) =>
                  setSupportForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Tu nombre"
              />

              <InputField
                label="Correo"
                type="email"
                value={supportForm.email}
                onChange={(e) =>
                  setSupportForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="correo@ejemplo.com"
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[color:var(--bb-text)]">
                  Mensaje
                </span>
                <textarea
                  value={supportForm.message}
                  onChange={(e) =>
                    setSupportForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Escribe tu consulta, sugerencia o comentario"
                  rows={5}
                  className="input-field"
                />
              </label>

              <button className="btn-primary w-full">Enviar sugerencia</button>
            </form>
          </div>

          <div className="page-card">
            <SectionHeader
              icon={Star}
              badge="Encuesta"
              title="Encuesta de satisfacción"
              subtitle="Permite valorar la experiencia del usuario con puntaje del 1 al 5 y comentarios."
            />

            <form onSubmit={handleSurveySubmit} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[color:var(--bb-text)]">
                  Puntaje
                </span>
                <select
                  value={surveyForm.score}
                  onChange={(e) =>
                    setSurveyForm((prev) => ({
                      ...prev,
                      score: Number(e.target.value),
                    }))
                  }
                  className="input-field"
                >
                  <option value={1}>1 - Muy mala</option>
                  <option value={2}>2 - Mala</option>
                  <option value={3}>3 - Regular</option>
                  <option value={4}>4 - Buena</option>
                  <option value={5}>5 - Excelente</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[color:var(--bb-text)]">
                  Comentarios
                </span>
                <textarea
                  value={surveyForm.comment}
                  onChange={(e) =>
                    setSurveyForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Cuéntanos cómo fue tu experiencia"
                  rows={4}
                  className="input-field"
                />
              </label>

              <button className="btn-secondary w-full">Enviar encuesta</button>
            </form>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="page-card">
          <SectionHeader
            icon={MessageCircleMore}
            badge="Chat"
            title="Chat en línea"
            subtitle="Simulación de conversación entre cliente y vendedor."
          />

          <div className="mb-5 max-h-[360px] space-y-3 overflow-y-auto rounded-3xl border border-[rgba(118,92,76,0.14)] bg-white/45 p-4 dark:bg-white/[0.03]">
            {chatMessages.map((message) => {
              const isVendor = message.senderRole === "vendedor";

              return (
                <div
                  key={message.id}
                  className={`flex ${isVendor ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={[
                      "max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow-sm",
                      isVendor
                        ? "bg-[rgba(42,29,28,0.92)] text-white"
                        : "bg-[rgba(196,170,152,0.22)] text-[color:var(--bb-text)] dark:bg-white/[0.07]",
                    ].join(" ")}
                  >
                    <p className="mb-1 text-xs font-semibold opacity-80">
                      {message.senderName}
                    </p>
                    <p>{message.message}</p>
                    <p className="mt-2 text-[11px] opacity-70">
                      {new Date(message.createdAt).toLocaleString("es-CR")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleChatSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              Enviar
            </button>
          </form>
        </section>

        <aside className="page-card">
          <SectionHeader
            icon={Mail}
            badge="Contacto"
            title="Información de atención"
            subtitle="Datos de referencia para el módulo de soporte."
          />

          <div className="grid gap-3 surface-muted p-5 text-sm text-[color:var(--bb-text-soft)]">
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

          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-[color:var(--bb-text-soft)] dark:border-white/10 dark:bg-white/5">
            Este módulo cubre tres requerimientos del enunciado: preguntas
            frecuentes, sugerencias al administrador y chat en línea.
          </div>
        </aside>
      </div>
    </div>
  );
}
