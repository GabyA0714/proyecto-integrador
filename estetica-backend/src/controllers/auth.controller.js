const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================
// VALIDACIONES
// =========================
const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

const validarPassword = (password) => {
  return password.length >= 6;
};

// =========================
// REGISTER (solo CLIENTE)
// =========================
const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    // 1. Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ mensaje: "Email inválido" });
    }

    if (!validarPassword(password)) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    // 2. Verificar si ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Crear usuario + cliente (TRANSACCIÓN 🔥)
    const nuevoUsuario = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          nombre,
          apellido,
          email,
          password: passwordHash,
          rol: "CLIENTE" // 🔥 clave: no se puede elegir rol
        }
      });

      await tx.cliente.create({
        data: {
          usuarioId: usuario.id,
          telefono: ""
        }
      });

      return usuario;
    });

    res.status(201).json({
      mensaje: "Cliente registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validaciones
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña obligatorios" });
    }

    // 2. Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    // 🔐 Mensaje genérico (seguridad)
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 3. Validar password
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 4. Generar token
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
        issuer: "estetica-app"
      }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  register,
  login
};