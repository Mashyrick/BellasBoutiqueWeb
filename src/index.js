import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { initialProducts } from "../data/products";
import { initialUsers } from "../data/users";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  products: "bb_products",
  users: "bb_users",
  currentUser: "bb_current_user",
  cartsByUser: "bb_carts_by_user",
  invoice: "bb_invoice",
  theme: "bb_theme",
  loginAttempts: "bb_login_attempts",
  activityLog: "bb_activity_log",
  sales: "bb_sales",
  supportTickets: "bb_support_tickets",
  satisfactionSurveys: "bb_satisfaction_surveys",
  chatMessages: "bb_chat_messages",
  dailyReports: "bb_daily_reports",
  simulatedEmails: "bb_simulated_emails",
};

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

const getStoredValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeText = (value = "") => value.trim().replace(/\s+/g, " ");
const normalizeEmail = (value = "") => value.trim().toLowerCase();
const digitsOnly = (value = "") => value.replace(/\D/g, "");
const nowIso = () => new Date().toISOString();
const todayKey = () => new Date().toISOString().slice(0, 10);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const hashPassword = (value = "") => {
  try {
    return btoa(unescape(encodeURIComponent(value)));
  } catch {
    return value;
  }
};

const verifyPassword = (plainPassword = "", storedPassword = "") =>
  storedPassword === plainPassword ||
  storedPassword === hashPassword(plainPassword);

const buildPasswordFromUser = (user) => {
  if (!user) return user;

  const alreadyHashed =
    typeof user.password === "string" &&
    user.password === hashPassword(user.password) &&
    user.password !== "";

  if (alreadyHashed) return user;

  return {
    ...user,
    password: hashPassword(user.password || ""),
  };
};

const initialChatMessages = [
  {
    id: 1,
    senderRole: "vendedor",
    senderName: "Soporte Bellas Boutique",
    message:
      "¡Hola! Bienvenida al chat en línea. Te podemos ayudar con productos, pagos o entregas.",
    createdAt: nowIso(),
  },
];

const buildUsersSeed = (users) => users.map(buildPasswordFromUser);

