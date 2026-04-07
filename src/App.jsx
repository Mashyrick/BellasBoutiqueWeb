import { Navigate, Route, Routes } from "react-router-dom";
import BackgroundEffects from "./components/BackgroundEffects";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import { useApp } from "./context/AppContext";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import InvoicePage from "./pages/InvoicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SupportPage from "./pages/SupportPage";

function ProtectedAdminRoute({ children }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!["admin", "vendedor"].includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedClientRoute({ children }) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "cliente") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function ProtectedInvoiceRoute({ children }) {
  const { currentUser, invoice } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!invoice) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <BackgroundEffects />

      <div className="relative z-10 min-h-screen">
        <Navbar />
        <Toast />

        <main className="container-page pb-14 pt-8 sm:pt-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/support" element={<SupportPage />} />

            <Route
              path="/cart"
              element={
                <ProtectedClientRoute>
                  <CartPage />
                </ProtectedClientRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedClientRoute>
                  <CheckoutPage />
                </ProtectedClientRoute>
              }
            />

            <Route
              path="/invoice"
              element={
                <ProtectedInvoiceRoute>
                  <InvoicePage />
                </ProtectedInvoiceRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
