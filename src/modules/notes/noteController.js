const { CustomBadRequestError, NotFoundError } = require("../../lib/errors");
const {
  validateCreateNote,
  validateUpdateNote,
  isValidEmail,
} = require("./validator/notesValidator");

const logger = require("../../config/winston");
const Notes = require("./models/noteModel");
const ObjectId = require("mongodb").ObjectId;

const getAllNotes = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Successfully retrived the notes for user",
    data: {},
  });
};

const createNote = async (req, res) => {
  logger.info("Incoming Request For Create Note", { body: req.body });
  const body = req.body;
  const currentDateTime = new Date();
  const validated = validateCreateNote(req.body);

  if (validated && validated.length) {
    throw new CustomBadRequestError(validated);
  }

  const insertedRecord = await Notes.collection.insertOne({
    ...body,
    createAt: currentDateTime,
    isDeleted: false,
  });
  logger.info("Successfully created Note");

  return res.status(200).json({
    success: true,
    message: "Successfully Created Note",
    data: {
      noteId: insertedRecord.insertedId,
    },
  });
};

const getANote = async (req, res) => {
  logger.info("Incoming request for get note", { params: req.params });
  const noteId = req.params.id;

  if (!noteId || !ObjectId.isValid(noteId)) {
    throw new CustomBadRequestError("Please Provide Proper Id");
  }

  const record = await Notes.collection.findOne({
    _id: new ObjectId(noteId),
    isDeleted: false,
  });

  if (record) {
    return res.status(200).json({
      success: true,
      message: "Successfully retrived the Note",
      data: {
        userEmail: record.userEmail,
        content: record.content,
      },
    });
  }

  throw new NotFoundError("Note with give id is not present in the system");
};

const updateANote = async (req, res) => {
  logger.info(
    "Incoming request for update note",
    { params: req.params },
    { body: req.body }
  );
  const currentDateTime = new Date();
  const noteId = req.params.id;
  const { content } = req.body;

  const validated = validateUpdateNote(req.body, noteId);
  if (validated && validated.length) {
    throw new CustomBadRequestError(validated);
  }

  const record = await Notes.collection.findOneAndUpdate(
    {
      _id: new ObjectId(noteId),
      isDeleted: false,
    },
    {
      $set: {
        content,
        updatedAt: currentDateTime,
      },
    }
  );

  if (!record) {
    throw new NotFoundError("Note with given id not present in the system");
  }
  return res.status(200).json({
    success: true,
    message: "Successfully Updated the Note",
    data: {
      noteId: record.insertedId,
    },
  });
};

const softDeleteANote = async (req, res) => {
  logger.info("Incoming request for delete a note", { params: req.params });
  const currentDateTime = new Date();
  const noteId = req.params.id;

  if (!noteId || !ObjectId.isValid(noteId)) {
    throw new CustomBadRequestError("Please Provide Proper Id");
  }

  const record = await Notes.collection.findOneAndUpdate(
    {
      _id: new ObjectId(noteId),
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        updatedAt: currentDateTime,
      },
    }
  );

  if (!record) {
    throw new NotFoundError("Note with given id not present in the system");
  }

  return res.status(200).json({
    success: true,
    message: "Successfully Deleted the Note",
    data: {
      noteId: record.insertedId,
    },
  });
};
module.exports = {
  getAllNotes,
  createNote,
  getANote,
  updateANote,
  softDeleteANote,
};
