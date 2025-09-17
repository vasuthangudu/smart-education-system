// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7002;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assignments_db";

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Prepend timestamp to avoid collisions and sanitize filename
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// ----- Mongoose model -----
const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: String,
    teacher: String,
    dueDate: Date,
    maxMarks: Number,
    files: [String],
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

// ----- Routes -----
// GET all assignments
app.get("/api/submissions", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).lean();
    res.json(assignments);
  } catch (err) {
    console.error("GET /api/submissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new assignment with files
app.post("/api/submissions", upload.array("files"), async (req, res) => {
  try {
    const { title, subject, description, teacher, dueDate, maxMarks } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    const files = (req.files || []).map((f) => f.filename);

    const assignment = new Assignment({
      title,
      subject,
      description,
      teacher,
      dueDate: dueDate ? new Date(dueDate) : null,
      maxMarks: maxMarks ? Number(maxMarks) : 0,
      files,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error("POST /api/submissions error:", err);
    res.status(500).json({ message: "Failed to save assignment" });
  }
});

// GET single assignment
app.get("/api/submissions/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) return res.status(404).json({ message: "Not found" });
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update assignment
app.put("/api/submissions/:id", upload.array("files"), async (req, res) => {
  try {
    const { title, subject, description, teacher, dueDate, maxMarks } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    const existing = await Assignment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const newFiles = (req.files || []).map((f) => f.filename);
    const updatedFiles = [...existing.files, ...newFiles];

    existing.title = title;
    existing.subject = subject;
    existing.description = description;
    existing.teacher = teacher;
    existing.dueDate = dueDate ? new Date(dueDate) : null;
    existing.maxMarks = maxMarks ? Number(maxMarks) : 0;
    existing.files = updatedFiles;

    const updated = await existing.save();
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/submissions/:id error:", err);
    res.status(500).json({ message: "Failed to update assignment" });
  }
});

// DELETE assignment
app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Not found" });

    // Remove associated files
    assignment.files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error("DELETE /api/submissions/:id error:", err);
    res.status(500).json({ message: "Failed to delete assignment" });
  }
});

// Connect to Mongo and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
