const prisma = require("../config/prisma");

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        usuario: true,
      },
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerClientePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
      },
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearCliente = async (req, res) => {
  try {
    const { usuarioId, telefono, notas } = req.body;

    const cliente = await prisma.cliente.create({
      data: {
        usuarioId,
        telefono,
        notas,
      },
    });

    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { telefono, notas } = req.body;

    const cliente = await prisma.cliente.update({
      where: { id: Number(id) },
      data: {
        telefono,
        notas,
      },
    });

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
