const Router = require("express-promise-router");
const { loginUser, createUser } = require("./authController");
const ipLevelRateLimiting = require("../../middlewares/ipLevelRateLimitingMiddleWare");
const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/login").post(ipLevelRateLimiting, loginUser);
  router.route("/signup").post(ipLevelRateLimiting, createUser);
  return router;
};

module.exports = routes;
