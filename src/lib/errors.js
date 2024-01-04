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

class ForbiddenError extends HttpError {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message || "User is not authorized";
    this.status = 403;
  }
}

class ConflictError extends HttpError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "Record already exists";
    this.status = 409;
  }
}

class RateLimitExceedError extends HttpError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message || "Rate Limit Exceed";
    this.status = 429;
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

class UnauthorizedError extends HttpError {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message || "Unauthorized";
    this.status = 401;
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
  ConflictError,
  getErrorMessage,
  ForbiddenError,
  UnauthorizedError,
  RateLimitExceedError,
};
