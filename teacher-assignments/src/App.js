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
const PORT = 7002;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://127.0.0.1:27017/assignmentsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, default: "Teacher" },
  description: String,
  files: [String],
  submittedAt: { type: Date, default: Date.now },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

app.get("/api/submissions", async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ submittedAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.post("/api/submissions", upload.array("files"), async (req, res) => {
  try {
    const { title, subject, teacher, description } = req.body;
    const files = req.files ? req.files.map((f) => f.filename) : [];
    if (!title || !subject)
      return res.status(400).json({ error: "Title and Subject are required" });

    const assignment = new Assignment({
      title,
      subject,
      teacher: teacher || "Teacher",
      description,
      files,
    });
    await assignment.save();
    res.status(201).json({ message: "Assignment saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save assignment" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
