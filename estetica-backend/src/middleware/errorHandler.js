// ============================================================
// ESPACIO SENDA — middleware/errorHandler.js
// Manejador de errores central. Va al final de app.js (después de
// las rutas). Captura todo lo que los controllers reenvíen vía next()
// gracias a asyncHandler.
//
// Reemplaza los ~70 try/catch repetidos por un único lugar, y mapea
// los códigos de error conocidos de Prisma a respuestas HTTP claras.
// ============================================================

const errorHandler = (err, req, res, next) => {
  // Log para el servidor (no se expone al cliente)
  console.error('🔥', err);

  // Error de aplicación lanzado a propósito (AppError) -> respeta su status
  if (err.status) {
    return res.status(err.status).json({ mensaje: err.message });
  }

  // Errores conocidos de Prisma (PrismaClientKnownRequestError -> err.code)
  switch (err.code) {
    case 'P2002': // violación de restricción única
      return res
        .status(409)
        .json({ mensaje: 'Ya existe un registro con ese valor único' });
    case 'P2025': // registro a actualizar/eliminar no encontrado
      return res.status(404).json({ mensaje: 'Registro no encontrado' });
    case 'P2003': // violación de clave foránea
      return res
        .status(400)
        .json({ mensaje: 'Referencia inválida: el registro relacionado no existe' });
    default:
      break;
  }

  // Fallback genérico
  return res.status(500).json({ error: 'Error interno del servidor' });
};

export default errorHandler;
