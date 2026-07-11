import express from "express";
import toDoModel from "../models/todos.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await toDoModel.find({ user: req.id });
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  const todo = { ...req.id, ...req.body };
  if (req.id != req.body.user) {
    res.status(401).status({
      success: false,
      message: "401 Unauthorized",
    });
  }
  try {
    const newToDo = await toDoModel.create(todo);
    res.status(201).json({
      success: true,
      data: newToDo,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await toDoModel.findById(id);
  if (!todo) {
    res.status(404).json({
      success: false,
      message: "404 Not Found",
    });
  }
  try {
    const updated = await toDoModel.updateOne({ _id: id }, req.body, {
      runValidators: true,
    });
    res.status(201).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const todo = await toDoModel.findById(id);
  if (!todo) {
    res.status(404).json({
      success: false,
      messafe: "404 Not found",
    });
  }
  try {
    const deleted = await todo.deleteOne();
    res.status(204).json({
      success: true,
      message: deleted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
