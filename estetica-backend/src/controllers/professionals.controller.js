import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import {
  verificarProfesional
} from '../middleware/checkProfessional.js';


export const obtenerProfesionales = async (req, res) => {
  try {
    const profesionales = await prisma.professional.findMany({
      include: {
        person: true
      },
      orderBy: {
        person: {
          name: 'asc'
        }
      },
    });
    res.json(profesionales);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const obtenerProfesionalPorId = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const profesional = await prisma.professional.findUnique({
      where: {
        id
      },
      include: {
        person: true,
        services: {
          include: {
            service: {
              include: {
                category: true
              }
            }
          }
        },
        schedules: true,
      },
    });

    if (!profesional) {
      return res.status(404).json({
        mensaje: 'Profesional no encontrado'
      });
    }

    res.json(profesional);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};



export const crearProfesional = async (req, res) => {
  try {
    const {
      name,
      documentType,
      document,
      email,
      phone,
      specialty,
      bio,
      googleCalendarId,
      password
    } = req.body;

    if (!name || !documentType || !document || !email || !phone || !specialty || !password) {
      return res.status(400).json({
        mensaje: 'name, documentType, document, email, phone, specialty y password son obligatorios',
      });
    }

    const documentTypesValidos = ['DNI', 'PASSPORT', 'CUIL', 'CUIT'];
    if (!documentTypesValidos.includes(documentType)) {
      return res.status(400).json({
        mensaje: `documentType debe ser uno de: ${documentTypesValidos.join(', ')}`
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Se verifica si ya existe un profesional con el mail
    const existente = await prisma.people.findUnique({
      where: {
        email
      },
      include: {
        professional: true
      },
    });

    if (existente) {
      // Si ya existe el profesional no se crea
      if (existente.professional) {
        return res.status(409).json({
          mensaje: 'Ya existe un profesional registrado con ese email'
        });
      }

      // Si no existe el profesional pero si la persona, se crea solo el profesional asociado a esa persona
      const nuevoProfesional = await prisma.professional.create({
        data: {
          peopleId: existente.id,
          specialty,
          bio: bio ? bio : null,
          googleCalendarId: googleCalendarId ? googleCalendarId : null,
        },
        include: {
          person: true
        },
      });

      return res.status(201).json({
        id: nuevoProfesional.id,
        nombre: nuevoProfesional.person.name,
        email: nuevoProfesional.person.email,
        specialty: nuevoProfesional.specialty,
      });
    }

    // Si no existe, creamos persona + profesional + usuario todo junto
    const nuevaPersona = await prisma.people.create({
      data: {
        name,
        documentType,
        document,
        email,
        phone,
        professional: {
          create: {
            specialty,
            bio: bio ? bio : null,
            googleCalendarId: googleCalendarId ? googleCalendarId : null,
          },
        },
        user: {
          create: {
            passwordHash,
            role: 'PROFESSIONAL'
          },
        },
      },
      include: {
        professional: true,
        user: true
      },
    });

    res.status(201).json({
      id: nuevaPersona.professional.id,
      nombre: nuevaPersona.name,
      email: nuevaPersona.email,
      specialty: nuevaPersona.professional.specialty,
      rol: nuevaPersona.user.role,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        mensaje: 'Ya existe una persona con ese email o documento'
      });
    }
    res.status(500).json({
      error: error.message
    });
  }
};

export const actualizarProfesional = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      name,
      phone,
      document,
      documentType,
      specialty,
      bio,
      googleCalendarId,
      active
    } = req.body;

    const profesional = await prisma.professional.findUnique({
      where: {
        id
      }
    });
    if (!profesional) {
      return res.status(404).json({
        mensaje: 'Profesional no encontrado'
      });
    }

    if (!await verificarProfesional(id, req.usuario)) {
      return res.status(403).json({
        mensaje: 'Solo podés editar tu propio perfil'
      });
    }

    if (req.usuario.rol === 'PROFESSIONAL' && active !== undefined) {
      return res.status(403).json({
        mensaje: 'No tenés permisos para activar o desactivar un profesional'
      });
    }


    if (documentType) {
      const documentTypesValidos = ['DNI', 'PASSPORT', 'CUIL', 'CUIT'];
      if (!documentTypesValidos.includes(documentType)) {
        return res.status(400).json({
          mensaje: `documentType debe ser uno de: ${documentTypesValidos.join(', ')}`
        });
      }
    }

    const actualizado = await prisma.$transaction(async (tx) => {
      if (name !== undefined || phone !== undefined || document !== undefined || documentType !== undefined) {
        await tx.people.update({
          where: {
            id: profesional.peopleId
          },
          data: {
            ...(name !== undefined && {
              name
            }),
            ...(phone !== undefined && {
              phone
            }),
            ...(document !== undefined && {
              document
            }),
            ...(documentType !== undefined && {
              documentType
            }),
          },
        });
      }

      return tx.professional.update({
        where: {
          id
        },
        data: {
          ...(specialty !== undefined && {
            specialty
          }),
          ...(bio !== undefined && {
            bio
          }),
          ...(googleCalendarId !== undefined && {
            googleCalendarId
          }),
          ...(active !== undefined && {
            active
          }),
        },
        include: {
          person: true
        },
      });
    });

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};