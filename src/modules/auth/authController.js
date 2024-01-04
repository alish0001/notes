const logger = require("../../config/winston");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  CustomBadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../../lib/errors");
const {
  validateCreateUser,
  validateLoginUser,
} = require("./validator/userValidator");
const bcrypt = require("bcrypt");
const Users = require("./model/userModel");

const loginUser = async (req, res) => {
  logger.info("Incoming request for the login user", { body: req.body });
  const { userEmail, password } = req.body;

  const validate = validateLoginUser(req.body);
  if (validate && validate.length) {
    throw new CustomBadRequestError(validate);
  }

  const userExists = await Users.collection.findOne({
    userEmail: userEmail,
  });
  if (!userExists) {
    throw new UnauthorizedError("Provided user doesn't exists");
  }

  const passwordMatch = await bcrypt.compare(password, userExists.password);
  if (passwordMatch) {
    const accessToken = jwt.sign(
      {
        userEmail: userExists.userEmail,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ accessToken: accessToken });
  }
  throw new UnauthorizedError("Provided user doesn't exists");
};

const createUser = async (req, res) => {
  logger.info("Incoming reqest for the signupUser ", { body: req.body });
  const { userEmail, password } = req.body;
  const validate = validateCreateUser(req.body);

  if (validate && validate.length) {
    throw new CustomBadRequestError(validate);
  }

  const userExists = await Users.collection.findOne({
    userEmail: userEmail,
  });
  if (userExists) {
    throw new ConflictError("User with the given email already exists");
  }
  const hashedPwd = await bcrypt.hash(password, 10);

  const result = await Users.collection.insertOne({
    userEmail,
    password: hashedPwd,
  });

  logger.info(`New User Created with email ${userEmail}`);
  return res.status(200).json({
    success: true,
    message: "Successfully Sign up, please login to use our services.",
    data: {
      userEmail: userEmail,
    },
  });
};

module.exports = {
  loginUser,
  createUser,
};
