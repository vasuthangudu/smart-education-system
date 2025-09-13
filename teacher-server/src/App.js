// server/app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5005; // unified backend port

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ MongoDB Connections
const commDB = mongoose.createConnection("mongodb://127.0.0.1:27017/communicationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
commDB.on("connected", () => console.log("✅ Connected to communicationDB"));

const eduDB = mongoose.createConnection("mongodb://127.0.0.1:27017/educationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
eduDB.on("connected", () => console.log("✅ Connected to educationDB"));

// ====== MESSAGE SCHEMA (communicationDB) ======
const replySchema = new mongoose.Schema({
  sender: String,
  message: String,
  dateTime: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  subject: String,
  message: String,
  attachments: [{ name: String, url: String }],
  priority: { type: String, default: "Normal" },
  category: { type: String, default: "Query" },
  dateTime: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  replies: [replySchema],
});

const Message = commDB.model("Message", messageSchema);

// ====== ASSIGNMENT SCHEMA (educationDB) ======
const submissionSchema = new mongoose.Schema({
  student: String,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: String,
  dueDate: Date,
  maxMarks: Number,
  resources: [String],
  submissions: [submissionSchema],
});

const Assignment = eduDB.model("Assignment", assignmentSchema);

// ================== ROUTES ==================

// 📌 Message APIs
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ dateTime: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    const savedMsg = await newMsg.save();
    res.status(201).json(savedMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/messages/:id", async (req, res) => {
  try {
    const updatedMsg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMsg) return res.status(404).json({ error: "Message not found" });
    res.json(updatedMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const deletedMsg = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMsg) return res.status(404).json({ error: "Message not found" });
    res.json({ success: true, id: deletedMsg._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/messages/:id/read", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    msg.read = !msg.read;
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/messages/:id/pin", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    msg.pinned = !msg.pinned;
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Assignment APIs
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
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/assignments/:id", async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted" });
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

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Unified server running at http://localhost:${PORT}`);
});
