import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, rolesPermitidos }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
};

export default ProtectedRoute;