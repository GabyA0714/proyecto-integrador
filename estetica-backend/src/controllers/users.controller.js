import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      include: {
        person: true
      }
    });

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

    let userData = { 
      ...(rol !== undefined && { role: rol }),
      ...(active !== undefined && { active }), 
    };
    
    if (password) {
      userData.passwordHash = await bcrypt.hash(password, 10);
    }

    const usuarioActualizado = await prisma.user.update({
      where: { id: String(id) },
      data: userData,
      include: { person: true }
    });

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

    await prisma.user.delete({
      where: { id: String(id) }
    });

    res.json({ mensaje: "Usuario eliminado del sistema" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordActual, passwordNueva } = req.body;

    // TODO EN INGLÉS: req.user.role y req.user.id
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      return res.status(403).json({ mensaje: 'Solo podés cambiar tu propia contraseña' });
    }

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({ mensaje: 'passwordActual y passwordNueva son obligatorios' });
    }

    const usuario = await prisma.user.findUnique({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const valida = await bcrypt.compare(passwordActual, usuario.passwordHash);
    if (!valida) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    const passwordHash = await bcrypt.hash(passwordNueva, 10);
    await prisma.user.update({ where: { id }, data: { passwordHash } });

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};