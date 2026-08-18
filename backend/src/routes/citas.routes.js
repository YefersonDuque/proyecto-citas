const express = require("express");

const {
  obtenerCitasUsuario,
  crearCita,
} = require("../controllers/citas.controllers");

const router = express.Router();

router.get("/usuarios/:documento/citas", obtenerCitasUsuario);
router.post("/citas", crearCita);

module.exports = router;
