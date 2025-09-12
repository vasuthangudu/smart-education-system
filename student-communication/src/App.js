// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload storage (for attachments)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/communicationDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// =============================
// Schema & Models
// =============================

// Messages schema
const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    subject: String,
    message: String,
    attachments: [
      {
        name: String,
        url: String,
      },
    ],
    read: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

// Notifications schema (optional, if still needed)
const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["announcement", "event"], required: true },
    message: { type: String, required: true },
    date: { type: String, required: true },
    audience: { type: String, enum: ["All", "Students", "Teachers"], default: "All" },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);

// =============================
// Routes
// =============================
app.get("/", (req, res) => res.send("✅ API running"));

// -------- Messages API --------

// GET all messages
app.get("/api/messages", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new message with optional attachments
app.post("/api/messages", upload.array("attachments"), async (req, res) => {
  try {
    const { sender, receiver, subject, message } = req.body;

    if (!receiver || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const attachments =
      (req.files || []).map((f) => ({
        name: f.originalname,
        url: `/uploads/${f.filename}`,
      })) || [];

    const newMsg = new Message({ sender, receiver, subject, message, attachments });
    const saved = await newMsg.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------- Notifications API (if still needed) --------
app.get("/api/notifications", async (req, res) => {
  try {
    const items = await Notification.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const { type, message, date, audience } = req.body;
    if (!type || !message || !date) {
      return res.status(400).json({ error: "type, message, date required" });
    }
    const newNote = new Notification({ type, message, date, audience });
    const saved = await newNote.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/notifications/:id", async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================
// Static files for uploaded attachments
// =============================
app.use("/uploads", express.static(uploadDir));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
