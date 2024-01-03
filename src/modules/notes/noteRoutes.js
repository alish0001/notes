const Router = require("express-promise-router");
const {
  getAllNotes,
  createNote,
  getANote,
  updateANote,
  softDeleteANote,
} = require("./noteController");

const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/").get(getAllNotes).post(createNote);
  router.route("/:id").get(getANote).put(updateANote).delete(softDeleteANote);
  router.route("/healthcheck").get((req, res) => {
    res.send("Notes service is up and running");
  });
  return router;
};

module.exports = routes;
