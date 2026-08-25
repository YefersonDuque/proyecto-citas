const pool = require("../config/database.js");
const logger = require("../config/logger.js");
const { validarDatosUsuario } = require("../utils/usuarios.validaciones");

const crearUsuario = async (req, res) => {
  const { documento, nombre, apellido, telefono, correo, fecha_nacimiento } =
    req.body;

  const errorValidacion = validarDatosUsuario({
    documento,
    nombre,
    apellido,
    telefono,
    correo,
    fecha_nacimiento,
  });

  if (errorValidacion) {
    return res.status(400).json({
      message: errorValidacion,
    });
  }

  try {
    const result = await pool.query(
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
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [documento, nombre, apellido, telefono, correo, fecha_nacimiento, 1],
    );

    logger.info("Usuario creado correctamente", {
      documento,
    });

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      logger.warn("Intento de registrar un documento existente", {
        documento,
      });

      return res.status(409).json({
        message: "El documento ya está registrado",
      });
    }

    logger.error("Error al crear el usuario", {
      error: error.message,
      codigo: error.code,
      documento,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const actualizarUsuario = async (req, res) => {
  const { nombre, apellido, telefono, correo, fecha_nacimiento } = req.body;

  const { documento } = req.params;

  const errorValidacion = validarDatosUsuario({
    documento,
    nombre,
    apellido,
    telefono,
    correo,
    fecha_nacimiento,
  });

  if (errorValidacion) {
    return res.status(400).json({
      message: errorValidacion,
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE USUARIOS
        SET NOMBRE = $1,
            APELLIDO = $2,
            TELEFONO = $3,
            CORREO = $4,
            FECHA_NACIMIENTO = $5,
            FECHA_ACTUALIZA = CURRENT_TIMESTAMP
        WHERE DOCUMENTO = $6
        RETURNING *
      `,
      [nombre, apellido, telefono, correo, fecha_nacimiento, documento],
    );

    if (result.rowCount === 0) {
      logger.warn("Intento de actualizar usuario inexistente", {
        documento,
      });

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    logger.info("Usuario actualizado correctamente", {
      documento,
    });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error("Error al actualizar usuario", {
      error: error.message,
      codigo: error.code,
      documento,
    });

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

const consultarUsuario = async (req, res) => {
  const { documento } = req.params;

  if (!documento) {
    return res.status(400).json({
      message: "El documento es obligatorio",
    });
  }

  if (documento.length > 20) {
    return res.status(400).json({
      message: "El documento no puede superar los 20 caracteres",
    });
  }

  try {
    const result = await pool.query(
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
        AND ESTADO = 1
      `,
      [documento],
    );

    if (result.rows.length === 0) {
      logger.warn("Usuario no encontrado", {
        documento,
      });

      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    logger.info("Usuario consultado correctamente", {
      documento,
    });

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    logger.error("Error al consultar el usuario", {
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
  crearUsuario,
  consultarUsuario,
  actualizarUsuario,
};
