import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      include: {
        person: true // Para poder ver el nombre y el email
      }
    });

    // Mapeamos para devolver un objeto más limpio al frontend
    const usuariosLimpios = usuarios.map(u => ({
      id: u.id,
      nombre: u.person.name,
      email: u.person.email,
      rol: u.role,
      activo: u.active
    }));

    res.json(usuariosLimpios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.user.findUnique({
      where: { id: String(id) },
      include: { person: true }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      id: usuario.id,
      nombre: usuario.person.name,
      email: usuario.person.email,
      rol: usuario.role,
      activo: usuario.active
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearUsuario = async (req, res) => {
  try {
    // Como los datos están separados, creamos a la Persona y al Usuario juntos
    const { nombre, email, document, documentType, phone, password, rol } = req.body;

    const existente = await prisma.people.findUnique({
      where: { email }
    });

    if (existente) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevaPersona = await prisma.people.create({
      data: {
        name: nombre,
        email: email,
        document: document || "00000000",
        documentType: documentType || "DNI",
        phone: phone || "",
        user: {
          create: {
            passwordHash: hash,
            role: rol
          }
        }
      },
      include: { user: true }
    });

    res.status(201).json({
      id: nuevaPersona.user.id,
      nombre: nuevaPersona.name,
      email: nuevaPersona.email,
      rol: nuevaPersona.user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol, active } = req.body;

    // Primero actualizamos los datos propios del Usuario (rol, password, status)
    let userData = { role: rol, active: active };
    if (password) {
      userData.passwordHash = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = await prisma.user.update({
      where: { id: String(id) },
      data: userData,
      include: { person: true }
    });

    // Luego actualizamos los datos de la Persona asociada (nombre, email)
    if (nombre || email) {
      await prisma.people.update({
        where: { id: usuarioActualizado.peopleId },
        data: {
          name: nombre || usuarioActualizado.person.name,
          email: email || usuarioActualizado.person.email
        }
      });
    }

    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Al eliminar el usuario, la persona queda. Si querés borrar todo, 
    // tenés que borrar la entrada en 'people'
    await prisma.user.delete({
      where: { id: String(id) }
    });

    res.json({ mensaje: "Usuario eliminado del sistema" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};