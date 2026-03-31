import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <h2 className="logo">Estética</h2>

      {/* 👤 Usuario logueado */}
      <div className="user-info">
        <p><strong>{usuario?.nombre}</strong></p>
        <span>{usuario?.rol}</span>
      </div>

      <nav>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/usuarios">Usuarios</Link></li>
          <li><Link to="/turnos">Turnos</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
        </ul>
      </nav>

      {/* 🔓 Logout */}
      <button className="logout" onClick={handleLogout}>
        Cerrar sesión
      </button>

    </div>
  );
}

export default Sidebar;