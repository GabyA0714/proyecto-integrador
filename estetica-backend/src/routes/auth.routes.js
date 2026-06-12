import express from 'express';
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import {
  register,
  login,
  perfil,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';
import verificarToken from '../middleware/verificarToken.js';

const router = express.Router();

// ==========================================
// CONFIGURACIÓN DE SEGURIDAD (RATE LIMITING)
// ==========================================

// Límite general por IP (usa ipKeyGenerator para no romper con IPv6 en v7).
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  keyGenerator: (req, res) => ipKeyGenerator(req, res),
  message: { message: "Demasiados intentos desde esta IP, intentá más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Bloqueo de fuerza bruta en el login (5 intentos FALLIDOS por cuenta).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  max: 5,
  // Solo cuentan los intentos fallidos: un login exitoso no suma ni bloquea.
  skipSuccessfulRequests: true,
  // Limitamos por cuenta (email), no por IP. En la clínica todos comparten la
  // misma IP, así que limitar por IP bloqueaba a unos por los errores de otros.
  // Si no viene email, caemos al IP normalizado (ipKeyGenerator) para no romper
  // con IPv6 en express-rate-limit v7.
  keyGenerator: (req, res) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    return email || ipKeyGenerator(req, res);
  },
  message: { message: "Demasiados intentos fallidos para esta cuenta. Por seguridad, esperá 15 minutos antes de volver a intentar." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Bloqueo para evitar spam de correos de recuperación (3 intentos max).
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora de bloqueo
  max: 3, // Límite de 3 intentos por IP
  keyGenerator: (req, res) => ipKeyGenerator(req, res),
  message: { message: "Demasiados intentos de recuperación. Esperá 1 hora." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @swagger
 *  /api/auth/register:
 *    post:
 *      summary: Registrar un nuevo usuario
 *      tags:
 *        - Autenticación
 *      responses:
 *      201:
 *        description: Usuario registrado correctamente
 *      400:
 *    description: Datos inválidos
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
 *       429:
 *         description: Demasiados intentos fallidos
 */
router.post('/login', loginLimiter, login);

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
router.post('/forgot-password', emailLimiter, forgotPassword);

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
router.post('/reset-password', resetPassword);

export default router;