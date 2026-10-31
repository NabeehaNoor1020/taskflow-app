
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Task Schema
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    done: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true })
);

// GET - Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Cannot load tasks" });
  }
});

// POST - Add new task
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title: title.trim()
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Cannot add task"
    });
  }
});

// PUT - Update task status
app.put("/tasks/:id", async (req, res) => {
  try {
    if (typeof req.body.done !== "boolean") {
      return res.status(400).json({
        message: "Valid task status is required"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { done: req.body.done },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({
      message: "Invalid task ID"
    });
  }
});

// DELETE - Delete task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Invalid task ID"
    });
  }
});

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas connected!");

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
