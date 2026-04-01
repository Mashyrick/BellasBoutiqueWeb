import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialProducts } from "../data/products";
import { initialUsers } from "../data/users";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  products: "bb_products",
  users: "bb_users",
  currentUser: "bb_current_user",
  cart: "bb_cart",
  invoice: "bb_invoice",
  theme: "bb_theme",
};

const defaultCheckoutForm = {
  method: "Tarjeta",
  deliveryAddress: "",
  cardName: "",
  cardNumber: "",
};

const getStoredValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeText = (value) => value.trim().replace(/\s+/g, " ");
const normalizeEmail = (value) => value.trim().toLowerCase();
const digitsOnly = (value) => value.replace(/\D/g, "");

export function AppProvider({ children }) {
  const [products, setProducts] = useState(() =>
    getStoredValue(STORAGE_KEYS.products, initialProducts),
  );
  const [users, setUsers] = useState(() =>
    getStoredValue(STORAGE_KEYS.users, initialUsers),
  );
  const [currentUser, setCurrentUser] = useState(() =>
    getStoredValue(STORAGE_KEYS.currentUser, null),
  );
  const [cart, setCart] = useState(() => getStoredValue(STORAGE_KEYS.cart, []));
  const [invoice, setInvoice] = useState(() =>
    getStoredValue(STORAGE_KEYS.invoice, null),
  );
  const [toast, setToast] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState(defaultCheckoutForm);
  const [theme, setTheme] = useState(() =>
    getStoredValue(STORAGE_KEYS.theme, "light"),
  );

  const categories = useMemo(
    () => ["Todas", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + tax;

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.invoice, JSON.stringify(invoice));
  }, [invoice]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const notify = (message, type = "info") => {
    setToast({ message, type });
    window.clearTimeout(window.__toastTimeout);
    window.__toastTimeout = window.setTimeout(() => setToast(null), 2500);
  };

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      notify("Debes completar correo y contraseña.", "error");
      return { success: false };
    }

    const found = users.find(
      (user) =>
        normalizeEmail(user.email) === normalizedEmail &&
        user.password === normalizedPassword,
    );

    if (!found) {
      notify("Credenciales incorrectas.", "error");
      return { success: false };
    }

    setCurrentUser(found);
    notify(`Bienvenido, ${found.fullName}.`, "success");
    return { success: true, role: found.role };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setInvoice(null);
    notify("Sesión cerrada.", "info");
  };

  const register = (form) => {
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fullName = normalizeText(form.fullName || "");
    const email = normalizeEmail(form.email || "");
    const phone = digitsOnly(form.phone || "");
    const address = normalizeText(form.address || "");
    const password = form.password || "";
    const confirmPassword = form.confirmPassword || "";

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      notify("Completa todos los campos obligatorios.", "error");
      return false;
    }

    if (!emailRegex.test(email)) {
      notify("Ingresa un correo electrónico válido.", "error");
      return false;
    }

    if (phone.length < 8) {
      notify("El teléfono debe tener al menos 8 dígitos.", "error");
      return false;
    }

    if (password !== confirmPassword) {
      notify("Las contraseñas no coinciden.", "error");
      return false;
    }

    if (!strongPassword.test(password)) {
      notify(
        "La contraseña debe incluir mayúscula, minúscula, número y carácter especial.",
        "error",
      );
      return false;
    }

    if (users.some((user) => normalizeEmail(user.email) === email)) {
      notify("Ese correo ya está registrado.", "error");
      return false;
    }

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      phone,
      address,
      password,
      role: "cliente",
    };

    setUsers((prev) => [...prev, newUser]);
    notify("Registro completado. Ahora puedes iniciar sesión.", "success");
    return true;
  };

  const addToCart = (product) => {
    if (!currentUser || currentUser.role !== "cliente") {
      notify("Debes iniciar sesión como cliente para comprar.", "error");
      return;
    }

    if (product.stock <= 0) {
      notify("Este producto está agotado.", "warning");
      return;
    }

    let stockReached = false;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          stockReached = true;
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    if (stockReached) {
      notify("No puedes agregar más unidades de este producto.", "warning");
      return;
    }

    notify("Producto agregado al carrito.", "success");
  };

  const updateQuantity = (id, type) => {
    let stockReached = false;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          if (type === "inc") {
            if (item.quantity >= item.stock) {
              stockReached = true;
              return item;
            }

            return { ...item, quantity: item.quantity + 1 };
          }

          if (type === "dec") {
            return { ...item, quantity: item.quantity - 1 };
          }

          return item;
        })
        .filter((item) => item.quantity > 0),
    );

    if (stockReached) {
      notify("Ya alcanzaste el stock disponible para este producto.", "warning");
    }
  };

  const clearCart = () => {
    if (!cart.length) {
      notify("El carrito ya está vacío.", "info");
      return false;
    }

    setCart([]);
    notify("Carrito vaciado correctamente.", "info");
    return true;
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    notify("Producto eliminado del carrito.", "info");
  };

  const processCheckout = () => {
    const deliveryAddress = normalizeText(checkoutForm.deliveryAddress || "");
    const cardName = normalizeText(checkoutForm.cardName || "");
    const cardNumber = digitsOnly(checkoutForm.cardNumber || "");

    if (!cart.length) {
      notify("El carrito está vacío.", "warning");
      return false;
    }

    if (!deliveryAddress) {
      notify("Debes indicar una dirección de entrega.", "error");
      return false;
    }

    if (!cardName) {
      notify("Debes indicar el nombre del titular.", "error");
      return false;
    }

    if (cardNumber.length < 8) {
      notify("Debes ingresar un número de tarjeta o referencia válido.", "error");
      return false;
    }

    const invoiceData = {
      id: `FAC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("es-CR"),
      customer: currentUser?.fullName || "Cliente",
      email: currentUser?.email || "",
      method: checkoutForm.method,
      deliveryAddress,
      items: cart,
      subtotal,
      tax,
      total,
    };

    setInvoice(invoiceData);
    setCart([]);
    setCheckoutForm(defaultCheckoutForm);
    notify("Pago procesado correctamente.", "success");
    return true;
  };

  const validateProductForm = (form) => {
    const name = normalizeText(form.name || "");
    const category = normalizeText(form.category || "");
    const price = Number(form.price);
    const stock = Number(form.stock);
    const image = normalizeText(form.image || "");
    const description = normalizeText(form.description || "");
    const provider = normalizeText(form.provider || "");

    if (!name || !category || !image || !description || !provider) {
      notify("Completa todos los campos del producto.", "error");
      return null;
    }

    if (!Number.isFinite(price) || price <= 0) {
      notify("El precio debe ser mayor que 0.", "error");
      return null;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      notify("El stock debe ser un número entero igual o mayor que 0.", "error");
      return null;
    }

    return {
      name,
      category,
      price,
      stock,
      image,
      description,
      provider,
    };
  };

  const addProduct = (form) => {
    const parsed = validateProductForm(form);
    if (!parsed) return false;

    const newProduct = {
      id: Date.now(),
      ...parsed,
    };

    setProducts((prev) => [newProduct, ...prev]);
    notify("Producto agregado al catálogo.", "success");
    return true;
  };

  const updateProduct = (id, form) => {
    const parsed = validateProductForm(form);
    if (!parsed) return false;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...parsed } : product,
      ),
    );

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...parsed,
              quantity: Math.min(item.quantity, parsed.stock),
            }
          : item,
      ),
    );

    notify("Producto actualizado correctamente.", "success");
    return true;
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
    notify("Producto eliminado.", "info");
  };

  const value = {
    products,
    users,
    currentUser,
    cart,
    invoice,
    toast,
    categories,
    cartCount,
    subtotal,
    tax,
    total,
    checkoutForm,
    setCheckoutForm,
    login,
    logout,
    register,
    addToCart,
    updateQuantity,
    clearCart,
    removeFromCart,
    processCheckout,
    addProduct,
    updateProduct,
    deleteProduct,
    theme,
    toggleTheme,
    notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de AppProvider");
  }
  return context;
}
