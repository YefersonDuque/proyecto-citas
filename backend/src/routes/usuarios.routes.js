const express = require("express");

const UsuariosController = require("../controllers/UsuariosController.js");

const Router = express.Router();

Router.use("/", UsuariosController);

module.exports = Router;
