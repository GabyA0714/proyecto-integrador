import express from 'express';
import verificarToken from '../middleware/verificarToken.js';
import autorizarRoles from '../middleware/autorizarRoles.js';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/usuario.controller.js';

const router = express.Router();

// SOLO ADMIN puede ver usuarios
router.get(
  "/",
  verificarToken,
  autorizarRoles("ADMIN"), // Asumiendo que autorizarRoles exporta una función que recibe un rol
  obtenerUsuarios
);

// SOLO ADMIN puede ver usuario por ID
router.get(
  "/:id",
  verificarToken,
  autorizarRoles("ADMIN"),
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
  autorizarRoles("ADMIN"),
  actualizarUsuario
);

// SOLO ADMIN puede eliminar
router.delete(
  "/:id",
  verificarToken,
  autorizarRoles("ADMIN"),
  eliminarUsuario
);

export default router;