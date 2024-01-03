const express = require("express");
const notesRoutes = require("../modules/notes/noteRoutes");
const apiRouter = express.Router();

module.exports = () => apiRouter.use("/notes", notesRoutes());
