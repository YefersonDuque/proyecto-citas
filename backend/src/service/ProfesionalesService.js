const Conexion = require("../config/database.js");
const logger = require("../config/logger.js");
const Texto = require("../utils/Texto");
const HttpCodigo = require("../utils/HttpCodigo.js");

class ProfesionalesService {
  async consultarProfesionalesActivos() {
    try {
      const resultado = await Conexion.query(
        `
                SELECT 
                OID, 
                CONCAT(NOMBRE, ' ',APELLIDO, ' - ', ESPECIALIDAD) PROFESIONAL
                FROM PROFESIONAL
                WHERE ESTADO = 1
                ORDER BY NOMBRE, APELLIDO
            `,
        { type: Conexion.QueryTypes.SELECT },
      );
      return {
        code: HttpCodigo.OK,
        msg: resultado,
      };
    } catch (error) {
      logger.error("Error al consultar los profesionales", {
        error: error.message,
        codigo: error.code,
      });
      throw error;
    }
  }
}

module.exports = ProfesionalesService;
