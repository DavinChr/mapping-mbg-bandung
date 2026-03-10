import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Simulasi cek login (nanti bisa diganti dengan token JWT dari API)
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isAuthenticated) {
    // Jika belum login, tendang balik ke halaman Home (atau Login)
    return <Navigate to="/" replace />;
  }

  return children;
}