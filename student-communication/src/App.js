// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5003;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== File Upload Directory =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// ===== Multer Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ===== MongoDB Connection =====
mongoose
  .connect("mongodb://127.0.0.1:27017/smart-education", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  });

// ===== Schemas =====

// Assignment Submission
const submissionSchema = new mongoose.Schema({
  title: String,
  subject: String,
  teacher: String,
  description: String,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
});
const Submission = mongoose.model("Submission", submissionSchema);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    subject: String,
    message: String,
    attachments: [{ name: String, url: String }],
    category: { type: String, default: "Query" },
    priority: { type: String, default: "Normal" },
    read: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    replies: { type: Array, default: [] },
    dateTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);

// ===== Routes =====

// Test API
app.get("/", (req, res) => res.send("✅ API running"));

// --------- ASSIGNMENTS ---------

// Get all submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit assignment
app.post("/api/submissions", upload.array("files"), async (req, res) => {
  try {
    const { title, subject, teacher, description } = req.body;
    const files = (req.files || []).map((f) => f.filename);
    const newSubmission = new Submission({ title, subject, teacher, description, files });
    const saved = await newSubmission.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- MESSAGES ---------

// Get all messages
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ dateTime: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Create new message
app.post("/api/messages", upload.array("attachments"), async (req, res) => {
  try {
    const { sender, receiver, subject, message, category, priority } = req.body;

    if (!receiver || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const attachments = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    const newMessage = new Message({ sender, receiver, subject, message, attachments, category, priority });
    const saved = await newMessage.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// --------- Start Server ---------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
