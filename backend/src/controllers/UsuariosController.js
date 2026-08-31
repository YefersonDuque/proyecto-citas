const express = require("express");
const logger = require("../config/logger.js");
const HttpCodigo = require("../utils/HttpCodigo.js");
const Texto = require("../utils/Texto.js");
const UsuariosService = require("../service/UsuariosService.js");

const UsuariosController = express.Router();

UsuariosController.post("/usuarios", async (req, res) => {
  try {
    const usuarioService = new UsuariosService();
    const resultado = await usuarioService.crearUsuario(req.body);
    return res.status(HttpCodigo.OK).json({ msg: resultado.msg });
  } catch (error) {
    logger.error("Error al crear usuario:", error);
    return res
      .status(HttpCodigo.ERROR_INTERNO_SERVIDOR)
      .json({ msg: Texto.msg.error_interno });
  }
});

UsuariosController.put("/usuarios/:documento", async (req, res) => {
  try {
    const usuarioService = new UsuariosService();
    const resultado = await usuarioService.actualizarUsuario(
      req.params,
      req.body,
    );
    return res.status(HttpCodigo.OK).json({ msg: resultado.msg });
  } catch (error) {
    logger.error("Error al actualizar usuario:", error);
    return res
      .status(HttpCodigo.ERROR_INTERNO_SERVIDOR)
      .json({ msg: Texto.msg.error_interno });
  }
});

UsuariosController.get("/usuarios/:documento", async (req, res) => {
  try {
    const usuarioService = new UsuariosService();
    const resultado = await usuarioService.consultarUsuario(req.params);
    return res.status(HttpCodigo.OK).json({ msg: resultado.msg });
  } catch (error) {
    logger.error("Error al consultar usuario:", error);
    return res
      .status(HttpCodigo.ERROR_INTERNO_SERVIDOR)
      .json({ msg: Texto.msg.error_interno });
  }
});

module.exports = UsuariosController;
