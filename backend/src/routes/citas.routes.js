const express = require("express");

const {
  crearCita,
  actualizarEstadoCita,
  consultarCitasUsuario,
} = require("../controllers/citas.controllers");

const router = express.Router();

router.post("/citas", crearCita);
router.put("/citas/:oid", actualizarEstadoCita);
router.get("/usuarios/:documento/citas", consultarCitasUsuario);

module.exports = router;
