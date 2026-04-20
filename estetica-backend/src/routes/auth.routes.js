const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");
const verificarToken = require("../middleware/verificarToken");

router.post("/register", register);
router.post("/login", login);

router.get("/me", verificarToken, (req, res) => {
  res.json({
    usuario: req.usuario
  });
});

module.exports = router;