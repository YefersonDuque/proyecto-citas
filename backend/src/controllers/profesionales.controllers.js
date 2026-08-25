const pool = require("../config/database.js");
const logger = require("../config/logger.js");

const consultarProfesionalesActivos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        OID, 
        CONCAT(NOMBRE, ' ',APELLIDO,' - ',ESPECIALIDAD) PROFESIONAL
      FROM PROFESIONAL
      WHERE ESTADO = 1
      ORDER BY NOMBRE, APELLIDO
    `);

    logger.info("Profesionales consultados correctamente", {
      cantidad: result.rowCount,
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error("Error al consultar los profesionales", {
      error: error.message,
      codigo: error.code,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  consultarProfesionalesActivos,
};
