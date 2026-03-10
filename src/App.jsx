import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Gunakan HashRouter
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    // HashRouter tidak memerlukan basename secara eksplisit seperti BrowserRouter
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;