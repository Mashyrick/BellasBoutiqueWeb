import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";

const initialForm = {
  userId: "",
  cedula: "",
  fullName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [form, setForm] = useState(initialForm);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = register(form);

    if (success) {
      setForm(initialForm);
      navigate("/login");
    }
  };

  return (
    <div className="mx-auto max-w-4xl page-card">
      <SectionHeader
        icon={UserPlus}
        badge="Registro de usuarios"
        title="Crear cuenta en Bellas Boutique"
        subtitle="Completa todos los campos obligatorios para registrarte como cliente. El sistema validará correo, teléfono, cédula y fortaleza de contraseña."
      />

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <InputField
          label="ID de usuario"
          value={form.userId}
          onChange={(e) => updateField("userId", e.target.value)}
          placeholder="Ejemplo: cliente001"
        />

        <InputField
          label="Cédula"
          value={form.cedula}
          onChange={(e) => updateField("cedula", e.target.value)}
          placeholder="Ejemplo: 123456789"
        />

        <InputField
          label="Nombre"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          placeholder="Ejemplo: María"
        />

        <InputField
          label="Apellidos"
          value={form.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          placeholder="Ejemplo: González Pérez"
        />

        <InputField
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="correo@ejemplo.com"
        />

        <InputField
          label="Teléfono"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="88888888"
        />

        <div className="md:col-span-2">
          <InputField
            label="Dirección"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Provincia, cantón, distrito y señas"
          />
        </div>

        <InputField
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />

        <InputField
          label="Confirmar contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          placeholder="Repite la contraseña"
        />

        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--bb-muted)] dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold text-[color:var(--bb-text)]">
            Requisitos de la contraseña
          </p>
          <p className="mt-2">
            Debe incluir al menos una letra mayúscula, una minúscula, un número,
            un carácter especial y tener 8 o más caracteres.
          </p>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn-primary w-full">
            Registrarme
          </button>
        </div>
      </form>
    </div>
  );
}
