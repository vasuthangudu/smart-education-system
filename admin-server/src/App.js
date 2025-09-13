// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5004; // you can change if needed

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/adminDashboardDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schemas
const baseSchema = new mongoose.Schema({
  message: String,
  date: String,
  audience: String,
});

const Announcement = mongoose.model("Announcement", baseSchema);
const Event = mongoose.model("Event", baseSchema);

// Routes
// Get all announcements
app.get("/api/announcements", async (req, res) => {
  try {
    const items = await Announcement.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new announcement
app.post("/api/announcements", async (req, res) => {
  try {
    const newItem = new Announcement(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete announcement
app.delete("/api/announcements/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const items = await Event.find().sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new event
app.post("/api/events", async (req, res) => {
  try {
    const newItem = new Event(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update announcement
app.put("/api/announcements/:id", async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
