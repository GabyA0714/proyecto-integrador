const autorizarRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // Extraemos "role" desde "req.user"
      const { role } = req.user;

      if (!rolesPermitidos.includes(role)) {
        return res.status(403).json({
          error: 'Acceso denegado: no tenés permisos para esta acción'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Error en autorización' });
    }
  };
};

export default autorizarRoles;