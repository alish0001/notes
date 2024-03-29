const mongoose = require("mongoose");
const logger = require("./config/winston");
const databaseConfig = require("./config/databaseConfig");
const serverConfig = require("./config/serverConfig");

const initServer = () => {
  if (!serverConfig.dbUri) {
    logger.error("Please provide database URI in env file");
    return;
  }
  if (!serverConfig.accessToken) {
    logger.error("Please provide accessToken in env file");
    return;
  }
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseConfig.databaseConnectionString);

  const db = mongoose.connection;
  const PORT = serverConfig.port;

  db.on("error", (err) => {
    logger.error("Mongoose Error", err);
  });
  db.once("open", async () => {
    const setupExpress = require("./config/express");
    const app = setupExpress();

    app.listen(PORT, () => {
      logger.info(`Server is listening on PORT: ${PORT}`);
    });
  });
};

module.exports = initServer;
