const logger = require("../config/winston");

class HttpError extends Error {}
class CustomBadRequestError extends HttpError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "Invalid request";
    this.status = 400;
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message || "Not found";
    this.status = 404;
  }
}
function getErrorMessage(err) {
  if (err instanceof HttpError) {
    return {
      message: err.message,
      status: err.status,
      timestamp: Date.now(),
    };
  }
  if (
    err.stack.match(/^SyntaxError:.+in JSON(.|\n)*node_modules\/body-parser/)
  ) {
    return {
      message:
        process.env.NODE_ENV === "development"
          ? `Bad JSON in HTTP request. ${err.message}:  ${err.body}`
          : "The data received by the server is not properly formatted. Try refreshing your browser.",
      status: 400,
    };
  }
  logger.error(err);
  return {
    message: "Something Went Wrong in the Server Please Try Again Later",
    status: 500,
  };
}
module.exports = {
  CustomBadRequestError,
  HttpError,
  NotFoundError,
  getErrorMessage,
};
