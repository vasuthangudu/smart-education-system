import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:6001";

export default function StudentPanel() {
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(null);

  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/students`).then(res => setStudents(res.data || []));
    axios.get(`${API}/quizzes`).then(res => setQuizzes(res.data || []));
  }, []);

  const login = () => {
    const stu = students.find(s => s.roll === roll && s.password === password);
    if (!stu) return alert("Invalid login");
    setLoggedIn(stu);
  };

  const availableQuizzes = quizzes.filter(q => {
    const now = new Date();
    return now >= new Date(q.start) && now <= new Date(q.end);
  });

  const startQuiz = async (quiz) => {
    const { data } = await axios.get(`${API}/quizzes/${quiz._id}`);
    setCurrentQuiz(data);
    setCurrentIndex(0);
    setAnswers(Array(data.questions?.length || 0).fill(null));
    setScore(null);
  };

  const selectAnswer = (idx) => {
    const newAns = [...answers];
    newAns[currentIndex] = idx;
    setAnswers(newAns);
  };

  const nextQ = () => {
    if (currentIndex < currentQuiz.questions.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevQ = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const submitQuiz = async () => {
    let sc = 0;
    currentQuiz.questions.forEach((q, i) => { if (answers[i] === q.answer) sc++; });
    setScore(sc);

    await axios.post(`${API}/results`, {
      studentId: loggedIn._id,
      studentRoll: loggedIn.roll,
      quizId: currentQuiz._id,
      quizTitle: currentQuiz.title,
      answers,
      score: sc,
    });
  };

  const gradientCardStyle = {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "#fff",
    minHeight: "80vh",
    borderRadius: "15px",
  };

  const buttonGradient = "linear-gradient(45deg, #ff6a00, #ee0979)";

  return (
    <div className="container my-4">
      <div className="card p-4" style={gradientCardStyle}>
        {!loggedIn && (
          <div className="d-flex flex-column flex-md-row gap-2">
            <input placeholder="Roll" value={roll} onChange={e => setRoll(e.target.value)} className="form-control"/>
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control"/>
            <button className="btn" style={{ background: buttonGradient, color: "#fff" }} onClick={login}>Login</button>
          </div>
        )}

        {loggedIn && !currentQuiz && (
          <>
            <h4 className="mt-3 text-center">Welcome, {loggedIn.name}</h4>
            <ul className="list-group mt-3">
              {availableQuizzes.length === 0 && <li className="list-group-item text-center">No active quizzes</li>}
              {availableQuizzes.map(q => (
                <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{q.title}</span>
                  <button className="btn btn-sm" style={{ background: buttonGradient, color: "#fff" }} onClick={() => startQuiz(q)}>Start</button>
                </li>
              ))}
            </ul>
          </>
        )}

        {currentQuiz && score === null && (
          <>
            <h4 className="mt-3">{currentQuiz.title}</h4>
            <p className="fw-bold">Q{currentIndex + 1}: {currentQuiz.questions[currentIndex].q}</p>
            <div className="d-flex flex-column gap-2 mb-3">
              {currentQuiz.questions[currentIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`btn ${answers[currentIndex] === idx ? "btn-light text-dark fw-bold" : "btn-outline-light"}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="d-flex justify-content-between flex-wrap gap-2">
              <button className="btn btn-secondary" onClick={prevQ}>Prev</button>
              <button className="btn btn-secondary" onClick={nextQ}>Next</button>
              <button className="btn btn-success" onClick={submitQuiz}>Submit</button>
            </div>
          </>
        )}

        {score !== null && (
          <>
            <h4 className="mt-3 text-center">Score: {score}/{currentQuiz.questions.length}</h4>
            <div className="text-center mt-3">
              <button className="btn" style={{ background: buttonGradient, color: "#fff" }} onClick={() => navigate("/")}>Back to Home</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