export function AppProvider({ children }) {
  const [products, setProducts] = useState(() =>
    getStoredValue(STORAGE_KEYS.products, initialProducts),
  );

  const [users, setUsers] = useState(() =>
    buildUsersSeed(getStoredValue(STORAGE_KEYS.users, initialUsers)),
  );

  const [currentUser, setCurrentUser] = useState(() =>
    getStoredValue(STORAGE_KEYS.currentUser, null),
  );

  const [cartsByUser, setCartsByUser] = useState(() =>
    getStoredValue(STORAGE_KEYS.cartsByUser, {}),
  );

  const [invoice, setInvoice] = useState(() =>
    getStoredValue(STORAGE_KEYS.invoice, null),
  );

  const [toast, setToast] = useState(null);

  const [theme, setTheme] = useState(() =>
    getStoredValue(STORAGE_KEYS.theme, "light"),
  );

  const [loginAttempts, setLoginAttempts] = useState(() =>
    getStoredValue(STORAGE_KEYS.loginAttempts, []),
  );

  const [activityLog, setActivityLog] = useState(() =>
    getStoredValue(STORAGE_KEYS.activityLog, []),
  );

  const [sales, setSales] = useState(() =>
    getStoredValue(STORAGE_KEYS.sales, []),
  );

  const [supportTickets, setSupportTickets] = useState(() =>
    getStoredValue(STORAGE_KEYS.supportTickets, []),
  );

  const [satisfactionSurveys, setSatisfactionSurveys] = useState(() =>
    getStoredValue(STORAGE_KEYS.satisfactionSurveys, []),
  );

  const [chatMessages, setChatMessages] = useState(() =>
    getStoredValue(STORAGE_KEYS.chatMessages, initialChatMessages),
  );

  const [dailyReports, setDailyReports] = useState(() =>
    getStoredValue(STORAGE_KEYS.dailyReports, []),
  );

  const [simulatedEmails, setSimulatedEmails] = useState(() =>
    getStoredValue(STORAGE_KEYS.simulatedEmails, []),
  );

  const inactivityTimeoutRef = useRef(null);

  const userCartKey = currentUser ? String(currentUser.id) : "guest";
  const cart = cartsByUser[userCartKey] || [];

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

  const inventorySummary = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(
      (product) => product.stock > 0 && product.stock <= 5,
    );

    return {
      totalProducts,
      lowStock: lowStockProducts.length,
      outOfStock: products.filter((product) => product.stock === 0).length,
      lowStockProducts,
    };
  }, [products]);

  const salesSummary = useMemo(() => {
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.lineTotal, 0);
    const soldUnits = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    return {
      totalSales,
      totalRevenue,
      soldUnits,
    };
  }, [sales]);

  const reportSummary = useMemo(() => {
    const today = todayKey();
    const todaysSales = sales.filter(
      (sale) => sale.date.slice(0, 10) === today,
    );

    return {
      date: today,
      soldProducts: todaysSales.reduce((acc, sale) => acc + sale.quantity, 0),
      revenue: todaysSales.reduce((acc, sale) => acc + sale.lineTotal, 0),
      lowStockProducts: inventorySummary.lowStockProducts,
    };
  }, [sales, inventorySummary]);

  const monthlySalesReport = useMemo(() => {
    const grouped = sales.reduce((acc, sale) => {
      const month = sale.date.slice(0, 7);
      const bucket = acc[month] || {
        month,
        soldProducts: 0,
        revenue: 0,
      };

      bucket.soldProducts += sale.quantity;
      bucket.revenue += sale.lineTotal;
      acc[month] = bucket;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) =>
      b.month.localeCompare(a.month),
    );
  }, [sales]);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

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
    localStorage.setItem(STORAGE_KEYS.cartsByUser, JSON.stringify(cartsByUser));
  }, [cartsByUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.invoice, JSON.stringify(invoice));
  }, [invoice]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.loginAttempts,
      JSON.stringify(loginAttempts),
    );
  }, [loginAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activityLog, JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.supportTickets,
      JSON.stringify(supportTickets),
    );
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.satisfactionSurveys,
      JSON.stringify(satisfactionSurveys),
    );
  }, [satisfactionSurveys]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.chatMessages,
      JSON.stringify(chatMessages),
    );
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.dailyReports,
      JSON.stringify(dailyReports),
    );
  }, [dailyReports]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.simulatedEmails,
      JSON.stringify(simulatedEmails),
    );
  }, [simulatedEmails]);

  const notify = (message, type = "info") => {
    setToast({ message, type });
    window.clearTimeout(window.__bbToastTimeout);
    window.__bbToastTimeout = window.setTimeout(() => setToast(null), 2800);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addActivity = (action, details = {}) => {
    const entry = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      action,
      details,
      createdAt: nowIso(),
      userId: currentUser?.id || null,
      userName: currentUser?.fullName || "Sistema",
      userRole: currentUser?.role || "sistema",
    };

    setActivityLog((prev) => [entry, ...prev].slice(0, 250));
  };

  const sendSimulatedEmail = ({ to, subject, body }) => {
    const email = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      to,
      subject,
      body,
      sentAt: nowIso(),
    };

    setSimulatedEmails((prev) => [email, ...prev].slice(0, 100));
    return email;
  };

  const updateCartForCurrentUser = (updater) => {
    setCartsByUser((prev) => {
      const currentCart = prev[userCartKey] || [];
      const nextCart =
        typeof updater === "function" ? updater(currentCart) : updater;

      return {
        ...prev,
        [userCartKey]: nextCart,
      };
    });
  };

  const resetInactivityTimer = () => {
    if (!currentUser) return;

    window.clearTimeout(inactivityTimeoutRef.current);

    inactivityTimeoutRef.current = window.setTimeout(() => {
      addActivity("CIERRE_SESION_INACTIVIDAD", {
        reason: "Sesión cerrada tras 5 minutos de inactividad",
      });

      setCurrentUser(null);
      setInvoice(null);
      notify("Sesión cerrada por inactividad.", "warning");
    }, SESSION_TIMEOUT_MS);
  };

  useEffect(() => {
    if (!currentUser) {
      window.clearTimeout(inactivityTimeoutRef.current);
      return undefined;
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach((eventName) =>
      window.addEventListener(eventName, handleActivity),
    );

    resetInactivityTimer();

    return () => {
      window.clearTimeout(inactivityTimeoutRef.current);
      events.forEach((eventName) =>
        window.removeEventListener(eventName, handleActivity),
      );
    };
  }, [currentUser]);

  const recordLoginAttempt = ({
    email,
    success,
    userRole = null,
    reason = "",
  }) => {
    const attempt = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      email,
      success,
      userRole,
      reason,
      createdAt: nowIso(),
    };

    setLoginAttempts((prev) => [attempt, ...prev].slice(0, 100));
  };

  const login = (email, password) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      notify("Debes completar correo y contraseña.", "error");
      recordLoginAttempt({
        email: normalizedEmail,
        success: false,
        reason: "Campos incompletos",
      });
      return { success: false };
    }

    const found = users.find(
      (user) =>
        normalizeEmail(user.email) === normalizedEmail &&
        verifyPassword(normalizedPassword, user.password),
    );

    if (!found) {
      notify("Credenciales incorrectas.", "error");
      recordLoginAttempt({
        email: normalizedEmail,
        success: false,
        reason: "Credenciales inválidas",
      });
      return { success: false };
    }

    if ((found.status || "activo") !== "activo") {
      notify("Tu cuenta está inactiva. Contacta al administrador.", "error");
      recordLoginAttempt({
        email: normalizedEmail,
        success: false,
        reason: "Cuenta inactiva",
      });
      return { success: false };
    }

    setCurrentUser(found);
    recordLoginAttempt({
      email: normalizedEmail,
      success: true,
      userRole: found.role,
      reason: "Inicio de sesión correcto",
    });

    notify(`Bienvenido, ${found.fullName}.`, "success");
    addActivity("LOGIN_EXITOSO", {
      email: found.email,
      role: found.role,
    });

    return { success: true, role: found.role };
  };

  const logout = () => {
    if (currentUser) {
      addActivity("LOGOUT", {
        email: currentUser.email,
        role: currentUser.role,
      });
    }

    setCurrentUser(null);
    setInvoice(null);
    window.clearTimeout(inactivityTimeoutRef.current);
    notify("Sesión cerrada.", "info");
  };

  const recoverPassword = (email) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      notify("Debes ingresar el correo electrónico.", "error");
      return false;
    }

    const user = users.find(
      (item) => normalizeEmail(item.email) === normalizedEmail,
    );

    if (!user) {
      notify("No existe una cuenta con ese correo.", "error");
      return false;
    }

    const temporaryPassword = "Nueva123!";
    const temporaryHash = hashPassword(temporaryPassword);

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id ? { ...item, password: temporaryHash } : item,
      ),
    );

    sendSimulatedEmail({
      to: user.email,
      subject: "Recuperación de contraseña - Bellas Boutique",
      body: `Hola ${user.fullName}, tu nueva contraseña temporal es: ${temporaryPassword}`,
    });

    addActivity("RECUPERACION_CONTRASENA", {
      email: user.email,
    });

    notify(
      "Se generó una nueva contraseña temporal y se registró el correo de recuperación.",
      "success",
    );

    return true;
  };

  const register = (form) => {
    const userId = normalizeText(form.userId || "");
    const cedula = digitsOnly(form.cedula || "");
    const fullName = normalizeText(form.fullName || "");
    const lastName = normalizeText(form.lastName || "");
    const email = normalizeEmail(form.email || "");
    const phone = digitsOnly(form.phone || "");
    const address = normalizeText(form.address || "");
    const password = form.password || "";
    const confirmPassword = form.confirmPassword || "";

    if (
      !userId ||
      !cedula ||
      !fullName ||
      !lastName ||
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

    if (cedula.length < 9) {
      notify("La cédula debe tener al menos 9 dígitos.", "error");
      return false;
    }

    if (password !== confirmPassword) {
      notify("Las contraseñas no coinciden.", "error");
      return false;
    }

    if (!strongPasswordRegex.test(password)) {
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

    if (users.some((user) => String(user.userId || "") === userId)) {
      notify("Ese ID de usuario ya está registrado.", "error");
      return false;
    }

    const newUser = {
      id: Date.now(),
      userId,
      cedula,
      fullName,
      lastName,
      email,
      phone,
      address,
      password: hashPassword(password),
      role: "cliente",
      status: "activo",
      clientRecord: {
        registeredAt: nowIso(),
      },
    };

    setUsers((prev) => [...prev, newUser]);
    addActivity("REGISTRO_USUARIO", {
      email: newUser.email,
      role: newUser.role,
    });
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

    updateCartForCurrentUser((prev) => {
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

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          addedAt: nowIso(),
        },
      ];
    });

    if (stockReached) {
      notify("No puedes agregar más unidades de este producto.", "warning");
      return;
    }

    addActivity("AGREGAR_CARRITO", {
      productId: product.id,
      productName: product.name,
    });
    notify("Producto agregado al carrito.", "success");
  };

  const updateQuantity = (id, type) => {
    let stockReached = false;

    updateCartForCurrentUser((prev) =>
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
      notify(
        "Ya alcanzaste el stock disponible para este producto.",
        "warning",
      );
      return;
    }

    addActivity("ACTUALIZAR_CARRITO", {
      productId: id,
      operation: type,
    });
  };

  const clearCart = () => {
    if (!cart.length) {
      notify("El carrito ya está vacío.", "info");
      return false;
    }

    updateCartForCurrentUser([]);
    addActivity("VACIAR_CARRITO");
    notify("Carrito vaciado correctamente.", "info");
    return true;
  };

  const removeFromCart = (id) => {
    updateCartForCurrentUser((prev) => prev.filter((item) => item.id !== id));
    addActivity("ELIMINAR_DEL_CARRITO", { productId: id });
    notify("Producto eliminado del carrito.", "info");
  };

  const checkout = (paymentData) => {
    if (!currentUser || currentUser.role !== "cliente") {
      notify(
        "Debes iniciar sesión como cliente para finalizar la compra.",
        "error",
      );
      return false;
    }

    if (!cart.length) {
      notify("El carrito está vacío.", "warning");
      return false;
    }

    const method = normalizeText(paymentData?.method || "");

    if (!method) {
      notify("Debes seleccionar un método de pago.", "error");
      return false;
    }

    const address = normalizeText(
      paymentData?.address || currentUser.address || "",
    );

    if (!address) {
      notify("Debes indicar una dirección de entrega.", "error");
      return false;
    }

    if (method === "tarjeta") {
      const cardNumber = digitsOnly(paymentData?.cardNumber || "");
      const cardName = normalizeText(paymentData?.cardName || "");

      if (cardNumber.length < 12 || !cardName) {
        notify("Completa correctamente los datos de la tarjeta.", "error");
        return false;
      }
    }

    if (method === "sinpe") {
      const sinpe = digitsOnly(paymentData?.sinpe || "");
      if (sinpe.length < 8) {
        notify("Ingresa un número SINPE válido.", "error");
        return false;
      }
    }

    if (method === "transferencia") {
      const bankRef = normalizeText(paymentData?.bankRef || "");
      if (bankRef.length < 4) {
        notify("Ingresa una referencia bancaria válida.", "error");
        return false;
      }
    }

    const paymentMethodLabel =
      method === "tarjeta"
        ? "Tarjeta"
        : method === "sinpe"
          ? "SINPE"
          : "Transferencia";

    const paymentStatus = "Exitoso";
    const paymentDate = nowIso();
    const cartCreatedAt = cart[0]?.addedAt || nowIso();

    const invoiceData = {
      id: `FAC-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString("es-CR"),
      customer: `${currentUser.fullName} ${currentUser.lastName || ""}`.trim(),
      email: currentUser.email,
      method: paymentMethodLabel,
      paymentStatus,
      paymentDate,
      deliveryAddress: address,
      cartCreatedAt,
      userId: currentUser.id,
      items: cart.map((item) => ({
        ...item,
        purchaseDate: paymentDate,
      })),
      subtotal,
      tax,
      total,
    };

    const saleRows = cart.map((item) => ({
      id: `${Date.now()}-${item.id}`,
      invoiceId: invoiceData.id,
      userId: currentUser.id,
      customerName: invoiceData.customer,
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      lineTotal: item.price * item.quantity,
      date: paymentDate,
    }));

    setProducts((prev) =>
      prev.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id);
        if (!cartItem) return product;

        return {
          ...product,
          stock: Math.max(product.stock - cartItem.quantity, 0),
        };
      }),
    );

    setSales((prev) => [...saleRows, ...prev]);
    setInvoice(invoiceData);
    updateCartForCurrentUser([]);

    sendSimulatedEmail({
      to: currentUser.email,
      subject: `Confirmación de compra ${invoiceData.id}`,
      body: `Tu compra fue procesada correctamente. Total: ₡${invoiceData.total}. Dirección de entrega: ${address}`,
    });

    addActivity("COMPRA_REALIZADA", {
      invoiceId: invoiceData.id,
      total: invoiceData.total,
      method: invoiceData.method,
    });

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
      notify(
        "El stock debe ser un número entero igual o mayor que 0.",
        "error",
      );
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
    if (!currentUser || !["admin", "vendedor"].includes(currentUser.role)) {
      notify("No tienes permisos para registrar productos.", "error");
      return false;
    }

    const parsed = validateProductForm(form);
    if (!parsed) return false;

    const newProduct = {
      id: Date.now(),
      ...parsed,
      status: "activo",
    };

    setProducts((prev) => [newProduct, ...prev]);
    addActivity("ALTA_PRODUCTO", {
      productName: newProduct.name,
    });
    notify("Producto agregado al catálogo.", "success");
    return true;
  };

  const updateProduct = (id, form) => {
    if (!currentUser || !["admin", "vendedor"].includes(currentUser.role)) {
      notify("No tienes permisos para actualizar productos.", "error");
      return false;
    }

    const parsed = validateProductForm(form);
    if (!parsed) return false;

    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...parsed } : product,
      ),
    );

    setCartsByUser((prev) => {
      const next = { ...prev };

      Object.keys(next).forEach((cartOwnerKey) => {
        next[cartOwnerKey] = (next[cartOwnerKey] || []).map((item) =>
          item.id === id
            ? {
                ...item,
                ...parsed,
                quantity: Math.min(item.quantity, parsed.stock),
              }
            : item,
        );
      });

      return next;
    });

    addActivity("MODIFICACION_PRODUCTO", {
      productId: id,
      productName: parsed.name,
    });
    notify("Producto actualizado correctamente.", "success");
    return true;
  };

  const deleteProduct = (id) => {
    if (!currentUser || !["admin", "vendedor"].includes(currentUser.role)) {
      notify("No tienes permisos para dar de baja productos.", "error");
      return false;
    }

    setProducts((prev) => prev.filter((product) => product.id !== id));

    setCartsByUser((prev) => {
      const next = { ...prev };

      Object.keys(next).forEach((cartOwnerKey) => {
        next[cartOwnerKey] = (next[cartOwnerKey] || []).filter(
          (item) => item.id !== id,
        );
      });

      return next;
    });

    addActivity("BAJA_PRODUCTO", { productId: id });
    notify("Producto eliminado.", "info");
    return true;
  };

  const updateOwnProfile = (form) => {
    if (!currentUser) {
      notify("Debes iniciar sesión.", "error");
      return false;
    }

    const fullName = normalizeText(form.fullName || "");
    const lastName = normalizeText(form.lastName || "");
    const phone = digitsOnly(form.phone || "");
    const address = normalizeText(form.address || "");

    if (!fullName || !lastName || !phone || !address) {
      notify("Completa todos los campos del perfil.", "error");
      return false;
    }

    if (phone.length < 8) {
      notify("El teléfono debe tener al menos 8 dígitos.", "error");
      return false;
    }

    const updatedUser = {
      ...currentUser,
      fullName,
      lastName,
      phone,
      address,
    };

    setUsers((prev) =>
      prev.map((user) => (user.id === currentUser.id ? updatedUser : user)),
    );
    setCurrentUser(updatedUser);

    addActivity("MODIFICACION_PERFIL", {
      email: updatedUser.email,
    });

    notify("Perfil actualizado correctamente.", "success");
    return true;
  };

  const updateUserByAdmin = (id, changes) => {
    if (!currentUser || currentUser.role !== "admin") {
      notify("Solo un administrador puede modificar usuarios.", "error");
      return false;
    }

    const target = users.find((user) => user.id === id);

    if (!target) {
      notify("Usuario no encontrado.", "error");
      return false;
    }

    const updatedUser = {
      ...target,
      role: changes.role || target.role,
      status: changes.status || target.status || "activo",
    };

    setUsers((prev) =>
      prev.map((user) => (user.id === id ? updatedUser : user)),
    );

    if (currentUser.id === id) {
      setCurrentUser(updatedUser);
    }

    addActivity("ADMIN_MODIFICA_USUARIO", {
      targetEmail: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    });

    notify("Usuario actualizado correctamente.", "success");
    return true;
  };

  const createSupportTicket = (form) => {
    const name = normalizeText(form.name || "");
    const email = normalizeEmail(form.email || "");
    const message = normalizeText(form.message || "");

    if (!name || !email || !message) {
      notify("Completa todos los campos del formulario de soporte.", "error");
      return false;
    }

    if (!emailRegex.test(email)) {
      notify("Ingresa un correo válido en soporte.", "error");
      return false;
    }

    const ticket = {
      id: Date.now(),
      userId: currentUser?.id || null,
      name,
      email,
      message,
      createdAt: nowIso(),
      type: "sugerencia",
    };

    setSupportTickets((prev) => [ticket, ...prev].slice(0, 100));
    addActivity("SOPORTE_ENVIADO", { email });
    notify("Se registró correctamente la solicitud de soporte.", "success");
    return true;
  };

  const submitSatisfactionSurvey = (form) => {
    const score = Number(form.score);
    const comment = normalizeText(form.comment || "");

    if (!score || score < 1 || score > 5) {
      notify("La encuesta debe tener un puntaje entre 1 y 5.", "error");
      return false;
    }

    const survey = {
      id: Date.now(),
      userId: currentUser?.id || null,
      userName: currentUser?.fullName || "Cliente invitado",
      score,
      comment,
      createdAt: nowIso(),
    };

    setSatisfactionSurveys((prev) => [survey, ...prev].slice(0, 100));
    addActivity("ENCUESTA_SATISFACCION", { score });
    notify("Encuesta enviada correctamente.", "success");
    return true;
  };

  const sendChatMessage = (message, senderRole = "cliente") => {
    const cleanMessage = normalizeText(message || "");

    if (!cleanMessage) {
      notify("Escribe un mensaje antes de enviarlo.", "error");
      return false;
    }

    const chatEntry = {
      id: Date.now(),
      senderRole,
      senderName:
        senderRole === "vendedor"
          ? "Soporte Bellas Boutique"
          : currentUser?.fullName || "Cliente",
      message: cleanMessage,
      createdAt: nowIso(),
    };

    setChatMessages((prev) => [...prev, chatEntry].slice(-100));
    addActivity("MENSAJE_CHAT", { senderRole });
    return true;
  };

  const createAutomatedVendorReply = () => {
    const reply = {
      id: Date.now() + 1,
      senderRole: "vendedor",
      senderName: "Soporte Bellas Boutique",
      message:
        "Gracias por tu mensaje. Un vendedor revisará tu consulta y te ayudará lo antes posible.",
      createdAt: nowIso(),
    };

    setChatMessages((prev) => [...prev, reply].slice(-100));
  };

  const generateDailyReport = () => {
    const report = {
      id: Date.now(),
      createdAt: nowIso(),
      date: reportSummary.date,
      soldProducts: reportSummary.soldProducts,
      revenue: reportSummary.revenue,
      lowStockProducts: reportSummary.lowStockProducts,
    };

    setDailyReports((prev) => [report, ...prev].slice(0, 60));
    addActivity("REPORTE_DIARIO_GENERADO", {
      date: report.date,
      revenue: report.revenue,
    });
    notify("Reporte diario generado correctamente.", "success");
    return report;
  };

  const value = {
    products,
    users,
    currentUser,
    cart,
    cartsByUser,
    invoice,
    toast,
    categories,
    cartCount,
    subtotal,
    tax,
    total,
    theme,
    toggleTheme,
    login,
    logout,
    recoverPassword,
    register,
    addToCart,
    updateQuantity,
    clearCart,
    removeFromCart,
    checkout,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOwnProfile,
    updateUserByAdmin,
    notify,
    loginAttempts,
    activityLog,
    sales,
    salesSummary,
    reportSummary,
    generateDailyReport,
    monthlySalesReport,
    inventorySummary,
    supportTickets,
    createSupportTicket,
    satisfactionSurveys,
    submitSatisfactionSurvey,
    chatMessages,
    sendChatMessage,
    createAutomatedVendorReply,
    simulatedEmails,
    dailyReports,
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
