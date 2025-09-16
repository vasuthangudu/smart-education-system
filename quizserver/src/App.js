import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 6001;

app.use(cors());
app.use(bodyParser.json());

// ----- MongoDB Connection -----
mongoose.connect("mongodb://127.0.0.1:27017/quizdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error(err));

// ----- Schemas -----
const studentSchema = new mongoose.Schema({
  roll: String,
  name: String,
  password: String,
});

const questionSchema = new mongoose.Schema({
  q: String,
  options: [String],
  answer: Number,
});

const quizSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  questions: [questionSchema],
});

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  studentRoll: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  quizTitle: String,
  answers: [Number],
  score: Number,
  date: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);
const Quiz = mongoose.model("Quiz", quizSchema);
const Result = mongoose.model("Result", resultSchema);

// ----- Students API -----
app.get("/students", async (_, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", async (req, res) => {
  const stu = new Student(req.body);
  await stu.save();
  res.json(stu);
});

app.put("/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// ----- Quizzes API -----
app.get("/quizzes", async (_, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

app.get("/quizzes/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
});

app.post("/quizzes", async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.json(quiz);
});

app.put("/quizzes/:id", async (req, res) => {
  const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/quizzes/:id", async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.post("/quizzes/:id/questions", async (req, res) => {
  try {
    const { q, options, answer } = req.body;
    if (!q || !Array.isArray(options) || options.length < 2 || answer === undefined) {
      return res.status(400).json({ error: "Invalid question data" });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.questions.push({ q, options, answer });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding question" });
  }
});

// ----- Results API -----
app.post("/results", async (req, res) => {
  try {
    const { studentId, studentRoll, quizId, quizTitle, answers, score } = req.body;
    const result = new Result({ studentId, studentRoll, quizId, quizTitle, answers, score });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
});

app.get("/results", async (_, res) => {
  const results = await Result.find();
  res.json(results);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
