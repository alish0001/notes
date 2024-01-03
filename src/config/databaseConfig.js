require("dotenv").config();

module.exports = {
  databaseConnectionString: process.env.MONGO_DB_URI,
};
