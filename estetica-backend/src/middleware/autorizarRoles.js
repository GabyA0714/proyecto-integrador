const autorizarRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const { rol } = req.usuario;

      if (!rolesPermitidos.includes(rol)) {
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