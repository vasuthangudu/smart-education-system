// server.js
import express from "express";
import mongoose, { Schema, model } from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ====== SCHEMAS ======
const studentSchema = new Schema({
  name: { type: String, required: true },
  fatherName: String,
  email: { type: String, required: true, unique: true },
  password: String,
  gender: String,
  dob: String,
  address: String,
  department: String,
  profileImage: String,
});

const teacherSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  department: String,
  position: String,
  profileImage: String,
});

const adminSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
  employeeId: String,
  department: String,
  profileImage: String,
});

const Student = model("Student", studentSchema);
const Teacher = model("Teacher", teacherSchema);
const Admin = model("Admin", adminSchema);

// ====== CRUD HELPER ======
function crudRoutes(path, Model) {
  app.get(`/api/${path}`, async (_, res) => {
    try {
      res.json(await Model.find());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/api/${path}/register`, async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.json(doc);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put(`/api/${path}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete(`/api/${path}/:id`, async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
}

// Register all routes
crudRoutes("students", Student);
crudRoutes("teachers", Teacher);
crudRoutes("admins", Admin);

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
mongoose
  .connect("mongodb://127.0.0.1:27017/smartEducationDB")
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
