const express = require("express");
const logger = require("../config/logger.js");
const Texto = require("../utils/Texto.js");
const HttpCodigo = require("../utils/HttpCodigo.js");
const CitasService = require("../service/CitasService.js");

const CitasController = express.Router();

CitasController.post("/citas", async (req, res) => {
  try {
    const citasService = new CitasService();
    const resultado = await citasService.crearCita(req.body);

    return res.status(resultado.code).json({
      msg: resultado.msg,
    });
  } catch (error) {
    logger.error("Error al crear cita:", error);

    return res.status(HttpCodigo.ERROR_INTERNO_SERVIDOR).json({
      msg: Texto.msg.error_interno,
    });
  }
});

CitasController.get("/usuarios/:documento/citas", async (req, res) => {
  try {
    const citasService = new CitasService();
    const resultado = await citasService.consultarCitasUsuario(
      req.params.documento,
    );

    return res.status(resultado.code).json({
      msg: resultado.msg,
    });
  } catch (error) {
    logger.error("Error al consultar las citas del usuario:", error);

    return res.status(HttpCodigo.ERROR_INTERNO_SERVIDOR).json({
      msg: Texto.msg.error_interno,
    });
  }
});

CitasController.put("/citas/:oid", async (req, res) => {
  try {
    const citasService = new CitasService();
    const resultado = await citasService.actualizarEstadoCita(
      req.params.oid,
      req.body.estado,
    );

    return res.status(resultado.code).json({
      msg: resultado.msg,
    });
  } catch (error) {
    logger.error("Error al actualizar el estado de la cita:", error);

    return res.status(HttpCodigo.ERROR_INTERNO_SERVIDOR).json({
      msg: Texto.msg.error_interno,
    });
  }
});

module.exports = CitasController;
