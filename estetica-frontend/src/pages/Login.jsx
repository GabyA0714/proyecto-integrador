import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const manejarIngreso = async (e) => {
    e.preventDefault(); // Evita que la página se recargue al tocar el botón
    setError(""); // Limpiamos errores previos

    try {
      // Acá hacemos la llamada a tu backend de Node.js
      // Corregimos la ruta agregando /auth para que coincida con tu app.js
      const respuesta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Si el backend tira error (ej: clave incorrecta), lo atajamos acá
        throw new Error(datos.mensaje || "Error al iniciar sesión. Revisá tus credenciales.");
      }

      // Si todo sale bien, guardamos la info en localStorage
      if (datos.token) {
        localStorage.setItem("token", datos.token); // Guardamos el JWT
      }
      localStorage.setItem("usuario", JSON.stringify(datos.usuario)); 

      // Evaluamos el rol para saber a qué dashboard mandarlo
      if (datos.usuario.rol === "ADMIN") {
        navigate("/admin");
      } else if (datos.usuario.rol === "PACIENTE") {
        navigate("/paciente");
      } else {
        navigate("/no-autorizado");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h2>Ingreso al Sistema</h2>
      
      {/* Mostramos el cartel de error si falla el login */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={manejarIngreso} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '8px 16px', backgroundColor: 'purple', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;