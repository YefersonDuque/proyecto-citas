const pool = require("../config/database");
const logger = require("../config/logger");
const Texto  = require("../utils/Texto");
const HttpCodigo = require("../utils/HttpCodigo");

class UsuariosService {
  async CrearUsuario(body) {
    try {
      await pool.query(
        `
        INSERT INTO USUARIOS(
          DOCUMENTO,
          NOMBRE,
          APELLIDO,
          TELEFONO,
          CORREO,
          FECHA_NACIMIENTO,
          ESTADO
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `,
        [
          body.documento,
          body.nombre,
          body.apellido,
          body.telefono,
          body.correo,
          body.fecha_nacimiento,
          1,
        ],
      );

      return {
        code: HttpCodigo.OK,
        msg: Texto.msg.registro_creado,
      };
    } catch (error) {
      logger.error("Error al crear usuario:", error);
      throw error;
    }
  }

  async actualizarUsuario(user, body) {
    try {
      const resultado = await pool.query(
        `
        UPDATE USUARIOS
        SET
          NOMBRE = $1,
          APELLIDO = $2,
          TELEFONO = $3,
          CORREO = $4,
          FECHA_NACIMIENTO = $5,
          FECHA_ACTUALIZA = CURRENT_TIMESTAMP
        WHERE DOCUMENTO = $6
          AND ESTADO = $7
        RETURNING *
      `,
        [
          body.nombre,
          body.apellido,
          body.telefono,
          body.correo,
          body.fecha_nacimiento,
          user.documento,
          1,
        ],
      );

      if (resultado.rows.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: "Usuario no encontrado",
        };
      }

      return {
        code: HttpCodigo.OK,
        msg: Texto.msg.registro_actualizado,
      };
    } catch (error) {
      logger.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  async consultarUsuario(params) {
    try {
      const resultado = await pool.query(
        `
        SELECT
          DOCUMENTO,
          NOMBRE,
          APELLIDO,
          TELEFONO,
          CORREO,
          FECHA_NACIMIENTO
        FROM USUARIOS
        WHERE DOCUMENTO = $1
        AND ESTADO = $2
      `,
        [params.documento, 1],
      );
      if (resultado.rows.length === 0) {
        return {
          code: HttpCodigo.OK,
          msg: 0,
        };
      }
      return {
        code: HttpCodigo.OK,
        msg: resultado.rows,
      };
    } catch (error) {
      logger.error("Error al consultar usuario:", error);
      throw error;
    }
  }
}

module.exports = UsuariosService;
