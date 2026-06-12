// Error de aplicación con código HTTP. Permite lanzar errores "de negocio"
// desde un controller y que el errorHandler central use ese status/mensaje.
//
//   if (yaExiste) throw new AppError('Ya existe una categoría con ese nombre', 409);
//
export default class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}
