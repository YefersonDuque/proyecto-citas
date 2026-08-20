const pool = require("../config/database.js");

const obtenerProfesionales = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM PROFESIONAL");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar profesionales:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = { obtenerProfesionales };
