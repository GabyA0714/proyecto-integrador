import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando la siembra de datos REALES y SEGUROS para Espacio Senda...');

  // Generamos el hash encriptado para la contraseña "123456"
  // El número 10 es el "salt rounds", que define qué tan compleja es la encriptación
  const hashedDefaultPassword = await bcrypt.hash('123456', 10);

  // 1. Usuarios de Prueba (Administrador y Paciente)
  await prisma.people.create({
    data: {
      name: 'Admin Senda',
      documentType: 'DNI',
      document: '11111111',
      email: 'admin@espaciosenda.com',
      phone: '1111111111',
      user: {
        create: {
          passwordHash: hashedDefaultPassword, // Usamos la clave encriptada
          role: 'ADMIN',
        }
      }
    }
  });

  await prisma.people.create({
    data: {
      name: 'Paciente Prueba',
      documentType: 'DNI',
      document: '99999999',
      email: 'paciente@prueba.com',
      phone: '1199999999',
      patient: {
        create: { cuilCuit: '20999999992' }
      },
      user: {
        create: {
          passwordHash: hashedDefaultPassword, // Usamos la clave encriptada
          role: 'PATIENT',
        }
      }
    }
  });
  console.log(' Admin y Paciente creados con contraseñas ENCRIPTADAS.');

  // 2. Staff de Profesionales Reales
  const profesionales = [
    {
      name: 'Dra. Leila Belén Senger', document: '20000001', email: 'lsenger@espaciosenda.com',
      specialty: 'Cardiología', bio: 'UBA. MN 156.746'
    },
    {
      name: 'Dra. Julieta Busso', document: '20000002', email: 'jbusso@espaciosenda.com',
      specialty: 'Odontología', bio: 'UNR. MN 31995'
    },
    {
      name: 'Dra. Jaquelina Grassetti', document: '20000003', email: 'jgrassetti@espaciosenda.com',
      specialty: 'Medicina estética y armonización facial', bio: 'MP 23.602'
    },
    {
      name: 'Dra. Valeria Montero', document: '20000004', email: 'vmontero@espaciosenda.com',
      specialty: 'Ginecología', bio: 'UBA. MN 108.536'
    }
  ];

  for (const prof of profesionales) {
    await prisma.people.create({
      data: {
        name: prof.name,
        documentType: 'DNI',
        document: prof.document,
        email: prof.email,
        phone: '1100000000', 
        professional: {
          create: {
            specialty: prof.specialty,
            bio: prof.bio,
          }
        }
      }
    });
  }
  console.log(' Staff de profesionales cargado.');

  // 3. Categorías y Servicios Reales
  const categoriasConServicios = [
    {
      name: "Bioestimulación cutánea",
      services: [
        "Plasma rico en plaquetas", "Tratamiento de reposición de fibroblastos autólogos (Fcells)", 
        "Ellansé (Policaprolactona)", "Profhilo (Ácido hialurónico)", "Radiesse (Hidroxiapatita de calcio)", 
        "Hilos de policaprolactona", "Dermoray (tecnología arco de plasma)", "Carboxiterapia"
      ]
    },
    {
      name: "Armonización orofacial",
      services: [
        "Toxina botulínica (Botox/Xeomin)", "Tratamiento del contorno mandibular con ácido hialurónico", 
        "Tratamiento del tercio medio (pómulos, arco cigomático) con ácido hialurónico", 
        "Tratamiento del mentón con ácido hialurónico", "Rinomodelación con ácido hialurónico", 
        "Blefaroplastía no quirúrgica (Dermoray)", "Tratamiento de papada con enzimas recombinantes", "Láser CO2"
      ]
    },
    {
      name: "Dermatología estética",
      services: [
        "Peeling químico", "Tratamiento del acné, rosácea y otras patologías dermatológicas", 
        "Tratamiento de alopecías", "Tratamiento de la hiperhidrosis", "Mesoterapia", "Luz pulsada", 
        "Depilación definitiva (Láser soprano)", "Láser CO2"
      ]
    },
    {
      name: "Clínica de la sonrisa",
      services: [
        "Blanqueamiento dental", "Carillas dentales de resina", "Diseño de labios con ácido hialurónico", 
        "Limpieza dental", "Tratamiento de sonrisa gingival con toxina botulínica", 
        "Tratamiento del bruxismo con toxina botulínica"
      ]
    },
    {
      name: "Tratamientos corporales",
      services: [
        "Carboxiterapia subcutánea", "Mesoterapia", "Lipólisis química (enzimas recombinantes, fosfatidilcolina)", 
        "Tratamiento de estrías (mesoterapia, Dermoray, Plasma rico en plaquetas)", 
        "Tratamiento del PEFE (celulitis): subsición, Radiesse, mesoterapia, carboxiterapia, enzimas recombinantes"
      ]
    },
    {
      name: "Medicina ortomolecular, funcional e integrativa y salud cardiometabólica",
      services: [
        "Sesiones 1: 1", "Consultas Cardiometabolismo", "Suplementación oral", "Sueroterapias", 
        "Deportistas, fatiga crónica, inflamación crónica, prevención para una longevidad saludable, salud metabólica, microbiota intestinal, SIBO"
      ]
    },
    {
      name: "Ginecología regenerativa",
      services: [
        "Biomodulación hormonal", "Pellet hormonal", "HIFU", 
        "Tratamiento de la incontinencia de orina, sequedad vaginal, micosis recurrente", 
        "Plasma rico en plaquetas", "Carboxiterapia", "Bioestimulación (aumento de la producción de colágeno y elastina)", 
        "Tecnología arco de plasma", "Láser CO2"
      ]
    }
  ];

  for (let i = 0; i < categoriasConServicios.length; i++) {
    const cat = categoriasConServicios[i];
    await prisma.serviceCategory.create({
      data: {
        name: cat.name,
        displayOrder: i + 1,
        services: {
          create: cat.services.map(srvName => ({
            name: srvName,
            defaultDurationMinutes: 60
          }))
        }
      }
    });
  }
  console.log(' Categorías y todos los tratamientos cargados.');

  console.log(' ¡Base de datos sembrada con éxito y asegurada!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });