// Envuelve un controller async para que cualquier error rechazado
// se reenvíe automáticamente a next() y lo capture el errorHandler central.
// Con esto los controllers ya no necesitan su propio try/catch.
//
//   export const miControlador = asyncHandler(async (req, res) => { ... });
//
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
