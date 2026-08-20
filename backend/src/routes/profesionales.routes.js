const express = require("express");
const {
  obtenerProfesionalesActivos,
} = require("../controllers/profesionales.controllers.js");

const router = express.Router();

router.get("/profesionales", obtenerProfesionalesActivos);

module.exports = router;
