const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// File upload folder
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
  .connect("mongodb://127.0.0.1:27017/communicationDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,
    subject: String,
    message: String,
    attachments: [{ name: String, url: String }],
    read: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

app.get("/", (req, res) => res.send("✅ API running"));

// Fetch all messages
app.get("/api/messages", async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});

// Post new message
app.post("/api/messages", upload.array("attachments"), async (req, res) => {
  try {
    const { sender, receiver, subject, message } = req.body;
    if (!receiver || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const attachments = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    const newMsg = new Message({ sender, receiver, subject, message, attachments });
    const saved = await newMsg.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Static for attachments
app.use("/uploads", express.static(uploadDir));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
