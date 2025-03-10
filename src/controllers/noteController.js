const noteModels = require("../models/noteModels");

const createNote = async (req, res) => {
  const { title, description } = req.body;
  const newNotes = new noteModels({
    title: title,
    description: description,
    userId: req.userId,
  });
  try {
    await newNotes.save();
    res.status(201).json({
      message: "Notes Created Successfully",
      note: newNotes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// const updateNotes = async (req, res) => {
//   const id = req.params.id;
//   const { title, description } = req.body;
//   const newNotes = {
//     title: title,
//     description: description,
//     userId: req.userId,
//   };
//   try {
//     await noteModels.findByIdAndUpdate(id, newNotes, { new: true });
//     res.status(200).json({
//       message: "Notes Updated Successfully",
//       note: newNotes,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const updateNotes = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  try {
    const existingNote = await noteModels.findById(id);
    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) existingNote.title = title;
    if (description) existingNote.description = description;

    await existingNote.save();

    res.status(200).json({
      message: "Notes Updated Successfully",
      note: existingNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNotes = async (req, res) => {
  const id = req.params.id;
  try {
    const notes = await noteModels.findByIdAndDelete(id);
    res
      .status(202)
      .json({ message: "Notes Deleted Successfully", note: notes });
  } catch (error) {
    console.log(erorr);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getNotes = async (req, res) => {
  try {
    const notes = await noteModels.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {}
};

module.exports = {
  createNote,
  updateNotes,
  deleteNotes,
  getNotes,
};
