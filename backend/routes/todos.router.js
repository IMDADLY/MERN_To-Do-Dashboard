import express from "express";
import toDoModel from "../models/todos.model.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { sub: user } = req.user;
    const todos = await toDoModel.find({ user });
    res.status(200).send({ success: true, data: todos });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { sub: user } = req.user;
    const { title, description } = req.body;
    try {
      const newToDo = await toDoModel.create({
        user,
        title,
        description,
      });
      res.status(201).send({
        success: true,
        data: newToDo,
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    const updated = await toDoModel.findOneAndUpdate(
      { _id: id },
      {
        title,
        description,
        isCompleted,
      },
      { returnDocument: "after", runValidators: true },
    );
    if (!updated) {
      return res.status(404).send({
        success: false,
        message: "404 Not Found",
      });
    }
    res.status(200).send({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await toDoModel.findById(id);
    if (!todo) {
      return res.status(404).send({
        success: false,
        message: "404 Not found",
      });
    }
    const deleted = await todo.deleteOne();
    return res.status(200).send({
      success: true,
      message: deleted,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default router;
