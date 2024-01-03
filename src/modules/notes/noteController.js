const getAllNotes = async (req, res) => {
  return res.status(200).send({
    message: "Hurrey Initialized",
  });
};

module.exports = {
  getAllNotes,
};
