// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5007;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ MongoDB Connection ------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/educationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ------------------ Schemas ------------------
const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    subject: String,
    message: String,
    read: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    attachments: [{ name: String, url: String }],
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

const submissionSchema = new mongoose.Schema({
  student: String,
  subject: String,
  teacher: String,
  description: String,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: String,
  description: String,
  dueDate: Date,
  resources: [String],
  maxMarks: Number,
  submissions: [submissionSchema],
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

// ------------------ Multer Setup ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ------------------ Message Routes ------------------
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/messages", upload.array("attachments"), async (req, res) => {
  try {
    const attachments = req.files
      ? req.files.map((file) => ({ name: file.originalname, url: `/uploads/${file.filename}` }))
      : [];
    const msg = new Message({
      sender: req.body.sender,
      receiver: req.body.receiver,
      subject: req.body.subject,
      message: req.body.message,
      attachments,
    });
    await msg.save();
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save message" });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Message not found" });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
});

// ------------------ Assignment Routes ------------------
app.get("/api/assignments", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/assignments", async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/assignments/:id", async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Assignment not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/assignments/:id", async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Assignment not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/assignments/:id/submit", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    assignment.submissions.push(req.body);
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/assignments/:id/submissions", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    res.json(assignment.submissions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
