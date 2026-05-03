import express from 'express';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword
} from '../controllers/users.controller.js';

const router = express.Router();

// SOLO ADMIN puede ver usuarios
router.get(
  "/",
  verificarToken,
  autorizarRoles(["ADMIN"]), // Permitir que solo ADMIN vea la lista completa de usuarios
  obtenerUsuarios
);

// SOLO ADMIN puede ver usuario por ID
router.get(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN"]), // Permitir que solo ADMIN vea detalles de cualquier usuario
  obtenerUsuarioPorId
);

// REGISTRO (SIN TOKEN)
router.post(
  "/",
  crearUsuario
);

// SOLO ADMIN puede actualizar
router.put(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN"]), // Permitir que solo ADMIN actualice cualquier usuario
  actualizarUsuario
);

// SOLO ADMIN puede eliminar
router.delete(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN"]), // Permitir que solo ADMIN elimine usuarios
  eliminarUsuario
);

router.patch(
  "/:id/password",
  verificarToken,
  cambiarPassword
);

export default router;