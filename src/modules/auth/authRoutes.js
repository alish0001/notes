const Router = require("express-promise-router");
const { loginUser, createUser } = require("./authController");
const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/login").post(loginUser);
  router.route("/signup").post(createUser);
  return router;
};

module.exports = routes;
