import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    // Tambahkan basename sesuai nama repositori GitHub Anda
    <Router basename="/mapping-mbg-bandung">
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Rute Admin sekarang diproteksi */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;