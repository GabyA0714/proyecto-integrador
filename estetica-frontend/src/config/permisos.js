// ============================================================
// ESPACIO SENDA — permisos.js
// Ruta: src/config/permisos.js
//
// Fuente única de verdad de "qué rol puede ver/hacer qué" en el frontend.
// Se alinea con la autorización del backend (middleware autorizarRoles) y
// con el "data scoping" (un profesional solo ve lo suyo).
//
// ¿Por qué .js y no .ts? Todo el proyecto es JavaScript (archivos .jsx/.js,
// sin TypeScript). Este archivo sigue esa convención por consistencia. Si en
// algún momento migran el front a TS, se tipa sin cambiar la lógica.
//
// Regla de oro: el frontend nunca debe ser MENOS restrictivo que el backend.
// El backend sigue siendo la barrera real; esto es UX (no mostrar pantallas
// ni botones que terminarían en un 403).
// ============================================================

// Deben coincidir EXACTAMENTE con el enum Role del backend.
export const ROLES = {
  ADMIN: "ADMIN",
  RECEPTIONIST: "RECEPTIONIST",
  PROFESSIONAL: "PROFESSIONAL",
  PATIENT: "PATIENT",
};

// ── ACCESO A PÁGINAS ────────────────────────────────────────
// Quién puede ENTRAR a cada pantalla (ver). El permiso de EDITAR se maneja
// aparte (PERMISOS_EDICION), porque hay pantallas donde un rol mira pero no
// toca (ej.: recepción ve profesionales, profesional ve pacientes).
export const PERMISOS = {
  // Dashboard: ADMIN ve todo; el PROFESSIONAL lo ve acotado a su perfil.
  dashboard:            [ROLES.ADMIN, ROLES.PROFESSIONAL],
  usuarios:             [ROLES.ADMIN],
  reportes:             [ROLES.ADMIN],
  servicios:            [ROLES.ADMIN],
  categorias:           [ROLES.ADMIN],
  serviciosProfesional: [ROLES.ADMIN],

  // Admin + Recepción (recepción solo MIRA; el editar se gatea aparte)
  profesionales:        [ROLES.ADMIN, ROLES.RECEPTIONIST],
  fichaProfesional:     [ROLES.ADMIN, ROLES.RECEPTIONIST],

  // Admin + Profesional (el profesional gestiona SU agenda; backend scopea)
  agendas:              [ROLES.ADMIN, ROLES.PROFESSIONAL],

  // Admin + Recepción + Profesional (el profesional solo en su propia agenda)
  reservaTurno:         [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],

  // Todo el staff
  turnos:               [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],
  calendario:           [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],
  reprogramar:          [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],
  pacientes:            [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],
  miPerfil:             [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL],
};

// ── PERMISOS DE EDICIÓN (crear / editar / borrar dentro de una pantalla) ──
// Para gatear botones de escritura. "Ver" lo da PERMISOS; "editar" lo da esto.
export const PERMISOS_EDICION = {
  profesionales: [ROLES.ADMIN],                       // recepción ve, no edita
  pacientes:     [ROLES.ADMIN, ROLES.RECEPTIONIST],   // profesional ve, no edita
  servicios:     [ROLES.ADMIN],
  categorias:    [ROLES.ADMIN],
};

// Roles que pueden entrar al layout /admin (cualquiera del staff).
export const ROLES_STAFF = [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROFESSIONAL];

// ¿Este rol puede VER esta página?
export const puede = (role, pagina) =>
  Array.isArray(PERMISOS[pagina]) && PERMISOS[pagina].includes(role);

// ¿Este rol puede EDITAR (crear/editar/borrar) este recurso?
export const puedeEditar = (role, recurso) =>
  Array.isArray(PERMISOS_EDICION[recurso]) && PERMISOS_EDICION[recurso].includes(role);

// A dónde mandar a cada rol como "home" tras el login o al entrar a /admin.
// (ADMIN al Dashboard; el resto a la Turnera, que es lo que sí ven.)
export const homePorRol = (role) => {
  switch (role) {
    case ROLES.ADMIN:
    case ROLES.PROFESSIONAL:
      return "/admin";          // Dashboard (el profesional lo ve acotado a sí mismo)
    case ROLES.RECEPTIONIST:
      return "/admin/turnos";   // Recepción no tiene dashboard: va a la Turnera
    // case ROLES.PATIENT: return "/paciente"; // (deshabilitado por QA)
    default:
      return "/no-autorizado";
  }
};