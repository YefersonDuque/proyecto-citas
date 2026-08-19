const pool = require("../config/database.js");

const obtenerCitasUsuario = async (req, res) => {
  const { documento } = req.params;

  try {
    const usuarioResult = await pool.query(
      `
            SELECT OID FROM USUARIOS WHERE DOCUMENTO = $1
        `,
      [documento],
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const result = await pool.query(
      `
        SELECT 
            B.OID, 
            CONCAT(A.DOCUMENTO,' - ',A.NOMBRE, ' ', A.APELLIDO) PACIENTE, 
            CONCAT(C.NOMBRE, ' ', C.APELLIDO) PROFESIONAL, 
            C.ESPECIALIDAD ESPECIALIDAD,
            B.MOTIVO MOTIVO,
            B.FECHA FECHA_CITA,
            B.HORA HORA_CITA,
            D.ESTADO ESTADO_CITA
        FROM USUARIOS A
        INNER JOIN CITAS B ON B.USUARIO_OID = A.OID
        INNER JOIN PROFESIONAL C ON C.OID = B.PROFESIONAL_OID
        INNER JOIN ESTADOS D ON D.OID = B.ESTADO
        WHERE A.DOCUMENTO = $1
        AND B.ESTADO IN (3,4,5)
    `,
      [documento],
    );
    if (result.rowCount === 0) {
      return res.status(200).json({
        message: "El usuario existe pero no tiene citas registradas",
      });
    }
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al consultar citas:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

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
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }
    const usuarioOid = result.rows[0].oid;
    console.log(usuarioOid);

    const profresionalResult = await pool.query(
      `
            SELECT OID, ESTADO
            FROM PROFESIONAL
            WHERE OID = $1
        `,
      [profesional_oid],
    );

    if (profresionalResult.rows.length === 0) {
      return res.status(404).json({
        message: "Profesional no encontrado",
      });
    }

    if (profresionalResult.rows[0].estado !== 1) {
      return res.status(400).json({
        message: "El profesional no esta activo",
      });
    }
    const profesionalOid = profresionalResult.rows[0].oid;
    console.log(profesionalOid);

    const disponibilidadResul = await pool.query(
      `
        SELECT OID 
        FROM CITAS
        WHERE PROFESIONAL_OID = $1
        AND FECHA = $2
        AND HORA = $3
    `,
      [profesionalOid, fecha, hora],
    );
    if (disponibilidadResul.rows.length > 0) {
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
            VALUES($1, $2,$3,$4,$5,$6)
            RETURNING *
        `,
      [usuarioOid, profesionalOid, fecha, hora, motivo, 3],
    );
    res.status(201).json(agendarCitaResult.rows[0]);
  } catch (error) {
    console.error("Error asignando la cita:", error);
    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const actualizarEstadoCita = async (req, res) => {
  const { oid } = req.params;
  const { estado } = req.body;

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
      return res.status(404).json({
        message: "La cita no existe",
      });
    }

    const estadoActual = result.rows[0].estado;

    console.log("OID de la cita:", oid);
    console.log("Estado actual:", estadoActual);
    console.log("Nuevo estado:", estado);

    if (estadoActual === 3 && estado !== 4 && estado !== 5) {
      return res.status(400).json({
        message: "La cita pendiente solo puede confirmarse o cancelarse",
      });
    }

    if (estadoActual === 4 && estado !== 5) {
      return res.status(400).json({
        message: "La cita confirmada solo puede ser cancelada",
      });
    }

    if (estadoActual === 5) {
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

    return res.status(200).json(resultUpdate.rows[0]);
  } catch (error) {
    console.error("Error al actualizar estado de la cita:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  obtenerCitasUsuario,
  crearCita,
  actualizarEstadoCita,
};
