const express = require("express");
const {
  obtenerProfesionales,
} = require("../controllers/profesionales.controller.js");

const router = express.Router();

router.get("/profesionales", obtenerProfesionales);

module.exports = router;
