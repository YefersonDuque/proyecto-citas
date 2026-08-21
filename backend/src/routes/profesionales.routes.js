const express = require("express");
const {
  consultarProfesionalesActivos,
} = require("../controllers/profesionales.controllers.js");

const router = express.Router();

router.get("/profesionales", consultarProfesionalesActivos);

module.exports = router;
