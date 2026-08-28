const express = require("express");
const ProfesionalController = require("../controllers/profesionales.controllers.js");

const Router = express.Router();

Router.use("/", ProfesionalController);

module.exports = Router;
