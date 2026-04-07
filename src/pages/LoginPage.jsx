import { KeyRound, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, recoverPassword } = useApp();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const response = login(form.email, form.password);

    if (!response.success) return;

    if (response.role === "admin" || response.role === "vendedor") {
      navigate("/admin");
      return;
    }

    navigate("/");
  };

  const handleRecovery = (event) => {
    event.preventDefault();

    const success = recoverPassword(recoveryEmail);

    if (success) {
      setRecoveryEmail("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="page-card">
        <SectionHeader
          icon={LogIn}
          badge="Acceso"
          title="Iniciar sesión"
          subtitle="Ingresa con tu correo y contraseña. El sistema identifica si eres cliente, vendedor o administrador y te redirige a la vista correspondiente."
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="correo@ejemplo.com"
          />

          <InputField
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="********"
          />

          <button type="submit" className="btn-primary w-full">
            Entrar al sistema
          </button>
        </form>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--bb-muted)] dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold text-[color:var(--bb-text)]">
            ¿Aún no tienes cuenta?
          </p>
          <p className="mt-2">
            Puedes crear tu cuenta como cliente desde el módulo de registro.
          </p>
          <Link
            to="/register"
            className="mt-3 inline-flex text-sm font-medium text-[color:var(--bb-accent)] hover:underline"
          >
            Ir a registro
          </Link>
        </div>
      </section>

      <aside className="page-card">
        <SectionHeader
          icon={KeyRound}
          badge="Recuperación"
          title="Recuperar contraseña"
          subtitle="Ingresa tu correo y el sistema generará una nueva contraseña temporal de forma simulada."
        />

        <form onSubmit={handleRecovery} className="space-y-5">
          <InputField
            label="Correo para recuperación"
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />

          <button type="submit" className="btn-secondary w-full">
            Generar nueva contraseña
          </button>
        </form>

        <div className="mt-5 text-sm text-[color:var(--bb-muted)]">
          <p>
            En esta versión académica, el correo se simula y queda registrado en
            el historial interno del sistema para demostrar el requerimiento.
          </p>
        </div>
      </aside>
    </div>
  );
}
