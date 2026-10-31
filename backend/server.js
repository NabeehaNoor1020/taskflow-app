
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const Task = mongoose.models.Task || mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      done: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Cannot load tasks" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }
    const task = await Task.create({ title: title.trim() });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Cannot add task" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    if (typeof req.body.done !== "boolean") {
      return res.status(400).json({ message: "Valid task status is required" });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { done: req.body.done },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

module.exports = app;
