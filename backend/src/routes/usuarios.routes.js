const express = require("express");

const UsuariosController = require("../controllers/usuarios.controllers.js");

const router = express.Router();

router.use("/", UsuariosController);

module.exports = router;
