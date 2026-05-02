import express from "express";
import {
  obtenerPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  obtenerHistorialTurnos,
  obtenerHistorialPagos,
} from "../controllers/patients.controller.js";
import verificarToken from "../middleware/verificarToken.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get(
  "/",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerPacientes,
);
router.get(
  "/:id",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerPacientePorId,
);
router.post(
  "/",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST"]),
  crearPaciente,
);
router.patch(
  "/:id",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST"]),
  actualizarPaciente,
);
router.get(
  "/:id/appointments",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerHistorialTurnos,
);
router.get(
  "/:id/payments",
  verificarToken,
  authorize(["ADMIN", "RECEPTIONIST"]),
  obtenerHistorialPagos,
);

export default router;
