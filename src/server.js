const mongoose = require("mongoose");
const logger = require("./config/winston");
const databaseConfig = require("./config/databaseConfig");

const initServer = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(databaseConfig.databaseConnectionString);

  const db = mongoose.connection;
  const PORT = process.env.PORT | 8080;

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
