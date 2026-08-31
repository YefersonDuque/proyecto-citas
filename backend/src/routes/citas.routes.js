const express = require("express");

const CitasController = require("../controllers/CitasController.js");

const Router = express.Router();

Router.use("/", CitasController);

module.exports = Router;
