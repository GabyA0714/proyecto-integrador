import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // 1. Verificar que exista header
    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    // 2. Validar formato Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Formato de token inválido" });
    }

    // 3. Extraer token
    const token = authHeader.split(" ")[1];

    // 4. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Guardar datos en request (con los nombres exactos que usamos en auth.controller)
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();

  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default verificarToken;