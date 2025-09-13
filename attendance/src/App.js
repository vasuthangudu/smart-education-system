const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/smart-education", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Attendance Schema & Model
const attendanceSchema = new mongoose.Schema({
  id: String,
  name: String,
  branch: String,
  section: String,
  semester: String,
  subject: String,
  date: String,
  period: String,
  status: String,
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

// ✅ Save Attendance
app.post("/api/attendance", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "No attendance data provided." });
    }
    await Attendance.insertMany(req.body);
    res.status(200).json({ message: "Attendance saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch Attendance History with Filters
app.get("/api/attendance", async (req, res) => {
  try {
    const { branch, section, semester, subject, search } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    if (section) filter.section = section;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (search) filter.name = { $regex: search, $options: "i" };

    const records = await Attendance.find(filter);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start Server
const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
