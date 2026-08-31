const express = require("express");
const ProfesionalController = require("../controllers/ProfesionalController.js");

const Router = express.Router();

Router.use("/", ProfesionalController);

module.exports = Router;
