const express = require("express");
const notesRoutes = require("../modules/notes/noteRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const searchRoutes = require("../modules/notes/searchNoteRoutes");
const { NotFoundError } = require("../lib/errors");
const apiRouter = express.Router();

module.exports = () =>
  apiRouter
    .use("/notes", notesRoutes())
    .use("/auth", authRoutes())
    .use("/search", searchRoutes())
    .get("/healthcheck", (req, res) => {
      res.send("Notes service is up and running");
    })
    .all("*", () => {
      throw new NotFoundError();
    });
