const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log("Authorization header:", authHeader); //debug

  // 1. Validar que exista y tenga formato correcto
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  // 2. Extraer token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Formato de token inválido" });
  }

  try {
    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Guardar usuario en request
    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
}

module.exports = verificarToken;