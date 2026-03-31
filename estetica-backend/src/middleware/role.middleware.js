const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const { rol } = req.usuario;

      // Verificar si el rol está permitido
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({
          error: "Acceso denegado: no tenés permisos"
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({ error: "Error en autorización" });
    }
  };
};

module.exports = autorizarRoles;