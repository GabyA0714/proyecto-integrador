import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Conectamos con el estado global del grupo

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const { user, token, loading } = useAuth();

  // 1. Si el contexto está cargando los datos del token, esperamos para no rebotar por error
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b21a8' }}>
        <h3>Verificando credenciales...</h3>
      </div>
    );
  }

  // 2. Si no hay token o no hay usuario logueado, directo al Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Obtenemos el rol del usuario (soportando tanto 'role' como 'rol' por las dudas)
  const userRol = user.role || user.rol || "";

  // 4. Si la ruta requiere roles específicos y el usuario no lo tiene, al rincón de No Autorizado
  if (rolesPermitidos && !rolesPermitidos.includes(userRol.toUpperCase())) {
    return <Navigate to="/no-autorizado" replace />;
  }

  // Si pasó todos los candados, lo dejamos pasar al componente (children)
  return children;
}