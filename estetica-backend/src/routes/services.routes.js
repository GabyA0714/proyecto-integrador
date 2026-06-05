import express from "express";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  desactivarServicio,
  crearProfessionalService,
  actualizarProfessionalService,
  obtenerServiciosPorProfesional,
} from "../controllers/services.controller.js";
import verificarToken from "../middleware/verificarToken.js";
import autorizarRoles from "../middleware/autorizarRoles.js";

const router = express.Router();

// Categorías

/**
 * @swagger
 * /api/services/categories:
 *   get:
 *     summary: Obtener todas las categorías de servicios
 *     tags:
 *       - Categorías de Servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida correctamente
 */
router.get(
  "/categories",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerCategorias,
);

/**
 * @swagger
 * /api/services/categories:
 *   post:
 *     summary: Crear una categoría de servicio
 *     tags:
 *       - Categorías de Servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 */
router.post(
  "/categories",
  verificarToken,
  autorizarRoles(["ADMIN"]),
  crearCategoria,
);

/**
 * @swagger
 * /api/services/categories/{id}:
 *   patch:
 *     summary: Actualizar una categoría
 *     tags:
 *       - Categorías de Servicios
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
 *         description: Categoría actualizada correctamente
 *       404:
 *         description: Categoría no encontrada
 */
router.patch(
  "/categories/:id",
  verificarToken,
  autorizarRoles(["ADMIN"]),
  actualizarCategoria,
);

// Professional services

/**
 * @swagger
 * /api/services/professional-services/by-professional/{professionalId}:
 *   get:
 *     summary: Obtener servicios asociados a un profesional
 *     tags:
 *       - Servicios Profesionales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: professionalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Servicios obtenidos correctamente
 */
router.get(
  "/professional-services/by-professional/:professionalId",
  verificarToken,
  autorizarRoles(["ADMIN", "PROFESSIONAL"]),
  obtenerServiciosPorProfesional,
);

/**
 * @swagger
 * /api/services/professional-services:
 *   post:
 *     summary: Asociar un servicio a un profesional
 *     tags:
 *       - Servicios Profesionales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Asociación creada correctamente
 */
router.post(
  "/professional-services",
  verificarToken,
  autorizarRoles(["ADMIN", "PROFESSIONAL"]),
  crearProfessionalService,
);

/**
 * @swagger
 * /api/services/professional-services/{id}:
 *   patch:
 *     summary: Actualizar asociación entre profesional y servicio
 *     tags:
 *       - Servicios Profesionales
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
 *         description: Asociación actualizada correctamente
 */
router.patch(
  "/professional-services/:id",
  verificarToken,
  autorizarRoles(["ADMIN", "PROFESSIONAL"]),
  actualizarProfessionalService,
);

// Servicios

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Obtener todos los servicios
 *     tags:
 *       - Servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida correctamente
 */
router.get(
  "/",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerServicios,
);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags:
 *       - Servicios
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
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */
router.get(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN", "RECEPTIONIST", "PROFESSIONAL"]),
  obtenerServicioPorId,
);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags:
 *       - Servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post("/", 
  verificarToken, 
  autorizarRoles(["ADMIN"]), 
  crearServicio);

 /**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     summary: Actualizar un servicio
 *     tags:
 *       - Servicios
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
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 */ 
router.patch(
  "/:id",
  verificarToken,
  autorizarRoles(["ADMIN"]),
  actualizarServicio,
);

/**
 * @swagger
 * /api/services/{id}/deactivate:
 *   patch:
 *     summary: Desactivar un servicio
 *     tags:
 *       - Servicios
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
 *         description: Servicio desactivado correctamente
 *       404:
 *         description: Servicio no encontrado
 */
router.patch(
  "/:id/deactivate",
  verificarToken,
  autorizarRoles(["ADMIN"]),
  desactivarServicio,
);

export default router;
