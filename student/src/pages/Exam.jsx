import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:7004/api";

export default function Exam() {
  const [roll, setRoll] = useState("");
  const [pass, setPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [student, setStudent] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState({});
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  // ---------------- API Helpers ----------------
  const fetchJSON = (url) => fetch(url).then((r) => r.json());

  // ---------------- Login ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    const list = await fetchJSON(`${API}/students`);
    const found = list.find(
      (s) => s.roll === roll.trim() && s.pass === pass.trim()
    );
    if (!found) return alert("Invalid Roll No or Password");
    setStudent(found);
    setLoggedIn(true);
  };

  // ---------------- Load Quizzes ----------------
  useEffect(() => {
    if (!loggedIn) return;
    fetchJSON(`${API}/quizzes`).then((q) => setQuizzes(q));
  }, [loggedIn]);

  // ---------------- Start Quiz ----------------
  const startQuiz = async (quiz) => {
    // date/time window check
    const now = new Date();
    if (quiz.startAt && now < new Date(quiz.startAt))
      return alert("Quiz has not started yet");
    if (quiz.endAt && now > new Date(quiz.endAt))
      return alert("Quiz window is closed");

    // fetch questions
    const qlist = await fetchJSON(`${API}/questions`);
    const qMap = {};
    quiz.qids.forEach((id) => {
      const q = qlist.find((x) => x.id === id);
      if (q) qMap[id] = q;
    });

    setQuestions(qMap);
    setActiveQuiz(quiz);
    setAnswers({});
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60); // seconds
  };

  // ---------------- Timer ----------------
  useEffect(() => {
    if (!timeLeft) return;
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // ---------------- Submit ----------------
  const submitQuiz = () => {
    let correct = 0;
    Object.keys(answers).forEach((qid) => {
      if (questions[qid] && answers[qid] === questions[qid].answer) correct++;
    });
    alert(
      `Quiz Complete!\nScore: ${correct}/${Object.keys(questions).length}`
    );
    setActiveQuiz(null);
  };

  if (!loggedIn) {
    return (
      <div className="container mt-5" style={{ maxWidth: 420 }}>
        <h3 className="mb-3">Student Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Roll No</label>
            <input
              className="form-control"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    );
  }

  // ---------------- Active Quiz Screen ----------------
  if (activeQuiz) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>{activeQuiz.title}</h4>
          {activeQuiz.timeLimit ? (
            <span className="badge bg-danger">
              Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          ) : null}
        </div>
        {Object.values(questions).map((q, idx) => (
          <div key={q.id} className="card mb-3">
            <div className="card-body">
              <strong>
                Q{idx + 1}. {q.text}
              </strong>
              {q.opts.map((opt, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === i}
                    onChange={() =>
                      setAnswers((a) => ({ ...a, [q.id]: i }))
                    }
                  />
                  <label className="form-check-label">{opt}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-success" onClick={submitQuiz}>
          Submit
        </button>
      </div>
    );
  }

  // ---------------- Quiz List Screen ----------------
  return (
    <div className="container mt-4">
      <h3>Welcome, {student.roll}</h3>
      <p>Select an available quiz:</p>
      {quizzes.length === 0 && <div>No quizzes assigned yet.</div>}
      {quizzes.map((q) => (
        <div key={q.id} className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <strong>{q.title}</strong>
              <div className="small text-muted">
                {q.startAt && `Start: ${q.startAt}`}{" "}
                {q.endAt && `End: ${q.endAt}`}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => startQuiz(q)}>
              Start
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
