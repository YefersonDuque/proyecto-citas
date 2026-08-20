const pool = require("../config/database.js");

const obtenerProfesionalesActivos = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT OID, 
          CONCAT(NOMBRE,' ',APELLIDO,' - ',ESPECIALIDAD) PROFESIONAL
        FROM PROFESIONAL
        WHERE ESTADO = 1
        ORDER BY NOMBRE, APELLIDO`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar profesionales:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = { obtenerProfesionalesActivos };
