const express = require("express");

const CitasController = require("../controllers/citas.controllers.js");

const Router = express.Router();

Router.use("/", CitasController);

module.exports = Router;
