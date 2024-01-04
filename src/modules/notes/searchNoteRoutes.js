const Router = require("express-promise-router");
const verifyJWT = require("../../middlewares/verifyAccessToken");
const { searchNotes } = require("./searchNoteController");
const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/").get(verifyJWT, searchNotes);
  return router;
};

module.exports = routes;
