import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // base64 images

// ================== SCHEMAS ==================

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: String,
  rollNo: { type: String, required: true, unique: true }, // ONLY rollNo unique
  password: String,
  gender: String,
  dob: String,
  address: String,
  department: String,
  profileImage: String,
});
studentSchema.index({ rollNo: 1 }, { unique: true }); // ensure uniqueness
const Student = mongoose.model("Student", studentSchema);

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  department: String,
  position: String,
  profileImage: String,
});
teacherSchema.index({ email: 1 }, { unique: true });
const Teacher = mongoose.model("Teacher", teacherSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  employeeId: String,
  department: String,
  profileImage: String,
});
adminSchema.index({ email: 1 }, { unique: true });
const Admin = mongoose.model("Admin", adminSchema);

// ================== ROUTES ==================

// Get all
app.get("/api/students", async (_, res) => {
  try {
    const data = await Student.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/teachers", async (_, res) => {
  try {
    const data = await Teacher.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/admins", async (_, res) => {
  try {
    const data = await Admin.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register
app.post("/api/students/register", async (req, res) => {
  try {
    const doc = await Student.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/teachers/register", async (req, res) => {
  try {
    const doc = await Teacher.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.post("/api/admins/register", async (req, res) => {
  try {
    const doc = await Admin.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
app.put("/api/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/teachers/:id", async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/admins/:id", async (req, res) => {
  try {
    const updated = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/teachers/:id", async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.delete("/api/admins/:id", async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================== START SERVER ==================
const PORT = 5008;
mongoose
  .connect("mongodb://127.0.0.1:27017/smartEducationDB")
  .then(() => console.log("MongoDB connected"))
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((err) => console.error("MongoDB connection error:", err));
