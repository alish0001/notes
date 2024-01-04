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
  logger.info("Incoming Request For get all the notes for user", req.body);
  const { userEmail } = req.body;
  const currentDateTime = new Date();

  const recordsCursor = Notes.collection
    .find({
      userEmail: userEmail,
      isDeleted: false,
    })
    .project({ content: 1, _id: 0 });

  const records = await recordsCursor.toArray();

  return res.status(200).json({
    success: true,
    message: "Successfully retrived the notes for user",
    data: records,
    timestamp: currentDateTime,
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
    updatedAt: currentDateTime,
    isDeleted: false,
  });
  logger.info("Successfully created Note");

  return res.status(200).json({
    success: true,
    message: "Successfully Created Note",
    data: {
      noteId: insertedRecord.insertedId,
    },
    timestamp: currentDateTime,
  });
};

const getANote = async (req, res) => {
  logger.info("Incoming request for get note", { params: req.params });
  const noteId = req.params.id;
  const currentDateTime = new Date();
  if (!noteId || !ObjectId.isValid(noteId)) {
    throw new CustomBadRequestError("Please Provide Proper Id");
  }
  const userEmail = req.body.userEmail;
  const record = await Notes.collection.findOne({
    _id: new ObjectId(noteId),
    isDeleted: false,
  });

  if (
    record?.userEmail === userEmail ||
    record?.allowedUsers?.includes(userEmail)
  ) {
    return res.status(200).json({
      success: true,
      message: "Successfully retrived the Note",
      data: {
        userEmail: record.userEmail,
        content: record.content,
      },
      timestamp: currentDateTime,
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
  const { content, userEmail } = req.body;

  const validated = validateUpdateNote(req.body, noteId);
  if (validated && validated.length) {
    throw new CustomBadRequestError(validated);
  }

  const record = await Notes.collection.findOneAndUpdate(
    {
      _id: new ObjectId(noteId),
      isDeleted: false,
      userEmail: userEmail,
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
      userEmail: req.body.userEmail,
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
      noteId,
    },
    timestamp: currentDateTime,
  });
};

const shareANote = async (req, res) => {
  logger.info(
    "Incoming Request for share a note",
    { params: req.params },
    { body: req.body }
  );

  const currentDateTime = new Date();
  const { userEmail, email } = req.body;
  const noteId = req.params.id;

  if (!email || !isValidEmail(email)) {
    throw new CustomBadRequestError("Please Provide the proper valid email");
  }
  if (!noteId || !ObjectId.isValid(noteId)) {
    throw new CustomBadRequestError("Please Provide the proper valid id");
  }

  const allowedUsersRecords = await Notes.collection.findOne(
    {
      _id: new ObjectId(noteId),
      isDeleted: false,
      userEmail: userEmail,
    },
    { projection: { allowedUsers: 1, _id: 0 } }
  );
  const allowedUsers = allowedUsersRecords.allowedUsers;

  if (allowedUsers.includes(email)) {
    logger.info(`${email}: is already present in the record`);
    return res.status(200).json({
      success: true,
      message: `Successfully shared the Note, with user: ${email}`,
      data: {
        noteId,
      },
      timestamp: currentDateTime,
    });
  }

  const record = await Notes.collection.findOneAndUpdate(
    {
      _id: new ObjectId(noteId),
      isDeleted: false,
      userEmail: userEmail,
    },
    {
      $push: {
        allowedUsers: email,
      },
    }
  );

  if (!record) {
    throw new NotFoundError(
      "Notes With Given Id is Not present in the system "
    );
  }

  return res.status(200).json({
    success: true,
    message: `Successfully shared the Note, with user: ${email}`,
    data: {
      noteId,
    },
    timestamp: currentDateTime,
  });
};
module.exports = {
  getAllNotes,
  createNote,
  getANote,
  updateANote,
  softDeleteANote,
  shareANote,
};
