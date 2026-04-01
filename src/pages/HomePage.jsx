import {
  ArrowUpDown,
  Filter,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useApp } from "../context/AppContext";

const priceRanges = [
  { value: "all", label: "Todos los precios" },
  { value: "0-10000", label: "Hasta ₡10.000" },
  { value: "10000-25000", label: "₡10.000 a ₡25.000" },
  { value: "25000-50000", label: "₡25.000 a ₡50.000" },
  { value: "50000+", label: "Más de ₡50.000" },
];

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "stock-desc", label: "Más stock" },
];

const matchesPriceRange = (price, range) => {
  if (range === "all") return true;
  if (range === "50000+") return price >= 50000;

  const [min, max] = range.split("-").map(Number);
  return price >= min && price <= max;
};

export default function HomePage() {
  const { products, categories, addToCart } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const realCategories = categories.filter((item) => item !== "Todas");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearch("");
    setPriceRange("all");
    setAvailability("all");
    setSortBy("featured");
  };

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();

    const filtered = products.filter((product) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchSearch =
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.provider.toLowerCase().includes(term);

      const matchPrice = matchesPriceRange(product.price, priceRange);

      const matchAvailability =
        availability === "all" ||
        (availability === "in-stock" ? product.stock > 0 : product.stock === 0);

      return matchCategory && matchSearch && matchPrice && matchAvailability;
    });

    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "es"));
      case "stock-desc":
        return [...filtered].sort((a, b) => b.stock - a.stock);
      default:
        return filtered;
    }
  }, [products, selectedCategories, search, priceRange, availability, sortBy]);

  const activeFilterCount =
    selectedCategories.length +
    (priceRange !== "all" ? 1 : 0) +
    (availability !== "all" ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="page-section">
      <Hero />

      <section id="catalogo" className="page-section">
        <SectionHeader
          icon={Package}
          badge="Catálogo"
          title="Explora prendas, calzado y accesorios"
          subtitle="Bellas Boutique"
        />

        <div className="page-card space-y-5">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <label className="block space-y-2 xl:col-span-2">
              <span className="text-sm font-medium text-[color:var(--bb-text)]">
                Búsqueda
              </span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--bb-text-soft)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, descripción o proveedor"
                  className="input-field pl-11"
                />
              </div>
            </label>

            <div className="panel-soft p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[color:var(--bb-text)]">
                <Filter className="h-4 w-4" />
                Categorías
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {realCategories.map((category) => {
                  const active = selectedCategories.includes(category);

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`filter-chip justify-between ${
                        active ? "filter-chip-active" : ""
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          active
                            ? "bg-white dark:bg-[#1b1413]"
                            : "bg-[rgba(118,92,76,0.3)]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="panel-soft p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[color:var(--bb-text)]">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros avanzados
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <label className="space-y-2 text-sm text-[color:var(--bb-text)]">
                  <span className="font-medium">Rango de precio</span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="input-field"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm text-[color:var(--bb-text)]">
                  <span className="font-medium">Disponibilidad</span>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Todos</option>
                    <option value="in-stock">Solo con stock</option>
                    <option value="out-of-stock">Agotados</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm text-[color:var(--bb-text)] md:col-span-2 xl:col-span-1">
                  <span className="font-medium">Ordenar por</span>
                  <div className="relative">
                    <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--bb-text-soft)]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field pl-11"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="surface-muted flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-[color:var(--bb-text)]">
                {filteredProducts.length} producto
                {filteredProducts.length === 1 ? "" : "s"} encontrado
                {filteredProducts.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-[color:var(--bb-text-soft)]">
                {activeFilterCount === 0
                  ? "Sin filtros activos."
                  : `Filtros activos: ${activeFilterCount}`}
              </p>
            </div>

            <button onClick={clearFilters} className="btn-secondary">
              Limpiar filtros
            </button>
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="page-card text-center">
            <p className="text-lg font-semibold text-[color:var(--bb-text)]">
              No se encontraron productos con esos filtros.
            </p>
            <p className="mt-2 text-sm text-[color:var(--bb-text-soft)]">
              Prueba limpiando los filtros o cambiando la búsqueda.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
