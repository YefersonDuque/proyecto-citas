const Conexion = require("../config/database");
const logger = require("../config/logger");
const Texto = require("../utils/Texto");
const HttpCodigo = require("../utils/HttpCodigo");

class UsuariosService {
  async crearUsuario(body) {
    try {
      await Conexion.query(
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
        VALUES (
        '${body.documento}',
        '${body.nombre}',
        '${body.apellido}',
        '${body.telefono}',
        '${body.correo}',
        '${body.fecha_nacimiento}',
        1
        );
      `,
        {
          type: Conexion.QueryTypes.INSERT,
        },
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
      const resultado = await Conexion.query(
        `
        UPDATE USUARIOS
        SET
          NOMBRE = '${body.nombre}',
          APELLIDO = '${body.apellido}',
          TELEFONO = '${body.telefono}',
          CORREO = '${body.correo}',
          FECHA_NACIMIENTO = '${body.fecha_nacimiento}',
          FECHA_ACTUALIZA = CURRENT_TIMESTAMP
        WHERE DOCUMENTO = '${user.documento}'
          AND ESTADO = 1
        RETURNING *;
      `,
        {
          type: Conexion.QueryTypes.UPDATE,
        },
      );

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
      const resultado = await Conexion.query(
        `
        SELECT
          DOCUMENTO,
          NOMBRE,
          APELLIDO,
          TELEFONO,
          CORREO,
          FECHA_NACIMIENTO
        FROM USUARIOS
        WHERE DOCUMENTO = '${params.documento}'
        AND ESTADO = 1
      `,
        { type: Conexion.QueryTypes.SELECT },
      );
      if (resultado.length === 0) {
        return {
          code: HttpCodigo.OK,
          msg: 0,
        };
      }
      return {
        code: HttpCodigo.OK,
        msg: resultado,
      };
    } catch (error) {
      logger.error("Error al consultar usuario:", error);
      throw error;
    }
  }
}

module.exports = UsuariosService;
