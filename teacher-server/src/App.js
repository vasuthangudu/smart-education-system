// App.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5005;

// ==== Middleware ====
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==== MongoDB Connect ====
mongoose
  .connect("mongodb://127.0.0.1:27017/courseDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// ==== Mongoose Schema ====
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

// ==== Multer Setup ====
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// ==== Routes ====

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
      {
        subject,
        department,
        faculty,
        videos: parsedVideos,
        materials: [...existing, ...newMaterials],
      },
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

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
