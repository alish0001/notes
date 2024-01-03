const express = require("express");

const routes = require("../routes/routes");

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use("/api", routes());
  return app;
};
