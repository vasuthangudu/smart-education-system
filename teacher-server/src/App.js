
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5005;

// ==== Middleware ====
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==== Ensure uploads folder exists ====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ==== Multer Setup ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ==== MongoDB Connection ====
mongoose
  .connect("mongodb://127.0.0.1:27017/fullStackDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ====================
// ==== Assignment Schema ====
const assignmentSchema = new mongoose.Schema({
  title: String,
  subject: String,
  teacher: String,
  description: String,
  dueDate: Date,
  maxMarks: Number,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

// ==== Course Schema ====
const materialSchema = new mongoose.Schema({
  name: String,
  url: String,
  fileName: String,
});
const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
});
const courseSchema = new mongoose.Schema({
  subject: String,
  department: String,
  faculty: String,
  videos: [videoSchema],
  materials: [materialSchema],
});
const Course = mongoose.model("Course", courseSchema);

// ==== Message Schema ====
const replySchema = new mongoose.Schema({
  sender: String,
  message: String,
  dateTime: { type: Date, default: Date.now },
});
const attachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
});
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  subject: String,
  message: String,
  attachments: [attachmentSchema],
  priority: { type: String, default: "Normal" },
  category: { type: String, default: "Query" },
  dateTime: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  replies: [replySchema],
});
const Message = mongoose.model("Message", messageSchema);

// ====================
// ==== Assignment Routes ====
// Get all assignments
app.get("/api/submissions", async (req, res) => {
  const assignments = await Assignment.find().sort({ submittedAt: -1 });
  res.json(assignments);
});
// Add new assignment
app.post("/api/submissions", upload.array("files"), async (req, res) => {
  try {
    const { title, subject, teacher, description, dueDate, maxMarks } = req.body;
    const files = (req.files || []).map((f) => f.filename);

    const newAssignment = new Assignment({
      title,
      subject,
      teacher,
      description,
      dueDate,
      maxMarks: maxMarks || 0,
      files,
    });

    const saved = await newAssignment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add assignment" });
  }
});

// ====================
// ==== Course Routes ====
// Get all courses
app.get("/api/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});
// Create new course
app.post("/api/courses", upload.array("materials"), async (req, res) => {
  try {
    const { subject, department, faculty, videos } = req.body;
    const parsedVideos = JSON.parse(videos || "[]");
    const materials = (req.files || []).map((f) => ({
      name: f.originalname,
      fileName: f.filename,
      url: `/uploads/${f.filename}`,
    }));

    const course = new Course({
      subject,
      department,
      faculty,
      videos: parsedVideos,
      materials,
    });

    const saved = await course.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
});
// Update course
app.put("/api/courses/:id", upload.array("materials"), async (req, res) => {
  try {
    const { subject, department, faculty, videos, existingMaterials } = req.body;
    const parsedVideos = JSON.parse(videos || "[]");
    const existing = JSON.parse(existingMaterials || "[]");

    const newMaterials = (req.files || []).map((f) => ({
      name: f.originalname,
      fileName: f.filename,
      url: `/uploads/${f.filename}`,
    }));

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { subject, department, faculty, videos: parsedVideos, materials: [...existing, ...newMaterials] },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update course" });
  }
});
// Delete course
app.delete("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted", id: course._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ====================
// ==== Message Routes ====
// Get all messages
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ dateTime: -1 });
  res.json(messages);
});
// Create message
app.post("/api/messages", upload.array("attachments"), async (req, res) => {
  try {
    const { sender, receiver, subject, message } = req.body;
    const attachments = (req.files || []).map((f) => ({ name: f.originalname, url: `/uploads/${f.filename}` }));

    const newMsg = new Message({ sender, receiver, subject, message, attachments });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});
// Update message (read/pin)
app.patch("/api/messages/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedMsg = await Message.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedMsg);
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// ====================
// ==== Start Server ====
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

