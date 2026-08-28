const Conexion = require("../config/database");
const logger = require("../config/logger");
const Texto = require("../utils/Texto");
const HttpCodigo = require("../utils/HttpCodigo");
const { ESTADOS_CITA } = require("../constants/estados");

class CitasService {
  async crearCita(body) {
    try {
      /* Buscar usuario */
      const usuario = await Conexion.query(
        `
        SELECT OID
        FROM USUARIOS
        WHERE DOCUMENTO = '${body.documento}'
        AND ESTADO = 1;
        `,
        {
          type: Conexion.QueryTypes.SELECT,
        },
      );

      if (usuario.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: Texto.msg.sin_registros,
        };
      }

      const usuarioOid = usuario[0].oid;

      /* Buscar profesional */
      const profesional = await Conexion.query(
        `
        SELECT OID, ESTADO
        FROM PROFESIONAL
        WHERE OID = ${body.profesional_oid}
        AND ESTADO = 1;
        `,
        {
          type: Conexion.QueryTypes.SELECT,
        },
      );

      if (profesional.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: Texto.msg.sin_registros,
        };
      }

      /* Validar disponibilidad */
      const disponibilidad = await Conexion.query(
        `
        SELECT OID
        FROM CITAS
        WHERE PROFESIONAL_OID = ${body.profesional_oid}
        AND FECHA = '${body.fecha}'
        AND HORA = '${body.hora}'
        AND ESTADO IN (3, 4);
        `,
        {
          type: Conexion.QueryTypes.SELECT,
        },
      );

      if (disponibilidad.length > 0) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: Texto.msg.no_disponible,
        };
      }

      /* Crear cita */
      await Conexion.query(
        `
        INSERT INTO CITAS (
          USUARIO_OID,
          PROFESIONAL_OID,
          FECHA,
          HORA,
          MOTIVO,
          ESTADO
        )
        VALUES (
          ${usuarioOid},
          ${body.profesional_oid},
          '${body.fecha}',
          '${body.hora}',
          '${body.motivo}',
          3
        );
        `,
        {
          type: Conexion.QueryTypes.INSERT,
        },
      );

      return {
        code: HttpCodigo.CREADO,
        msg: Texto.msg.cita_agendada,
      };
    } catch (error) {
      logger.error("Error al crear cita:", error);
      throw error;
    }
  }

  async consultarCitasUsuario(documento) {
    try {
      const resultado = await Conexion.query(
        `
      SELECT
        CITAS.OID,
        CONCAT(
          USUARIOS.NOMBRE,
          ' ',
          USUARIOS.APELLIDO
        ) AS PACIENTE,
        CONCAT(
          PROFESIONAL.NOMBRE,
          ' ',
          PROFESIONAL.APELLIDO
        ) AS PROFESIONAL,
        PROFESIONAL.ESPECIALIDAD,
        CITAS.MOTIVO,
        CITAS.FECHA AS FECHA_CITA,
        CITAS.HORA AS HORA_CITA,
        CITAS.ESTADO AS ESTADO_CITA
      FROM CITAS
      INNER JOIN USUARIOS
        ON USUARIOS.OID = CITAS.USUARIO_OID
      INNER JOIN PROFESIONAL
        ON PROFESIONAL.OID = CITAS.PROFESIONAL_OID
      WHERE USUARIOS.DOCUMENTO = '${documento}'
      ORDER BY CITAS.FECHA DESC, CITAS.HORA DESC;
      `,
        {
          type: Conexion.QueryTypes.SELECT,
        },
      );

      logger.info("Citas del usuario consultadas correctamente", {
        documento,
        cantidad: resultado.length,
      });

      return {
        code: HttpCodigo.OK,
        msg: resultado,
      };
    } catch (error) {
      logger.error("Error al consultar las citas del usuario:", error);
      throw error;
    }
  }

  async actualizarEstadoCita(oid, estado) {
    try {
      const oidCita = Number(oid);
      const nuevoEstado = Number(estado);

      /* Validar OID */
      if (!Number.isInteger(oidCita) || oidCita <= 0) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: Texto.msg.id_invalido,
        };
      }

      /* Validar estado */
      const estadosValidos = Object.values(ESTADOS_CITA);

      if (!estadosValidos.includes(nuevoEstado)) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: Text.msg.estado_incalido,
        };
      }

      /* Buscar cita */
      const resultadoCita = await Conexion.query(
        `
        SELECT OID, ESTADO
        FROM CITAS
        WHERE OID = ${oidCita};
        `,
        {
          type: Conexion.QueryTypes.SELECT,
        },
      );

      if (resultadoCita.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: Texto.msg.sin_registros,
        };
      }

      const estadoActual = resultadoCita[0].estado;

      /* Estados permitidos */
      const transicionesPermitidas = {
        [ESTADOS_CITA.PENDIENTE]: [
          ESTADOS_CITA.CONFIRMADA,
          ESTADOS_CITA.CANCELADA,
        ],

        [ESTADOS_CITA.CONFIRMADA]: [
          ESTADOS_CITA.ATENDIDA,
          ESTADOS_CITA.CANCELADA,
        ],
      };

      const estadosPermitidos = transicionesPermitidas[estadoActual] ?? [];

      if (!estadosPermitidos.includes(nuevoEstado)) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: Texto.msg.codigo_invalido,
        };
      }

      /* Actualizar estado */
      await Conexion.query(
        `
        UPDATE CITAS
        SET ESTADO = ${nuevoEstado}
        WHERE OID = ${oidCita};
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
      logger.error("Error al actualizar el estado de la cita:", error);
      throw error;
    }
  }
}

module.exports = CitasService;
