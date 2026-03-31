import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      login(data);

      // 🔥 REDIRECCIÓN POR ROL
      switch (data.usuario.rol) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "RECEPCIONISTA":
          navigate("/panel");
          break;
        case "TECNICO":
          navigate("/tecnico");
          break;
        case "CLIENTE":
          navigate("/cliente");
          break;
        default:
          navigate("/login");
      }
    } else {
      alert(data.mensaje);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;