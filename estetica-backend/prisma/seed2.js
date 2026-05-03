import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed2...');

  // ── 1. Obtenemos los IDs que ya existen en la BD ────────────

  const leila     = await prisma.professional.findFirst({ where: { person: { email: 'lsenger@espaciosenda.com' } } });
  const julieta   = await prisma.professional.findFirst({ where: { person: { email: 'jbusso@espaciosenda.com' } } });
  const jaquelina = await prisma.professional.findFirst({ where: { person: { email: 'jgrassetti@espaciosenda.com' } } });
  const valeria   = await prisma.professional.findFirst({ where: { person: { email: 'vmontero@espaciosenda.com' } } });

  const srvPrp         = await prisma.service.findFirst({ where: { name: 'Plasma rico en plaquetas' } });
  const srvPeeling     = await prisma.service.findFirst({ where: { name: 'Peeling químico' } });
  const srvBotox       = await prisma.service.findFirst({ where: { name: 'Toxina botulínica (Botox/Xeomin)' } });
  const srvHialuronico = await prisma.service.findFirst({ where: { name: 'Tratamiento del contorno mandibular con ácido hialurónico' } });
  const srvBlanqueo    = await prisma.service.findFirst({ where: { name: 'Blanqueamiento dental' } });
  const srvLimpieza    = await prisma.service.findFirst({ where: { name: 'Limpieza dental' } });
  const srvHifu        = await prisma.service.findFirst({ where: { name: 'HIFU' } });
  const srvDepilacion  = await prisma.service.findFirst({ where: { name: 'Depilación definitiva (Láser soprano)' } });

  const paciente  = await prisma.patient.findFirst({ where: { person: { email: 'paciente@prueba.com' } } });
  const userAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  console.log('✅ IDs obtenidos de la BD.');

  // ── 2. ProfessionalService ──────────────────────────────────

  const ps1 = await prisma.professionalService.create({
    data: { professionalId: leila.id,     serviceId: srvPrp.id,         durationMinutes: 60, price: 85000  },
  });
  const ps2 = await prisma.professionalService.create({
    data: { professionalId: leila.id,     serviceId: srvPeeling.id,     durationMinutes: 45, price: 55000  },
  });
  const ps3 = await prisma.professionalService.create({
    data: { professionalId: julieta.id,   serviceId: srvBlanqueo.id,    durationMinutes: 90, price: 120000 },
  });
  const ps4 = await prisma.professionalService.create({
    data: { professionalId: julieta.id,   serviceId: srvLimpieza.id,    durationMinutes: 45, price: 40000  },
  });
  const ps5 = await prisma.professionalService.create({
    data: { professionalId: jaquelina.id, serviceId: srvBotox.id,       durationMinutes: 30, price: 95000  },
  });
  const ps6 = await prisma.professionalService.create({
    data: { professionalId: jaquelina.id, serviceId: srvHialuronico.id, durationMinutes: 60, price: 130000 },
  });
  const ps7 = await prisma.professionalService.create({
    data: { professionalId: jaquelina.id, serviceId: srvDepilacion.id,  durationMinutes: 60, price: 70000  },
  });
  const ps8 = await prisma.professionalService.create({
    data: { professionalId: valeria.id,   serviceId: srvHifu.id,        durationMinutes: 90, price: 150000 },
  });
  const ps9 = await prisma.professionalService.create({
    data: { professionalId: valeria.id,   serviceId: srvPrp.id,         durationMinutes: 60, price: 85000  },
  });

  console.log('✅ ProfessionalServices creados.');

  // ── 3. RecurringSchedule ────────────────────────────────────
  // dayOfWeek: 0=Dom 1=Lun 2=Mar 3=Mié 4=Jue 5=Vie 6=Sáb

  await prisma.recurringSchedule.createMany({
    data: [
      { professionalId: leila.id,     dayOfWeek: 2, startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T18:00:00') },
      { professionalId: leila.id,     dayOfWeek: 4, startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T18:00:00') },
      { professionalId: julieta.id,   dayOfWeek: 1, startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T17:00:00') },
      { professionalId: julieta.id,   dayOfWeek: 3, startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T17:00:00') },
      { professionalId: jaquelina.id, dayOfWeek: 5, startTime: new Date('1970-01-01T10:00:00'), endTime: new Date('1970-01-01T16:00:00') },
      { professionalId: jaquelina.id, dayOfWeek: 6, startTime: new Date('1970-01-01T10:00:00'), endTime: new Date('1970-01-01T14:00:00') },
      { professionalId: valeria.id,   dayOfWeek: 4, startTime: new Date('1970-01-01T14:00:00'), endTime: new Date('1970-01-01T19:00:00') },
    ],
  });

  console.log('✅ RecurringSchedules creados.');

  // ── 4. Availability ─────────────────────────────────────────
  // Pasada → para COMPLETED y CANCELLED. Futura → para PENDING y CONFIRMED.

  const av1 = await prisma.availability.create({
    data: { professionalId: leila.id,     date: new Date('2026-04-28'), startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T18:00:00') },
  });
  const av2 = await prisma.availability.create({
    data: { professionalId: leila.id,     date: new Date('2026-04-30'), startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T18:00:00') },
  });
  const av3 = await prisma.availability.create({
    data: { professionalId: jaquelina.id, date: new Date('2026-05-01'), startTime: new Date('1970-01-01T10:00:00'), endTime: new Date('1970-01-01T16:00:00') },
  });
  const av4 = await prisma.availability.create({
    data: { professionalId: julieta.id,   date: new Date('2026-05-04'), startTime: new Date('1970-01-01T09:00:00'), endTime: new Date('1970-01-01T17:00:00') },
  });
  const av5 = await prisma.availability.create({
    data: { professionalId: jaquelina.id, date: new Date('2026-05-08'), startTime: new Date('1970-01-01T10:00:00'), endTime: new Date('1970-01-01T16:00:00') },
  });
  const av6 = await prisma.availability.create({
    data: { professionalId: valeria.id,   date: new Date('2026-05-07'), startTime: new Date('1970-01-01T14:00:00'), endTime: new Date('1970-01-01T19:00:00') },
  });

  console.log('✅ Availability slots creados.');

  // ── 5. AvailabilityException ─────────────────────────────────

  await prisma.availabilityException.create({
    data: {
      professionalId: jaquelina.id,
      exceptionDate:  new Date('2026-05-08'),
      startTime:      new Date('1970-01-01T13:00:00'),
      endTime:        new Date('1970-01-01T15:00:00'),
      exceptionType:  'PERSONAL',
      reason:         'Reunión administrativa. Horario de tarde bloqueado.',
    },
  });

  console.log('✅ AvailabilityException creada.');

  // ── 6. Appointments ─────────────────────────────────────────

  // TURNO 1 – COMPLETED (Jaquelina, Botox – semana pasada)
  const appt1 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps5.id,
      availabilityId:        av3.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-05-01T10:00:00'),
      endsAt:                new Date('2026-05-01T10:30:00'),
      status:                'COMPLETED',
      priceSnapshot:         95000,
      paymentStatus:         'COMPLETED',
      notes:                 'Paciente sin antecedentes. Tratamiento exitoso.',
    },
  });

  // TURNO 2 – CANCELLED (Leila, PRP – semana pasada)
  const appt2 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps1.id,
      availabilityId:        av1.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-04-28T11:00:00'),
      endsAt:                new Date('2026-04-28T12:00:00'),
      status:                'CANCELLED',
      priceSnapshot:         85000,
      paymentStatus:         'PENDING',
      notes:                 'Paciente canceló por viaje.',
    },
  });

  // TURNO 3 – COMPLETED con descuento (Leila, Peeling – semana pasada)
  const appt3 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps2.id,
      availabilityId:        av2.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-04-30T14:00:00'),
      endsAt:                new Date('2026-04-30T14:45:00'),
      status:                'COMPLETED',
      priceSnapshot:         55000,
      discountAmount:        5000,
      discountReason:        'Descuento por paciente frecuente.',
      paymentStatus:         'COMPLETED',
      notes:                 'Se aplicó descuento autorizado por admin.',
    },
  });

  // TURNO 4 – PENDING (Julieta, Blanqueamiento – próxima semana)
  const appt4 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps3.id,
      availabilityId:        av4.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-05-04T09:00:00'),
      endsAt:                new Date('2026-05-04T10:30:00'),
      status:                'PENDING',
      priceSnapshot:         120000,
      paymentStatus:         'PENDING',
      notes:                 'Turno pendiente de confirmación.',
    },
  });

  // TURNO 5 – CONFIRMED con seña (Jaquelina, Hialurónico – próxima semana)
  const appt5 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps6.id,
      availabilityId:        av5.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-05-08T10:00:00'),
      endsAt:                new Date('2026-05-08T11:00:00'),
      status:                'CONFIRMED',
      priceSnapshot:         130000,
      depositAmount:         39000,
      paymentStatus:         'PARTIAL',
      notes:                 'Seña abonada por transferencia. Paciente confirma asistencia.',
    },
  });

  // TURNO 6 – CONFIRMED sin seña (Valeria, HIFU – próxima semana)
  const appt6 = await prisma.appointment.create({
    data: {
      professionalServiceId: ps8.id,
      availabilityId:        av6.id,
      patientId:             paciente.id,
      createdByUserId:       userAdmin.id,
      startsAt:              new Date('2026-05-07T14:00:00'),
      endsAt:                new Date('2026-05-07T15:30:00'),
      status:                'CONFIRMED',
      priceSnapshot:         150000,
      paymentStatus:         'PENDING',
      notes:                 'Primera sesión. Sin seña por ser consulta inicial.',
    },
  });

  console.log('✅ Appointments creados.');

  // ── 7. Payments ─────────────────────────────────────────────

  await prisma.payment.createMany({
    data: [
      // Turno 1 (COMPLETED, Botox) – pago total en efectivo
      { appointmentId: appt1.id, amount: 95000, method: 'CASH',       type: 'FULL_PAYMENT', isRefund: false },
      // Turno 3 (COMPLETED, Peeling con descuento) – pago con débito (55000 - 5000)
      { appointmentId: appt3.id, amount: 50000, method: 'DEBIT_CARD', type: 'FULL_PAYMENT', isRefund: false },
      // Turno 5 (CONFIRMED, Hialurónico) – seña por transferencia
      { appointmentId: appt5.id, amount: 39000, method: 'TRANSFER',   type: 'DEPOSIT',      isRefund: false },
    ],
  });

  console.log('✅ Payments creados.');

  // ── 8. AppointmentAudit ──────────────────────────────────────

  const auditData = [
    { appointmentId: appt1.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt1.id, action: 'UPDATE', prevStatus: 'PENDING',   newStatus: 'CONFIRMED', performedBy: userAdmin.id },
    { appointmentId: appt1.id, action: 'UPDATE', prevStatus: 'CONFIRMED', newStatus: 'COMPLETED', performedBy: userAdmin.id },
    { appointmentId: appt2.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt2.id, action: 'CANCEL', prevStatus: 'PENDING',   newStatus: 'CANCELLED', performedBy: userAdmin.id },
    { appointmentId: appt3.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt3.id, action: 'UPDATE', prevStatus: 'PENDING',   newStatus: 'CONFIRMED', performedBy: userAdmin.id },
    { appointmentId: appt3.id, action: 'UPDATE', prevStatus: 'CONFIRMED', newStatus: 'COMPLETED', performedBy: userAdmin.id },
    { appointmentId: appt4.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt5.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt5.id, action: 'UPDATE', prevStatus: 'PENDING',   newStatus: 'CONFIRMED', performedBy: userAdmin.id },
    { appointmentId: appt6.id, action: 'CREATE', prevStatus: null,        newStatus: 'PENDING',   performedBy: userAdmin.id },
    { appointmentId: appt6.id, action: 'UPDATE', prevStatus: 'PENDING',   newStatus: 'CONFIRMED', performedBy: userAdmin.id },
  ];
  for (const entry of auditData) {
    await prisma.appointmentAudit.create({ data: entry });
  }

  console.log('✅ AppointmentAudits creados.');
  console.log('🎉 Seed2 completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });