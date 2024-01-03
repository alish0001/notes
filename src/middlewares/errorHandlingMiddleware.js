const { getErrorMessage } = require("../lib/errors");
const moment = require("moment");

const errorHandlingMiddleware = (err, req, res, next) => {
  if (!err) return next();
  const errors = getErrorMessage(err);
  return res.status(errors.status).send({
    success: false,
    message: errors.message,
    data: "",
    timestamp: moment(Date.now()).format("DD-MM-YYYY HH:mm:ss"),
  });
};

module.exports = errorHandlingMiddleware;
