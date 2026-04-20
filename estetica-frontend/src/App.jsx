import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// páginas
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PacienteDashboard from "./pages/paciente/Dashboard";
import NoAutorizado from "./pages/NoAutorizado";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirigir la raíz al login para que no quede la pantalla en blanco */}
        <Route path="/" element={<Navigate to="/login" replace />} />

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

        {/* PACIENTE */}
        <Route
          path="/paciente"
          element={
            <ProtectedRoute rolesPermitidos={["PACIENTE"]}>
              <PacienteDashboard />
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