import express from "express";
import toDoModel from "../models/todos.model.js";
const router = express.Router();
const serverError = (res) => {
  res.status(500).send({
    success: false,
    message: "Internal Server Error",
  });
};

router.get("/", async (req, res) => {
  try {
    const { sub: user } = req.user;
    const todos = await toDoModel.find({ user });
    res.status(200).send({ success: true, data: todos });
  } catch (err) {
    console.error(err.message);
    serverError(res);
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
    serverError(res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sub: user } = req.user;
    const { title, description, isCompleted } = req.body;
    const updated = await toDoModel.findOneAndUpdate(
      { _id: id, user },
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
    serverError(res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sub: user } = req.user;
    const deleted = await toDoModel.findOneAndDelete({ _id: id, user });
    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: "404 Not Found",
      });
    }
    res.status(200).send({
      success: true,
      message: deleted,
    });
  } catch (err) {
    serverError(res);
  }
});

export default router;
