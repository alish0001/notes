const Router = require("express-promise-router");
const { getAllNotes } = require("./noteController");

const routes = () => {
  const router = Router({ mergeParams: true });
  router.route("/").get(getAllNotes);
  router.route("/healthcheck").get((req, res) => {
    res.send("Notes service is up and running");
  });
  return router;
};

module.exports = routes;
