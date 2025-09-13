// App.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5009;

app.use(cors());
app.use(express.json());

// ----------------- MongoDB -----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/studentdb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ----------------- Schema -----------------
const StudentSchema = new mongoose.Schema(
  {
    // required and unique in DB, but server will generate an ID when missing
    studentId: { type: String, unique: true, required: true },
    studentName: { type: String, required: true },
    branch: { type: String, required: true },
    section: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

// ----------------- Helpers -----------------
function genStudentId() {
  // unique id using ObjectId hex string (very unlikely to collide)
  return "S" + new mongoose.Types.ObjectId().toHexString();
}

function sanitizeString(v) {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

// ----------------- Routes -----------------

// GET /api/students?branch=&semester=&search=
app.get("/api/students", async (req, res) => {
  try {
    const { branch, semester, search } = req.query;
    const q = {};
    if (branch) q.branch = branch;
    if (semester) q.semester = semester;
    if (search) {
      q.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { studentName: { $regex: search, $options: "i" } },
      ];
    }
    const students = await Student.find(q).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/students  (expects an ARRAY of students)
app.post("/api/students", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Expected an array in request body." });
    }

    // Prepare documents: sanitize and fill defaults for studentId
    const prepared = req.body.map((s) => ({
      studentId: sanitizeString(s.studentId) || genStudentId(),
      studentName: sanitizeString(s.studentName),
      branch: sanitizeString(s.branch),
      section: sanitizeString(s.section),
      semester: sanitizeString(s.semester),
      subject: sanitizeString(s.subject),
    }));

    // Validate required fields (except studentId which we auto-fill)
    const invalid = prepared
      .map((p, i) => ({ ...p, _origIndex: i }))
      .filter((p) => !p.studentName || !p.branch || !p.section || !p.semester || !p.subject);

    if (invalid.length > 0) {
      return res.status(400).json({
        error: "Some entries are missing required fields (studentName/branch/section/semester/subject).",
        invalidCount: invalid.length,
        invalid: invalid.map((x) => ({ index: x._origIndex, item: x })),
      });
    }

    // Insert. Use ordered: false so one duplicate won't stop other valid inserts.
    const inserted = await Student.insertMany(prepared, { ordered: false });

    const all = await Student.find().sort({ createdAt: -1 });
    res.json({ students: all, insertedCount: inserted.length });
  } catch (err) {
    console.error("Insert error:", err);

    // Duplicate key or BulkWrite errors are common — return helpful info.
    if (err && (err.code === 11000 || err.name === "BulkWriteError")) {
      const all = await Student.find().sort({ createdAt: -1 });
      return res.status(409).json({
        error: "Insert partially failed (possible duplicate studentId).",
        message: err.message,
        // return current DB state so front-end can stay in sync
        students: all,
      });
    }

    res.status(500).json({ error: err.message });
  }
});

// PUT /api/students/:id
app.put("/api/students/:id", async (req, res) => {
  try {
    const update = {
      studentId: sanitizeString(req.body.studentId),
      studentName: sanitizeString(req.body.studentName),
      branch: sanitizeString(req.body.branch),
      section: sanitizeString(req.body.section),
      semester: sanitizeString(req.body.semester),
      subject: sanitizeString(req.body.subject),
    };

    // Remove blank fields (so we don't overwrite with empty strings unintentionally)
    Object.keys(update).forEach((k) => { if (update[k] === "") delete update[k]; });

    await Student.findByIdAndUpdate(req.params.id, update, { runValidators: true });
    const all = await Student.find().sort({ createdAt: -1 });
    res.json({ students: all });
  } catch (err) {
    console.error("Update error:", err);
    if (err && err.name === "MongoServerError" && err.code === 11000) {
      return res.status(409).json({ error: "Duplicate studentId (update conflict)." });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/students/:id
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    const all = await Student.find().sort({ createdAt: -1 });
    res.json({ students: all });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------- Start -----------------
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
