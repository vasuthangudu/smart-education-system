import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Exams() {
  const [view, setView] = useState("list"); // "list" | "add" | "students"
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    startDate: "",
    endDate: "",
    duration: 0,
    maxMarks: 0,
    negativeMarking: false,
    shuffleQuestions: false,
    allowedAttempts: 1,
    questions: [],
    students: [], // { email, password }
  });

  // Quiz functions
  const handleQuizSave = () => {
    if (!quizForm.title || !quizForm.subject || !quizForm.class) {
      alert("Please fill all required fields!");
      return;
    }
    if (editingQuiz) {
      setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...editingQuiz, ...quizForm } : q));
    } else {
      setQuizzes([...quizzes, { ...quizForm, id: Date.now() }]);
    }
    setEditingQuiz(null);
    setQuizForm({
      title: "",
      description: "",
      subject: "",
      class: "",
      startDate: "",
      endDate: "",
      duration: 0,
      maxMarks: 0,
      negativeMarking: false,
      shuffleQuestions: false,
      allowedAttempts: 1,
      questions: [],
      students: [],
    });
    setView("list");
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({ ...quiz });
    setView("add");
  };

  const handleDeleteQuiz = (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  // Question management
  const addQuestion = () => {
    const question = {
      id: Date.now(),
      type: "MCQ",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 1,
      hint: "",
      difficulty: "medium",
      resources: [],
    };
    setQuizForm({ ...quizForm, questions: [...quizForm.questions, question] });
  };

  const handleQuestionChange = (qid, field, value, optionIndex = null) => {
    const updatedQuestions = quizForm.questions.map(q => {
      if (q.id === qid) {
        if (field === "options" && optionIndex !== null) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuizForm({ ...quizForm, questions: updatedQuestions });
  };

  const deleteQuestion = (qid) => {
    setQuizForm({ ...quizForm, questions: quizForm.questions.filter(q => q.id !== qid) });
  };

  // Student management
  const addStudent = () => {
    setQuizForm({ ...quizForm, students: [...quizForm.students, { email: "", password: "" }] });
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = quizForm.students.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setQuizForm({ ...quizForm, students: updatedStudents });
  };

  const deleteStudent = (index) => {
    const updatedStudents = quizForm.students.filter((_, i) => i !== index);
    setQuizForm({ ...quizForm, students: updatedStudents });
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">📚 Teacher Exam/Quiz Dashboard</h1>

      {/* Navigation */}
      <div className="mb-4">
        <button className={`btn me-2 ${view === "list" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("list")}>Quiz List</button>
        <button className={`btn me-2 ${view === "add" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("add")}>{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</button>
        <button className={`btn ${view === "students" ? "btn-info" : "btn-outline-info"}`} onClick={() => setView("students")}>Assign Students</button>
      </div>

      {/* Quiz List */}
      {view === "list" && (
        <div>
          {quizzes.length === 0 ? <p>No quizzes available. Add a new quiz.</p> : (
            <div className="row">
              {quizzes.map(q => (
                <div key={q.id} className="col-md-6 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>{q.title}</h5>
                      <p>Subject: {q.subject} | Class: {q.class}</p>
                      <p>Start: {q.startDate} | End: {q.endDate}</p>
                      <p>Duration: {q.duration} min | Max Marks: {q.maxMarks}</p>
                      <p>Assigned Students: {q.students.length}</p>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEditQuiz(q)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuiz(q.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Quiz */}
      {view === "add" && (
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">{editingQuiz ? "✏️ Edit Quiz" : "➕ Add New Quiz"}</h4>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input type="text" className="form-control" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="2" value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Subject *</label>
            <input type="text" className="form-control" value={quizForm.subject} onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Class *</label>
            <input type="text" className="form-control" value={quizForm.class} onChange={(e) => setQuizForm({ ...quizForm, class: e.target.value })} />
          </div>
          <div className="mb-3 row">
            <div className="col">
              <label className="form-label">Start Date/Time</label>
              <input type="datetime-local" className="form-control" value={quizForm.startDate} onChange={(e) => setQuizForm({ ...quizForm, startDate: e.target.value })} />
            </div>
            <div className="col">
              <label className="form-label">End Date/Time</label>
              <input type="datetime-local" className="form-control" value={quizForm.endDate} onChange={(e) => setQuizForm({ ...quizForm, endDate: e.target.value })} />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col">
              <label className="form-label">Duration (minutes)</label>
              <input type="number" className="form-control" value={quizForm.duration} onChange={(e) => setQuizForm({ ...quizForm, duration: e.target.value })} />
            </div>
            <div className="col">
              <label className="form-label">Max Marks</label>
              <input type="number" className="form-control" value={quizForm.maxMarks} onChange={(e) => setQuizForm({ ...quizForm, maxMarks: e.target.value })} />
            </div>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" className="form-check-input" checked={quizForm.shuffleQuestions} onChange={(e) => setQuizForm({ ...quizForm, shuffleQuestions: e.target.checked })} />
            <label className="form-check-label">Shuffle Questions/Options</label>
          </div>
          <div className="form-check mb-2">
            <input type="checkbox" className="form-check-input" checked={quizForm.negativeMarking} onChange={(e) => setQuizForm({ ...quizForm, negativeMarking: e.target.checked })} />
            <label className="form-check-label">Enable Negative Marking</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Allowed Attempts</label>
            <input type="number" className="form-control" value={quizForm.allowedAttempts} onChange={(e) => setQuizForm({ ...quizForm, allowedAttempts: e.target.value })} />
          </div>

          {/* Questions */}
          <h5 className="mt-3">Questions</h5>
          <button className="btn btn-sm btn-outline-primary mb-2" onClick={addQuestion}>Add Question</button>
          {quizForm.questions.map((q) => (
            <div key={q.id} className="card p-3 mb-2">
              <div className="d-flex justify-content-between">
                <strong>{q.type} Question</strong>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteQuestion(q.id)}>Delete</button>
              </div>
              <input type="text" className="form-control mb-1" placeholder="Question text" value={q.text} onChange={(e) => handleQuestionChange(q.id, "text", e.target.value)} />
              {q.type === "MCQ" && q.options.map((opt, idx) => (
                <input key={idx} type="text" className="form-control mb-1" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => handleQuestionChange(q.id, "options", e.target.value, idx)} />
              ))}
              <input type="text" className="form-control mb-1" placeholder="Correct Answer" value={q.correctAnswer} onChange={(e) => handleQuestionChange(q.id, "correctAnswer", e.target.value)} />
              <input type="number" className="form-control mb-1" placeholder="Marks" value={q.marks} onChange={(e) => handleQuestionChange(q.id, "marks", e.target.value)} />
              <input type="text" className="form-control mb-1" placeholder="Hint / Explanation" value={q.hint} onChange={(e) => handleQuestionChange(q.id, "hint", e.target.value)} />
            </div>
          ))}

          {/* Save / Cancel */}
          <div className="mt-3">
            <button className="btn btn-success me-2" onClick={handleQuizSave}>{editingQuiz ? "Update Quiz" : "Add Quiz"}</button>
            <button className="btn btn-outline-secondary" onClick={() => { setView("list"); setEditingQuiz(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Assign Students */}
      {view === "students" && (
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3">Assign Students to Quiz</h4>
          <button className="btn btn-sm btn-outline-primary mb-2" onClick={addStudent}>Add Student</button>
          {quizForm.students.map((s, idx) => (
            <div key={idx} className="mb-2 d-flex gap-2 align-items-center">
              <input type="email" className="form-control" placeholder="Student Email" value={s.email} onChange={(e) => handleStudentChange(idx, "email", e.target.value)} />
              <input type="password" className="form-control" placeholder="Password" value={s.password} onChange={(e) => handleStudentChange(idx, "password", e.target.value)} />
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteStudent(idx)}>Delete</button>
            </div>
          ))}
          <div className="mt-3">
            <button className="btn btn-success me-2" onClick={() => { alert("Students assigned!"); setView("list"); }}>Save Students</button>
            <button className="btn btn-outline-secondary" onClick={() => setView("list")}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
