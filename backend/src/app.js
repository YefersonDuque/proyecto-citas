require("dotenv").config();

const express = require("express");

const profesionalesRoutes = require("./routes/profesionales.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const citasRoutes = require("./routes/citas.routes");

const app = express();
app.use(express.json());

app.use(profesionalesRoutes);
app.use(usuariosRoutes);
app.use(citasRoutes);

app.get("/saludo", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de citas",
  });
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
