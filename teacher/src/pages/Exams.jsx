import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TeacherQuizAdmin() {
  const DBKEY = "sedu_teacher_db_v2";
  const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

  // ---------- Load & Save ----------
  const readDB = () =>
    JSON.parse(
      localStorage.getItem(DBKEY) ||
        JSON.stringify({ students: [], questions: [], quizzes: [] })
    );
  const writeDB = (db) => localStorage.setItem(DBKEY, JSON.stringify(db));

  const [db, setDb] = useState(readDB());
  useEffect(() => writeDB(db), [db]);

  // ---------- Student list ----------
  const [stuForm, setStuForm] = useState({ roll: "", pass: "" });
  const addStudent = () => {
    if (!stuForm.roll.trim() || !stuForm.pass.trim()) return;
    setDb((d) => ({
      ...d,
      students: [...d.students, { id: uid("stu"), ...stuForm }],
    }));
    setStuForm({ roll: "", pass: "" });
  };
  const removeStudent = (id) =>
    setDb((d) => ({ ...d, students: d.students.filter((s) => s.id !== id) }));

  // ---------- Question Bank ----------
  const [qForm, setQForm] = useState({
    text: "",
    opts: ["", "", "", ""],
    answer: 0,
  });
  const addQuestion = () => {
    if (!qForm.text.trim() || qForm.opts.some((o) => !o.trim())) return;
    setDb((d) => ({
      ...d,
      questions: [...d.questions, { id: uid("q"), ...qForm }],
    }));
    setQForm({ text: "", opts: ["", "", "", ""], answer: 0 });
  };
  const delQuestion = (id) =>
    setDb((d) => ({ ...d, questions: d.questions.filter((q) => q.id !== id) }));

  // ---------- Quiz ----------
  const [quizForm, setQuizForm] = useState({
    title: "",
    startAt: "",
    endAt: "",
    qids: [],
  });
  const toggleQ = (qid) =>
    setQuizForm((f) => ({
      ...f,
      qids: f.qids.includes(qid)
        ? f.qids.filter((id) => id !== qid)
        : [...f.qids, qid],
    }));

  const saveQuiz = () => {
    const { title, startAt, endAt, qids } = quizForm;
    if (!title || !startAt || !endAt || qids.length === 0)
      return alert("Fill all quiz fields and add questions");
    setDb((d) => ({
      ...d,
      quizzes: [...d.quizzes, { id: uid("quiz"), ...quizForm }],
    }));
    setQuizForm({ title: "", startAt: "", endAt: "", qids: [] });
    alert("Quiz saved!");
  };

  // ---------- Render ----------
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Smart-Education — Teacher Admin</h2>

      {/* Approved Students */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">Approved Students</div>
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Roll Number"
                value={stuForm.roll}
                onChange={(e) => setStuForm({ ...stuForm, roll: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Password"
                value={stuForm.pass}
                onChange={(e) => setStuForm({ ...stuForm, pass: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success w-100" onClick={addStudent}>
                Add Student
              </button>
            </div>
          </div>
          {db.students.map((s) => (
            <div key={s.id} className="d-flex justify-content-between border p-2 mb-1">
              <div>
                <strong>{s.roll}</strong> — {s.pass}
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeStudent(s.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Question Bank */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-secondary text-white">Question Bank</div>
        <div className="card-body">
          <input
            className="form-control mb-2"
            placeholder="Question text"
            value={qForm.text}
            onChange={(e) => setQForm({ ...qForm, text: e.target.value })}
          />
          {qForm.opts.map((o, i) => (
            <div key={i} className="input-group mb-2">
              <span className="input-group-text">Option {i + 1}</span>
              <input
                className="form-control"
                value={o}
                onChange={(e) =>
                  setQForm((f) => {
                    const opts = [...f.opts];
                    opts[i] = e.target.value;
                    return { ...f, opts };
                  })
                }
              />
              <div className="input-group-text">
                <input
                  type="radio"
                  name="correct"
                  checked={qForm.answer === i}
                  onChange={() => setQForm({ ...qForm, answer: i })}
                />
              </div>
            </div>
          ))}
          <button className="btn btn-primary mb-3" onClick={addQuestion}>
            Add Question
          </button>

          {db.questions.map((q) => (
            <div key={q.id} className="border p-2 mb-2">
              <strong>{q.text}</strong>
              <ul className="mb-1">
                {q.opts.map((o, i) => (
                  <li
                    key={i}
                    className={i === q.answer ? "fw-bold text-success" : ""}
                  >
                    {o}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => delQuestion(q.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Quiz */}
      <div className="card shadow-sm">
        <div className="card-header bg-info">Create Quiz</div>
        <div className="card-body">
          <input
            className="form-control mb-2"
            placeholder="Quiz Title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
          />
          <label className="form-label">Start Date & Time</label>
          <input
            type="datetime-local"
            className="form-control mb-2"
            value={quizForm.startAt}
            onChange={(e) => setQuizForm({ ...quizForm, startAt: e.target.value })}
          />
          <label className="form-label">End Date & Time</label>
          <input
            type="datetime-local"
            className="form-control mb-3"
            value={quizForm.endAt}
            onChange={(e) => setQuizForm({ ...quizForm, endAt: e.target.value })}
          />

          <h6>Select Questions</h6>
          {db.questions.map((q) => (
            <div key={q.id} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={quizForm.qids.includes(q.id)}
                onChange={() => toggleQ(q.id)}
              />
              <label className="form-check-label">{q.text}</label>
            </div>
          ))}

          <button className="btn btn-success mt-3" onClick={saveQuiz}>
            Save Quiz
          </button>

          {db.quizzes.length > 0 && (
            <div className="mt-4">
              <h6>Existing Quizzes</h6>
              {db.quizzes.map((q) => (
                <div key={q.id} className="border p-2 mb-1">
                  <strong>{q.title}</strong> — {q.qids.length} Qs  
                  <br />
                  {q.startAt} → {q.endAt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
