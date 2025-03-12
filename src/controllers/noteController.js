const noteModels = require("../models/noteModels");

const createNote = async (req, res) => {
  let { title, description } = req.body;

  title = title?.trim();
  description = description?.trim();

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const newNote = new noteModels({
    title,
    description,
    userId: req.userId,
  });

  try {
    await newNote.save();
    res.status(201).json({
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    console.error("Create Note Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNotes = async (req, res) => {
  const id = req.params.id;
  let { title, description } = req.body;

  title = title?.trim();
  description = description?.trim();

  try {
    const existingNote = await noteModels.findById(id);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) existingNote.title = title;
    if (description) existingNote.description = description;

    await existingNote.save();

    res.status(200).json({
      message: "Note updated successfully",
      note: existingNote,
    });
  } catch (error) {
    console.error("Update Note Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNotes = async (req, res) => {
  const id = req.params.id;
  try {
    const note = await noteModels.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(202).json({ message: "Note deleted successfully", note });
  } catch (error) {
    console.error("Delete Note Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModels.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Get Notes Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createNote,
  updateNotes,
  deleteNotes,
  getNotes,
};
