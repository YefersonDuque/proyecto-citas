const express = require("express");

const {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  modificarUsuario,
} = require("../controllers/usuarios.controllers.js");

const router = express.Router();

router.post("/usuarios", crearUsuario);
router.get("/usuarios", obtenerUsuarios);
router.get("/usuarios/:documento", obtenerUsuario);
router.put("/usuarios/:documento", modificarUsuario);

module.exports = router;
