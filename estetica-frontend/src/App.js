import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// páginas
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ClienteDashboard from "./pages/cliente/Dashboard";
import NoAutorizado from "./pages/NoAutorizado";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* pública */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolesPermitidos={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CLIENTE */}
        <Route
          path="/cliente"
          element={
            <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="/no-autorizado" element={<NoAutorizado />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;