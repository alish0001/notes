const Router = require("express-promise-router");
const verifyJWT = require("../../middlewares/verifyAccessToken");
const ipLevelRateLimiting = require("../../middlewares/ipLevelRateLimitingMiddleWare");
const {
  getAllNotes,
  createNote,
  getANote,
  updateANote,
  softDeleteANote,
  shareANote,
} = require("./noteController");

const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/").get(verifyJWT, getAllNotes).post(verifyJWT, createNote);
  router
    .route("/:id")
    .get(ipLevelRateLimiting, verifyJWT, getANote)
    .put(ipLevelRateLimiting, verifyJWT, updateANote)
    .delete(ipLevelRateLimiting, verifyJWT, softDeleteANote);
  router.post("/:id/share", ipLevelRateLimiting, verifyJWT, shareANote);
  return router;
};

module.exports = routes;
