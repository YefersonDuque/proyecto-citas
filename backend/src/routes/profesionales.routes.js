const express = require("express");
const {
  obtenerProfesionales,
} = require("../controllers/profesionales.controllers.js");

const router = express.Router();

router.get("/profesionales", obtenerProfesionales);

module.exports = router;
