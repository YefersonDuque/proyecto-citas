const express = require("express");

const {
  obtenerCitasUsuario,
  crearCita,
  actualizarEstadoCita,
} = require("../controllers/citas.controllers");

const router = express.Router();

router.get("/usuarios/:documento/citas", obtenerCitasUsuario);
router.post("/citas", crearCita);
router.put("/citas/:oid", actualizarEstadoCita);

module.exports = router;
