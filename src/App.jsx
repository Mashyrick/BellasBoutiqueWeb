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

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminPage />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
