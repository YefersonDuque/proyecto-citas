const pool = require("../config/database");
const logger = require("../config/logger");
const Texto = require("../utils/Texto");
const HttpCodigo = require("../utils/HttpCodigo");
const { ESTADOS_CITA } = require("../constants/estados");

class CitasService {
  async crearCita(body) {
    try {
      const usuario = await pool.query(
        `
                SELECT OID      
                FROM USUARIOS
                WHERE DOCUMENTO = $1
                AND ESTADO = $2
            `,
        [body.documento, 1],
      );

      if (usuario.rows.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: "Usuario no encontrado",
        };
      }

      const usuarioOid = usuario.rows[0].oid;

      const profesionalOid = await pool.query(
        `
                SELECT OID, ESTADO
                FROM PROFESIONAL
                WHERE OID = $1
            `,
        [body.profesional_oid],
      );

      if (profesionalOid.rows.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: "Profesional no encontrado",
        };
      }
      const disponibilidad = await pool.query(
        `
                SELECT OID
                FROM CITAS
                WHERE PROFESIONAL_OID = $1
                AND FECHA = $2
                AND HORA = $3
                AND ESTADO IN ($4, $5)
            `,
        [
          body.profesional_oid,
          body.fecha,
          body.hora,
          ESTADOS_CITA.PENDIENTE,
          ESTADOS_CITA.CONFIRMADA,
        ],
      );

      if (disponibilidad.rows.length > 0) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: "El profesional no está disponible en la fecha y hora seleccionadas",
        };
      }

      const agendarCita = await pool.query(
        `
                INSERT INTO CITAS (
                USUARIO_OID, 
                PROFESIONAL_OID,
                FECHA,
                HORA,
                MOTIVO,
                ESTADO
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                
            `,
        [
          usuarioOid,
          body.profesional_oid,
          body.fecha,
          body.hora,
          body.motivo,
          ESTADOS_CITA.PENDIENTE,
        ],
      );
      return {
        code: HttpCodigo.CREADO,
        msg: "Cita agendada correctamente",
        data: agendarCita.rows[0],
      };
    } catch (error) {
      logger.error("Error al crear cita:", error);
      throw error;
    }
  }

  async consultarCitasUsuario(documento) {
    try {
      const resultado = await pool.query(
        `
        SELECT
          CITAS.OID,
          CONCAT(USUARIOS.NOMBRE, ' ', USUARIOS.APELLIDO) AS PACIENTE,
          CONCAT(PROFESIONAL.NOMBRE, ' ', PROFESIONAL.APELLIDO) AS PROFESIONAL,
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
        WHERE USUARIOS.DOCUMENTO = $1
        ORDER BY CITAS.FECHA DESC, CITAS.HORA DESC
      `,
        [documento],
      );

      return {
        code: HttpCodigo.OK,
        msg: resultado.rows,
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

      if (!Number.isInteger(oidCita) || oidCita <= 0) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: "El identificador de la cita no es válido.",
        };
      }

      const estadosValidos = Object.values(ESTADOS_CITA);

      if (!estadosValidos.includes(nuevoEstado)) {
        return {
          code: HttpCodigo.SOLICITUD_INCORRECTA,
          msg: "El estado de la cita no es válido.",
        };
      }

      const resultadoCita = await pool.query(
        `
        SELECT OID, ESTADO
        FROM CITAS
        WHERE OID = $1
      `,
        [oidCita],
      );

      if (resultadoCita.rows.length === 0) {
        return {
          code: HttpCodigo.NO_ENCONTRADO,
          msg: "Cita no encontrada.",
        };
      }

      const estadoActual = resultadoCita.rows[0].estado;

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
          msg: "No es posible realizar este cambio de estado.",
        };
      }

      const resultado = await pool.query(
        `
        UPDATE CITAS
        SET ESTADO = $1
        WHERE OID = $2
        RETURNING *
      `,
        [nuevoEstado, oidCita],
      );

      return {
        code: HttpCodigo.OK,
        msg: "Estado de la cita actualizado correctamente.",
        data: resultado.rows[0],
      };
    } catch (error) {
      logger.error("Error al actualizar el estado de la cita:", error);
      throw error;
    }
  }
}
module.exports = CitasService;
