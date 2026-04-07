import {
  BarChart3,
  ClipboardList,
  Edit3,
  LayoutDashboard,
  Mail,
  Package,
  Save,
  Shield,
  Trash2,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

const initialProductForm = {
  name: "",
  category: "Ropa",
  price: "",
  stock: "",
  image: "",
  description: "",
  provider: "",
};

export default function AdminPage() {
  const {
    currentUser,
    products,
    users,
    addProduct,
    updateProduct,
    deleteProduct,
    updateUserByAdmin,
    sales,
    salesSummary,
    reportSummary,
    generateDailyReport,
    monthlySalesReport,
    inventorySummary,
    activityLog,
    loginAttempts,
    supportTickets,
    satisfactionSurveys,
    simulatedEmails,
    dailyReports,
  } = useApp();

  const [form, setForm] = useState(initialProductForm);
  const [editingId, setEditingId] = useState(null);

  const isAdmin = currentUser?.role === "admin";
  const canManageProducts =
    currentUser && ["admin", "vendedor"].includes(currentUser.role);

  const handleSubmit = (event) => {
    event.preventDefault();

    const success = editingId
      ? updateProduct(editingId, form)
      : addProduct(form);

    if (success) {
      setForm(initialProductForm);
      setEditingId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      description: product.description,
      provider: product.provider,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialProductForm);
  };

  return (
    <div className="space-y-6">
      <div className="page-card">
        <SectionHeader
          icon={LayoutDashboard}
          badge="Administración"
          title="Panel administrativo Bellas Boutique"
          subtitle="Gestiona productos, usuarios, ventas, reportes, bitácora, soporte y trazabilidad general del sistema."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="surface-muted p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
              Productos
            </p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--bb-text)]">
              {inventorySummary.totalProducts}
            </p>
          </div>

          <div className="surface-muted p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
              Ventas registradas
            </p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--bb-text)]">
              {salesSummary.totalSales}
            </p>
          </div>

          <div className="surface-muted p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
              Ingresos acumulados
            </p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--bb-text)]">
              {currency(salesSummary.totalRevenue)}
            </p>
          </div>

          <div className="surface-muted p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--bb-text-soft)]">
              Stock bajo
            </p>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--bb-text)]">
              {inventorySummary.lowStock}
            </p>
          </div>
        </div>
      </div>

      {canManageProducts ? (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="page-card">
            <SectionHeader
              icon={Package}
              badge="Gestión de productos"
              title={editingId ? "Editar producto" : "Registrar producto"}
              subtitle={
                editingId
                  ? "Actualiza información, precio, proveedor, imagen y stock."
                  : "Administradores y vendedores pueden crear nuevos productos."
              }
            />

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nombre del producto"
              />

              <label className="block space-y-2">
                <span className="text-sm font-medium text-[color:var(--bb-text)]">
                  Categoría
                </span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="input-field"
                >
                  <option value="Ropa">Ropa</option>
                  <option value="Calzado">Calzado</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </label>

              <InputField
                label="Precio"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="19990"
              />

              <InputField
                label="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, stock: e.target.value }))
                }
                placeholder="10"
              />

              <InputField
                label="Proveedor"
                value={form.provider}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, provider: e.target.value }))
                }
                placeholder="Nombre del proveedor"
              />

              <InputField
                label="URL de la imagen"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://..."
              />

              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-[color:var(--bb-text)]">
                  Descripción
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Descripción del producto"
                  className="input-field"
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button type="submit" className="btn-primary">
                  {editingId ? (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4" />
                      Registrar producto
                    </>
                  )}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                  >
                    <X className="h-4 w-4" />
                    Cancelar edición
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="page-card">
            <SectionHeader
              icon={ClipboardList}
              badge="Inventario"
              title="Listado de productos"
              subtitle="Puedes modificar, actualizar stock o dar de baja productos."
            />

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="surface-muted flex flex-col gap-4 p-4 lg:flex-row lg:items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-full rounded-2xl object-cover lg:w-24"
                  />

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[color:var(--bb-text)]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                      {product.category} · {product.provider}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                      Stock: {product.stock} · Precio: {currency(product.price)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-secondary"
                    >
                      <Edit3 className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {isAdmin ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <section className="page-card">
            <SectionHeader
              icon={Users}
              badge="Usuarios"
              title="Mantenimiento de usuarios"
              subtitle="El administrador puede modificar el estado de las cuentas y asignar roles."
            />

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="surface-muted flex flex-col gap-4 p-4 md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[color:var(--bb-text)]">
                      {user.fullName} {user.lastName || ""}
                    </h3>
                    <p className="text-sm text-[color:var(--bb-text-soft)]">
                      {user.email}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                      Rol: {user.role} · Estado: {user.status || "activo"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUserByAdmin(user.id, { role: e.target.value })
                      }
                      className="input-field min-w-[150px]"
                    >
                      <option value="admin">Administrador</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="cliente">Cliente</option>
                    </select>

                    <select
                      value={user.status || "activo"}
                      onChange={(e) =>
                        updateUserByAdmin(user.id, { status: e.target.value })
                      }
                      className="input-field min-w-[150px]"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="page-card">
            <SectionHeader
              icon={BarChart3}
              badge="Reportes"
              title="Ventas y reportes del sistema"
              subtitle="Incluye ventas diarias, mensuales, ingresos y productos con stock bajo."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="surface-muted p-4">
                <p className="text-sm text-[color:var(--bb-text-soft)]">Hoy</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--bb-text)]">
                  {reportSummary.date}
                </p>
                <p className="mt-2 text-sm text-[color:var(--bb-text-soft)]">
                  Productos vendidos: {reportSummary.soldProducts}
                </p>
                <p className="text-sm text-[color:var(--bb-text-soft)]">
                  Ingresos: {currency(reportSummary.revenue)}
                </p>
              </div>

              <div className="surface-muted p-4">
                <p className="text-sm text-[color:var(--bb-text-soft)]">
                  Acumulado general
                </p>
                <p className="mt-2 text-sm text-[color:var(--bb-text-soft)]">
                  Unidades vendidas: {salesSummary.soldUnits}
                </p>
                <p className="text-sm text-[color:var(--bb-text-soft)]">
                  Ventas: {salesSummary.totalSales}
                </p>
                <p className="text-sm text-[color:var(--bb-text-soft)]">
                  Ingresos: {currency(salesSummary.totalRevenue)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={generateDailyReport} className="btn-primary">
                <BarChart3 className="h-4 w-4" />
                Generar reporte diario
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                  Reporte mensual
                </h3>
                <div className="space-y-3">
                  {monthlySalesReport.length ? (
                    monthlySalesReport.map((item) => (
                      <div
                        key={item.month}
                        className="surface-muted p-4 text-sm"
                      >
                        <p className="font-semibold text-[color:var(--bb-text)]">
                          {item.month}
                        </p>
                        <p className="text-[color:var(--bb-text-soft)]">
                          Productos vendidos: {item.soldProducts}
                        </p>
                        <p className="text-[color:var(--bb-text-soft)]">
                          Ingresos: {currency(item.revenue)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                      Aún no hay ventas mensuales registradas.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                  Reportes diarios generados
                </h3>
                <div className="space-y-3">
                  {dailyReports.length ? (
                    dailyReports.map((report) => (
                      <div
                        key={report.id}
                        className="surface-muted p-4 text-sm"
                      >
                        <p className="font-semibold text-[color:var(--bb-text)]">
                          {report.date}
                        </p>
                        <p className="text-[color:var(--bb-text-soft)]">
                          Productos vendidos: {report.soldProducts}
                        </p>
                        <p className="text-[color:var(--bb-text-soft)]">
                          Ingresos: {currency(report.revenue)}
                        </p>
                        <p className="text-[color:var(--bb-text-soft)]">
                          Productos con stock bajo:{" "}
                          {report.lowStockProducts.length}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                      Todavía no se ha generado ningún reporte diario.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="page-card">
          <SectionHeader
            icon={Shield}
            badge="Auditoría"
            title="Bitácora e intentos de inicio de sesión"
            subtitle="Registro de acciones del sistema, usuarios y administradores."
          />

          <div className="space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                Bitácora de actividades
              </h3>
              <div className="space-y-3">
                {activityLog.length ? (
                  activityLog.slice(0, 12).map((item) => (
                    <div key={item.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {item.action}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Usuario: {item.userName} · Rol: {item.userRole}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Fecha:{" "}
                        {new Date(item.createdAt).toLocaleString("es-CR")}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay actividades registradas todavía.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                Intentos de login
              </h3>
              <div className="space-y-3">
                {loginAttempts.length ? (
                  loginAttempts.slice(0, 10).map((attempt) => (
                    <div key={attempt.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {attempt.email || "Sin correo"}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Resultado: {attempt.success ? "Exitoso" : "Fallido"}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Motivo: {attempt.reason}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay intentos de inicio de sesión registrados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="page-card">
          <SectionHeader
            icon={UserCog}
            badge="Seguimiento"
            title="Soporte, encuestas y correos simulados"
            subtitle="Consolidado de soporte al cliente y trazabilidad del sistema."
          />

          <div className="space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                Sugerencias / soporte
              </h3>
              <div className="space-y-3">
                {supportTickets.length ? (
                  supportTickets.slice(0, 8).map((ticket) => (
                    <div key={ticket.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {ticket.name} · {ticket.email}
                      </p>
                      <p className="mt-1 text-[color:var(--bb-text-soft)]">
                        {ticket.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay solicitudes de soporte registradas.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                Encuestas de satisfacción
              </h3>
              <div className="space-y-3">
                {satisfactionSurveys.length ? (
                  satisfactionSurveys.slice(0, 8).map((survey) => (
                    <div key={survey.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {survey.userName} · Puntaje: {survey.score}/5
                      </p>
                      <p className="mt-1 text-[color:var(--bb-text-soft)]">
                        {survey.comment || "Sin comentario adicional"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay encuestas registradas todavía.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--bb-text)]">
                <Mail className="h-4 w-4" />
                Correos simulados
              </h3>
              <div className="space-y-3">
                {simulatedEmails.length ? (
                  simulatedEmails.slice(0, 8).map((email) => (
                    <div key={email.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {email.subject}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Para: {email.to}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay correos simulados generados todavía.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[color:var(--bb-text)]">
                Historial de ventas
              </h3>
              <div className="space-y-3">
                {sales.length ? (
                  sales.slice(0, 10).map((sale) => (
                    <div key={sale.id} className="surface-muted p-4 text-sm">
                      <p className="font-semibold text-[color:var(--bb-text)]">
                        {sale.productName}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Cliente: {sale.customerName}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Cantidad: {sale.quantity} · Unitario:{" "}
                        {currency(sale.unitPrice)}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Total línea: {currency(sale.lineTotal)}
                      </p>
                      <p className="text-[color:var(--bb-text-soft)]">
                        Fecha: {new Date(sale.date).toLocaleString("es-CR")}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="surface-muted p-4 text-sm text-[color:var(--bb-text-soft)]">
                    No hay ventas registradas todavía.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
