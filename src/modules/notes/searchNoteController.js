const logger = require("../../config/winston");
const Notes = require("./models/noteModel");

const searchNotes = async (req, res) => {
  logger.info(
    "Incoming Request for search Notes",
    { body: req.body },
    { query: req.query }
  );
  const currentDateTime = new Date();

  const query = req.query.q;
  const userEmail = req.body.userEmail;

  const regexQuery = new RegExp(query, "i");

  const recordsCursor = Notes.collection
    .find({
      $and: [
        { content: { $regex: regexQuery } },
        { userEmail: userEmail },
        { isDeleted: false },
      ],
    })
    .project({ content: 1, _id: 0 });

  const records = await recordsCursor.toArray();
  logger.info("Successfully Executed the search notes request");
  return res.status(200).json({
    success: true,
    message: "Successfully retrived the notes for user",
    data: records,
    timestamp: currentDateTime,
  });
};

module.exports = {
  searchNotes,
};
