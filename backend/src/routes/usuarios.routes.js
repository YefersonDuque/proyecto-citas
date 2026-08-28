const express = require("express");

const UsuariosController = require("../controllers/usuarios.controllers.js");

const Router = express.Router();

Router.use("/", UsuariosController);

module.exports = Router;
