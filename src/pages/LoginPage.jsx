import { LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const response = login(form.email, form.password);
    if (response.success) {
      navigate(response.role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="mx-auto max-w-xl page-card">
      <SectionHeader
        icon={LogIn}
        badge="Acceso"
        title="Iniciar sesión"
        subtitle="Diseño más limpio y centrado en la tarea principal: entrar rápido, entender el formulario y avanzar sin ruido visual."
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="correo@ejemplo.com"
        />
        <InputField
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="********"
        />
        <button className="btn-primary w-full">Entrar al sistema</button>
      </form>
    </div>
  );
}
