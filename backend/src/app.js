require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./config/logger");
const Conexion = require("./config/database");

const profesionalesRoutes = require("./routes/profesionales.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const citasRoutes = require("./routes/citas.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(profesionalesRoutes);
app.use(usuariosRoutes);
app.use(citasRoutes);

app.get("/saludo", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de citas",
  });
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await Conexion.authenticate();

    logger.info("Conexión con la base de datos establecida correctamente");

    app.listen(PORT, () => {
      console.log("Servidor ejecutándose en http://localhost:3000");
      logger.info("Servidor ejecutandose en http://localhost:3000");
    });
  } catch (error) {
    logger.error("No fue posible conectar con la base de datos", error);
    process.exit(1);
  }
};

iniciarServidor();
