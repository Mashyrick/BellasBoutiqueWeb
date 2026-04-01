import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";

const initialForm = {
  fullName: "",
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = register(form);
    if (success) {
      setForm(initialForm);
      navigate("/login");
    }
  };

  return (
    <div className="mx-auto max-w-3xl page-card">
      <SectionHeader
        icon={User}
        badge="Cuenta cliente"
        title="Crear cuenta"
        subtitle="Unifiqué el formulario con el mismo sistema de superficies, espaciado y contraste usado en el resto del proyecto."
      />
      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <InputField
          label="Nombre completo"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Nombre y apellidos"
        />
        <InputField
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="correo@ejemplo.com"
        />
        <InputField
          label="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="8888-8888"
        />
        <InputField
          label="Dirección"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Provincia, cantón y distrito"
        />
        <InputField
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Debe incluir mayúscula, número y símbolo"
        />
        <InputField
          label="Confirmar contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Repite la contraseña"
        />
        <div className="md:col-span-2">
          <button className="btn-primary w-full">Registrarme</button>
        </div>
      </form>
    </div>
  );
}
