// App.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5007;

app.use(cors());
app.use(express.json());

// === File Upload Handling ===
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// === MongoDB Connection ===
mongoose.connect("mongodb://127.0.0.1:27017/admin_notifications", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// === Schema & Model ===
const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true }, // All, Student, Teacher
  subject: String,
  message: String,
  attachments: [{ name: String, path: String }],
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// === Routes ===
// Fetch all messages
app.get("/api/messages", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Create a new message
app.post("/api/messages", upload.array("attachments", 5), async (req, res) => {
  try {
    const { sender, receiver, subject, message } = req.body;
    const attachments = req.files.map(f => ({
      name: f.originalname,
      path: `/uploads/${f.filename}`,
    }));
    const msg = new Message({ sender, receiver, subject, message, attachments });
    await msg.save();
    res.json(msg);
  } catch {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Delete a message
app.delete("/api/messages/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

app.use("/uploads", express.static(uploadDir));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
