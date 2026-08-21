const express = require("express");

const {
  crearUsuario,
  consultarUsuario,
  actualizarUsuario,
} = require("../controllers/usuarios.controllers.js");

const router = express.Router();

router.post("/usuarios", crearUsuario);
router.put("/usuarios/:documento", actualizarUsuario);
router.get("/usuarios/:documento", consultarUsuario);

module.exports = router;
