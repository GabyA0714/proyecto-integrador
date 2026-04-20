const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/verificarToken");
const autorizarRoles = require("../middleware/autorizarRoles");

const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/usuario.controller");

// SOLO ADMIN puede ver usuarios
router.get(
  "/",
  verificarToken,
  autorizarRoles("ADMIN"),
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

module.exports = router;