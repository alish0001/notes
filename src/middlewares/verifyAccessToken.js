const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../lib/errors");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new UnauthorizedError(
      "User is not authorize to access the given resources"
    );
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new ForbiddenError(
        "User is not authorize to access the giver resources"
      );
    }
    req.body.userEmail = decoded.userEmail;
    next();
  });
};

module.exports = verifyJWT;
