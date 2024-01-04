const express = require("express");
const notesRoutes = require("../modules/notes/noteRoutes");
const authRoutes = require("../modules/auth/authRoutes");
const { NotFoundError } = require("../lib/errors");
const apiRouter = express.Router();

module.exports = () =>
  apiRouter
    .use("/notes", notesRoutes())
    .use("/auth", authRoutes())
    .get("/healthcheck", (req, res) => {
      res.send("Notes service is up and running");
    })
    .all("*", () => {
      throw new NotFoundError();
    });
