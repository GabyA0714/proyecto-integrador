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
import autorizarRoles from "../middleware/autorizarRoles.js";

const router = express.Router();

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Obtener todos los pacientes
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  "/",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerPacientes,
);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Obtener un paciente por ID
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *       404:
 *         description: Paciente no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerPacientePorId,
);

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Crear un nuevo paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Paciente creado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe un paciente con ese email
 *       401:
 *         description: Token inválido o ausente
 */
router.post(
  "/",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST"]),
  crearPaciente,
);

/**
 * @swagger
 * /api/patients/{id}:
 *   patch:
 *     summary: Actualizar un paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente actualizado correctamente
 *       404:
 *         description: Paciente no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.patch(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST"]),
  actualizarPaciente,
);

/**
 * @swagger
 * /api/patients/{id}/appointments:
 *   get:
 *     summary: Obtener el historial de turnos de un paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de turnos obtenido correctamente
 *       404:
 *         description: Paciente no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  "/:id/appointments",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerHistorialTurnos,
);

/**
 * @swagger
 * /api/patients/{id}/payments:
 *   get:
 *     summary: Obtener el historial de pagos de un paciente
 *     tags:
 *       - Pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de pagos obtenido correctamente
 *       404:
 *         description: Paciente no encontrado
 *       401:
 *         description: Token inválido o ausente
 */
router.get(
  "/:id/payments",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST"]),
  obtenerHistorialPagos,
);

export default router;
