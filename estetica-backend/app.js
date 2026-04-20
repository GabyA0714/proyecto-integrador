const express = require("express");
const cors = require("cors"); // <-- 1. Importamos
const app = express();

// --- MIDDLEWARES GLOBALES (Tienen que ir arriba de todo) ---
app.use(cors()); // <-- 2. Habilitamos CORS antes que nada
app.use(express.json());

// --- RUTAS ---
const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);

// --- TEST ---
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// --- SERVIDOR ---
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});