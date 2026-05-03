import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const validarEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

const validarPassword = (password) => {
  return password.length >= 6;
};

export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, documento } = req.body;

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

    // Buscamos si la persona ya existe en la tabla maestra 'people'
    const personaExistente = await prisma.people.findUnique({
      where: { email }
    });

    if (personaExistente) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Creamos la Persona, el Usuario y el Paciente todo junto
    const nuevaPersona = await prisma.people.create({
      data: {
        name: `${nombre} ${apellido}`,
        email: email,
        documentType: "DNI",
        document: documento || "00000000", // Valor por defecto si no lo envían
        phone: "",
        user: {
          create: {
            passwordHash: passwordHash,
            role: "PATIENT"
          }
        },
        patient: {
          create: {
            cuilCuit: ""
          }
        }
      },
      include: { user: true }
    });

    res.status(201).json({
      mensaje: "Paciente registrado correctamente",
      usuario: {
        id: nuevaPersona.user.id,
        nombre: nuevaPersona.name,
        email: nuevaPersona.email,
        rol: nuevaPersona.user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Email y contraseña obligatorios" });
    }

    // Buscamos a la persona y traemos sus datos de usuario
    const persona = await prisma.people.findUnique({
      where: { email },
      include: { user: true }
    });

    if (!persona || !persona.user) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(password, persona.user.passwordHash);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: persona.user.id,
        rol: persona.user.role,
        email: persona.email,
        peopleId: persona.id
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
        id: persona.user.id,
        nombre: persona.name,
        email: persona.email,
        rol: persona.user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const perfil = async (req, res) => {
  try {
    const persona = await prisma.people.findFirst({
      where: { user: { id: req.usuario.id } },
      include: { user: true }
    });

    if (!persona) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      id: persona.user.id,
      nombre: persona.name,
      email: persona.email,
      rol: persona.user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener perfil" });
  }
};