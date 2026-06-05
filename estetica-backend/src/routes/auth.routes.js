import express from 'express';
import { 
  register, 
  login, 
  perfil, 
  forgotPassword, 
  resetPassword   
} from '../controllers/auth.controller.js';
import verificarToken from '../middleware/verificarToken.js'; 

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@espaciosenda.com
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);

// ¡Ruta reactivada!
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/me', verificarToken, perfil);

// --- RUTAS DE RECUPERACIÓN DE CONTRASEÑA ---

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Email de recuperación enviado
 *       404:
 *         description: Email no encontrado
 */
router.post('/forgot-password', forgotPassword); // Recibe el email y manda el link

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Resetear la contraseña con el token recibido por email
 *     tags:
 *       - Autenticación
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Token inválido o expirado
 */
router.post('/reset-password', resetPassword);   // Recibe el token y la nueva clave

export default router;