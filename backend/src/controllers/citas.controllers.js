const pool = require("../config/database.js");
const logger = require("../config/logger.js");

const crearCita = async (req, res) => {
  const { documento, profesional_oid, fecha, hora, motivo } = req.body;

  if (!documento || !profesional_oid || !fecha || !hora) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios",
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT OID 
        FROM USUARIOS 
        WHERE DOCUMENTO = $1
      `,
      [documento],
    );

    if (result.rows.length === 0) {
      logger.warn("Usuario no encontrado al intentar crear una cita", {
        documento,
      });

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const usuarioOid = result.rows[0].oid;

    const profesionalResult = await pool.query(
      `
        SELECT OID, ESTADO
        FROM PROFESIONAL
        WHERE OID = $1
      `,
      [profesional_oid],
    );

    if (profesionalResult.rows.length === 0) {
      logger.warn("Profesional no encontrado", {
        profesionalOid: profesional_oid,
      });

      return res.status(404).json({
        message: "Profesional no encontrado",
      });
    }

    if (profesionalResult.rows[0].estado !== 1) {
      logger.warn("El profesional no está activo", {
        profesionalOid: profesional_oid,
      });

      return res.status(400).json({
        message: "El profesional no esta activo",
      });
    }

    const profesionalOid = profesionalResult.rows[0].oid;

    const disponibilidadResult = await pool.query(
      `
        SELECT OID 
        FROM CITAS
        WHERE PROFESIONAL_OID = $1
        AND FECHA = $2
        AND HORA = $3
      `,
      [profesionalOid, fecha, hora],
    );

    if (disponibilidadResult.rows.length > 0) {
      logger.warn("El profesional ya tiene una cita en esta fecha y hora", {
        profesionalOid,
        fecha,
        hora,
      });

      return res.status(409).json({
        message: "Este profesional, ya tiene una cita en esta fecha y hora.",
      });
    }

    const agendarCitaResult = await pool.query(
      `
        INSERT INTO CITAS(
          USUARIO_OID, 
          PROFESIONAL_OID,
          FECHA,
          HORA,
          MOTIVO,
          ESTADO
        )
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [usuarioOid, profesionalOid, fecha, hora, motivo, 3],
    );

    logger.info("Cita asignada correctamente", {
      usuarioOid,
      profesionalOid,
      fecha,
      hora,
      motivo,
    });

    return res.status(201).json(agendarCitaResult.rows[0]);
  } catch (error) {
    logger.error("Error al asignar la cita", {
      error: error.message,
      codigo: error.code,
      documento,
      profesionalOid: profesional_oid,
      fecha,
      hora,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const actualizarEstadoCita = async (req, res) => {
  const { oid } = req.params;
  const { estado } = req.body;

  const estadosPermitidos = [3, 4, 5];

  if (!estadosPermitidos.includes(estado)) {
    logger.warn("Intento de asignar un estado no válido a una cita", {
      oid,
      estado,
    });

    return res.status(400).json({
      message: "El estado de la cita no es válido",
    });
  }

  try {
    const result = await pool.query(
      `
        SELECT OID, ESTADO
        FROM CITAS
        WHERE OID = $1
      `,
      [oid],
    );

    if (result.rows.length === 0) {
      logger.warn("La cita no existe", {
        oid,
      });

      return res.status(404).json({
        message: "La cita no existe",
      });
    }

    const estadoActual = result.rows[0].estado;

    if (estadoActual === 3 && estado !== 4 && estado !== 5) {
      logger.warn("La cita pendiente solo puede confirmarse o cancelarse", {
        oid,
        estadoActual,
        estadoNuevo: estado,
      });

      return res.status(400).json({
        message: "La cita pendiente solo puede confirmarse o cancelarse",
      });
    }

    if (estadoActual === 4 && estado !== 5) {
      logger.warn("La cita confirmada solo puede ser cancelada", {
        oid,
        estadoActual,
        estadoNuevo: estado,
      });

      return res.status(400).json({
        message: "La cita confirmada solo puede ser cancelada",
      });
    }

    if (estadoActual === 5) {
      logger.warn("La cita ya fue cancelada y no puede modificarse", {
        oid,
        estadoActual,
        estadoNuevo: estado,
      });

      return res.status(400).json({
        message: "La cita ya fue cancelada y no puede modificarse",
      });
    }

    const resultUpdate = await pool.query(
      `
        UPDATE CITAS
        SET ESTADO = $1,
            FECHA_ACTUALIZA = CURRENT_TIMESTAMP
        WHERE OID = $2
        RETURNING *
      `,
      [estado, oid],
    );

    logger.info("Estado de cita actualizado correctamente", {
      oid,
      estadoAnterior: estadoActual,
      estadoNuevo: estado,
    });

    return res.status(200).json(resultUpdate.rows[0]);
  } catch (error) {
    logger.error("Error al actualizar estado de la cita", {
      error: error.message,
      codigo: error.code,
      estado,
      oid,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const consultarCitasUsuario = async (req, res) => {
  const { documento } = req.params;

  try {
    const usuarioResult = await pool.query(
      `
        SELECT OID
        FROM USUARIOS
        WHERE DOCUMENTO = $1
      `,
      [documento],
    );

    if (usuarioResult.rows.length === 0) {
      logger.warn("Usuario no encontrado al consultar sus citas", {
        documento,
      });

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const result = await pool.query(
      `
        SELECT 
          CITAS.OID, 
          CONCAT(
            USUARIOS.DOCUMENTO,
            ' - ',
            USUARIOS.NOMBRE,
            ' ',
            USUARIOS.APELLIDO
          ) PACIENTE, 
          CONCAT(
            PROFESIONAL.NOMBRE,
            ' ',
            PROFESIONAL.APELLIDO
          ) PROFESIONAL, 
          PROFESIONAL.ESPECIALIDAD ESPECIALIDAD,
          CITAS.MOTIVO MOTIVO, 
          CITAS.FECHA FECHA_CITA,
          CITAS.HORA HORA_CITA,
          ESTADOS.ESTADO ESTADO_CITA
        FROM USUARIOS 
        INNER JOIN CITAS 
          ON CITAS.USUARIO_OID = USUARIOS.OID
        INNER JOIN PROFESIONAL 
          ON PROFESIONAL.OID = CITAS.PROFESIONAL_OID
        INNER JOIN ESTADOS 
          ON ESTADOS.OID = CITAS.ESTADO
        WHERE USUARIOS.DOCUMENTO = $1
      `,
      [documento],
    );

    if (result.rowCount === 0) {
      logger.info("Usuario consultado correctamente, pero no tiene citas", {
        documento,
      });

      return res.status(200).json([]);
    }

    logger.info("Citas del usuario consultadas correctamente", {
      documento,
      cantidad: result.rowCount,
    });

    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error("Error al consultar las citas", {
      error: error.message,
      codigo: error.code,
      documento,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  crearCita,
  actualizarEstadoCita,
  consultarCitasUsuario,
};
