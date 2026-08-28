const express = require("express");
const logger = require("../config/logger.js");
const HttpCodigo = require("../utils/HttpCodigo");
const Texto = require("../utils/Texto");
const ProfesionalesService = require("../service/ProfesionalesService");

const ProfesionalController = express.Router();

ProfesionalController.get("/profesionales", async (req, res) => {
  try {
    const profesionalesService = new ProfesionalesService();
    const resultado =
      await profesionalesService.consultarProfesionalesActivos();
    return res.status(HttpCodigo.OK).json({ msg: resultado.msg });
  } catch (error) {
    logger.error("Error al consultar los profesionales", {
      error: error.message,
      codigo: error.code,
    });
    return res
      .status(HttpCodigo.ERROR_INTERNO_SERVIDOR)
      .json({ msg: Texto.msg.error_interno });
  }
});

module.exports = ProfesionalController;
