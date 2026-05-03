
// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************

// **********************************************************
// creo que hay que borrar todo esto, no se usa en el backend
// **********************************************************



import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token || !usuario) {
    return <Navigate to="/login" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" />;
  }

  return children;
}