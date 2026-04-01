import { Edit3, LayoutDashboard, Package, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import InputField from "../components/InputField";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";
import { currency } from "../utils";

const initialForm = {
  name: "",
  category: "Ropa",
  price: "",
  stock: "",
  image: "",
  description: "",
  provider: "",
};

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const submitLabel = editingId ? "Guardar cambios" : "Guardar producto";
  const sectionSubtitle = editingId
    ? "Edita la información del producto seleccionado y actualiza el inventario."
    : "Módulo administrativo para agregar nuevos productos al sistema.";

  const inventorySummary = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    ).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;
    return { totalProducts, lowStock, outOfStock };
  }, [products]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = editingId ? updateProduct(editingId, form) : addProduct(form);

    if (success) {
      setForm(initialForm);
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

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.name}" del catálogo?`,
    );

    if (confirmed) {
      deleteProduct(product.id);
      if (editingId === product.id) {
        cancelEdit();
      }
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="page-card">
        <SectionHeader
          icon={LayoutDashboard}
          badge="Administración"
          title={editingId ? "Editar producto" : "Registrar producto"}
          subtitle={sectionSubtitle}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre del producto"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre del producto"
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--bb-text)]">
              Categoría
            </span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              <option>Ropa</option>
              <option>Calzado</option>
              <option>Accesorios</option>
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Precio"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="19990"
            />
            <InputField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="10"
            />
          </div>

          <InputField
            label="Proveedor"
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            placeholder="Nombre del proveedor"
          />

          <InputField
            label="URL de imagen"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[color:var(--bb-text)]">
              Descripción
            </span>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Descripción del producto"
              className="input-field"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary flex-1">
              {editingId ? <Save className="h-4 w-4" /> : <Package className="h-4 w-4" />}
              {submitLabel}
            </button>

            {editingId ? (
              <button type="button" onClick={cancelEdit} className="btn-secondary flex-1">
                <X className="h-4 w-4" />
                Cancelar edición
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="page-card">
        <SectionHeader
          icon={Package}
          badge="Inventario"
          title="Productos activos"
          subtitle="Listado de productos visibles en la tienda con acciones de edición y eliminación dentro del mismo lenguaje visual."
        />

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="eyebrow">Productos</p>
            <p className="mt-3 text-3xl font-semibold text-[color:var(--bb-text)]">
              {inventorySummary.totalProducts}
            </p>
          </div>
          <div className="stat-card">
            <p className="eyebrow">Stock bajo</p>
            <p className="mt-3 text-3xl font-semibold text-amber-700 dark:text-amber-300">
              {inventorySummary.lowStock}
            </p>
          </div>
          <div className="stat-card">
            <p className="eyebrow">Agotados</p>
            <p className="mt-3 text-3xl font-semibold text-rose-700 dark:text-rose-300">
              {inventorySummary.outOfStock}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="surface-muted flex flex-col gap-4 p-4 md:flex-row md:items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-28 w-full rounded-[1.25rem] object-cover md:w-28"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[color:var(--bb-text)]">
                    {product.name}
                  </h3>
                  <span className="badge-soft">{product.category}</span>
                  {product.stock === 0 ? (
                    <span className="badge-soft !border-transparent !bg-rose-100 !text-rose-700 dark:!bg-rose-950/40 dark:!text-rose-300">
                      Agotado
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                  {product.provider}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[color:var(--bb-text-soft)]">
                  <span>{currency(product.price)}</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleEdit(product)} className="btn-secondary">
                  <Edit3 className="h-4 w-4" />
                  Editar
                </button>
                <button onClick={() => handleDelete(product)} className="btn-danger">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
