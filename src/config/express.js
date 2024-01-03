const express = require("express");
const bodyParser = require("body-parser");

const routes = require("../routes/routes");
const errorHandlingMiddleware = require("../middlewares/errorHandlingMiddleware");

module.exports = () => {
  const app = express();
  app.use(express.json());
  app.use("/api", routes());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(errorHandlingMiddleware);
  return app;
};
