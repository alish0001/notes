const Router = require("express-promise-router");
const verifyJWT = require("../../middlewares/verifyAccessToken");
const {
  getAllNotes,
  createNote,
  getANote,
  updateANote,
  softDeleteANote,
} = require("./noteController");

const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/").get(verifyJWT, getAllNotes).post(verifyJWT, createNote);
  router
    .route("/:id")
    .get(verifyJWT, getANote)
    .put(verifyJWT, updateANote)
    .delete(verifyJWT, softDeleteANote);
  return router;
};

module.exports = routes;
