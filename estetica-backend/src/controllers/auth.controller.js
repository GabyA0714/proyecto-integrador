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
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (!validarPassword(password)) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const personaExistente = await prisma.people.findUnique({
      where: { email }
    });

    if (personaExistente) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevaPersona = await prisma.people.create({
      data: {
        name: `${nombre} ${apellido}`,
        email: email,
        documentType: "DNI",
        document: documento || "00000000",
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
      message: "Paciente registrado correctamente",
      user: {
        id: nuevaPersona.user.id,
        role: nuevaPersona.user.role,
        person: {
          name: nuevaPersona.name,
          email: nuevaPersona.email
        }
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
      return res.status(400).json({ message: "Email y contraseña obligatorios" });
    }

    const persona = await prisma.people.findUnique({
      where: { email },
      include: { user: true }
    });

    if (!persona || !persona.user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValida = await bcrypt.compare(password, persona.user.passwordHash);

    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: persona.user.id,
        role: persona.user.role,
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
      message: "Login exitoso",
      token,
      user: {
        id: persona.user.id,
        role: persona.user.role,
        person: {
          name: persona.name,
          email: persona.email
        }
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
      where: { user: { id: req.user.id } },
      include: { user: true }
    });

    if (!persona) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      user: {
        id: persona.user.id,
        role: persona.user.role,
        person: {
          name: persona.name,
          email: persona.email
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
};