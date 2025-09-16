import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "http://localhost:6001";

export default function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [filterRoll, setFilterRoll] = useState("");
  const [filterQuiz, setFilterQuiz] = useState("");

  const [roll, setRoll] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [qText, setQText] = useState("");
  const [options, setOptions] = useState("");
  const [answerIdx, setAnswerIdx] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchQuizzes();
    fetchResults();
  }, []);

  const fetchStudents = async () => setStudents((await axios.get(`${API}/students`)).data || []);
  const fetchQuizzes = async () => setQuizzes((await axios.get(`${API}/quizzes`)).data || []);
  const fetchResults = async () => setResults((await axios.get(`${API}/results`)).data || []);

  // --- Students ---
  const addStudent = async () => {
    if (!roll || !name || !pass) return alert("Fill all fields");
    await axios.post(`${API}/students`, { roll, name, password: pass });
    setRoll(""); setName(""); setPass(""); fetchStudents();
  };

  const editStudent = async (s) => {
    const newName = prompt("Edit Name", s.name);
    const newPass = prompt("Edit Password", s.password);
    if (newName && newPass) {
      await axios.put(`${API}/students/${s._id}`, { ...s, name: newName, password: newPass });
      fetchStudents();
    }
  };

  const deleteStudent = async (id) => { if (window.confirm("Delete student?")) { await axios.delete(`${API}/students/${id}`); fetchStudents(); } };

  // --- Quizzes ---
  const createQuiz = async () => {
    if (!title || !start || !end) return alert("Fill all fields");
    const { data } = await axios.post(`${API}/quizzes`, { title, start, end, questions: [] });
    setCurrentQuizId(data._id); setTitle(""); setStart(""); setEnd(""); fetchQuizzes(); alert("Quiz Created! Add questions now.");
  };

  const editQuiz = async (q) => {
    const newTitle = prompt("Edit Quiz Title", q.title);
    if (!newTitle) return;
    const newStart = prompt("Edit Start DateTime", new Date(q.start).toISOString().slice(0,16));
    const newEnd = prompt("Edit End DateTime", new Date(q.end).toISOString().slice(0,16));
    await axios.put(`${API}/quizzes/${q._id}`, { ...q, title: newTitle, start: newStart, end: newEnd });
    fetchQuizzes();
  };

  const deleteQuiz = async (id) => { if (window.confirm("Delete quiz?")) { await axios.delete(`${API}/quizzes/${id}`); fetchQuizzes(); } };

  const addQuestion = async () => {
    if (!qText || options.split(",").length < 2 || answerIdx === "") return alert("Fill correctly");
    await axios.post(`${API}/quizzes/${currentQuizId}/questions`, {
      q: qText, options: options.split(",").map(o => o.trim()), answer: parseInt(answerIdx)
    });
    setQText(""); setOptions(""); setAnswerIdx(""); fetchQuizzes();
  };

  const deleteQuestion = async (quizId, qIndex) => {
    const quiz = quizzes.find(q => q._id === quizId);
    if (!quiz) return;
    quiz.questions.splice(qIndex,1);
    await axios.put(`${API}/quizzes/${quizId}`, quiz);
    fetchQuizzes();
  };

  // --- Results ---
  const deleteResult = async (id) => {
    if (window.confirm("Delete this result?")) {
      await axios.delete(`${API}/results/${id}`);
      fetchResults();
    }
  };

  const exportResults = () => {
    const dataToExport = filteredResults.map(r => ({
      Roll: r.studentRoll,
      Quiz: r.quizTitle,
      Score: r.score,
      Date: new Date(r.date).toLocaleString()
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "quiz_results.xlsx");
  };

  const filteredResults = results
    .filter(r => filterRoll ? r.studentRoll.includes(filterRoll) : true)
    .filter(r => filterQuiz ? r.quizTitle.includes(filterQuiz) : true);

  return (
    <div className="p-3">
      {/* Students & Quizzes UI (same as before) */}
      <div className="row mb-3">
        <div className="col-md-6">
          <h5>Students</h5>
          <div className="d-flex gap-2 mb-2">
            <input placeholder="Roll" value={roll} onChange={e=>setRoll(e.target.value)} className="form-control"/>
            <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="form-control"/>
            <input placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} className="form-control"/>
            <button className="btn btn-success" onClick={addStudent}>Add</button>
          </div>
          <ul className="list-group">
            {students.map(s => 
              <li key={s._id} className="list-group-item d-flex justify-content-between">
                {s.roll} - {s.name}
                <div>
                  <button className="btn btn-warning btn-sm me-1" onClick={()=>editStudent(s)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>deleteStudent(s._id)}>Delete</button>
                </div>
              </li>)}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Quizzes</h5>
          <div className="d-flex gap-2 mb-2">
            <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="form-control"/>
            <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} className="form-control"/>
            <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} className="form-control"/>
            <button className="btn btn-primary" onClick={createQuiz}>Create</button>
          </div>
          <h6>Add Question</h6>
          <div className="d-flex gap-2 mb-2">
            <input placeholder="Question" value={qText} onChange={e=>setQText(e.target.value)} className="form-control"/>
            <input placeholder="Options (comma separated)" value={options} onChange={e=>setOptions(e.target.value)} className="form-control"/>
            <input placeholder="Ans Index" value={answerIdx} onChange={e=>setAnswerIdx(e.target.value)} className="form-control"/>
            <button className="btn btn-success" onClick={addQuestion}>Add</button>
          </div>
          <ul className="list-group">
            {quizzes.map((q) => 
              <li key={q._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{q.title} | Questions: {q.questions?.length || 0}</span>
                  <div>
                    <button className="btn btn-warning btn-sm me-1" onClick={()=>editQuiz(q)}>Edit</button>
                    <button className="btn btn-danger btn-sm me-1" onClick={()=>deleteQuiz(q._id)}>Delete</button>
                  </div>
                </div>
                <ul className="mt-2 list-group">
                  {q.questions?.map((ques, idx) =>
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      {ques.q} | Ans: {ques.options[ques.answer]}
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteQuestion(q._id, idx)}>Delete</button>
                    </li>
                  )}
                </ul>
              </li>)}
          </ul>
        </div>
      </div>

      {/* Results */}
      <div>
        <h5>Results</h5>
        <div className="d-flex gap-2 mb-2">
          <input placeholder="Filter by Roll" value={filterRoll} onChange={e=>setFilterRoll(e.target.value)} className="form-control"/>
          <input placeholder="Filter by Quiz" value={filterQuiz} onChange={e=>setFilterQuiz(e.target.value)} className="form-control"/>
          <button className="btn btn-success" onClick={exportResults}>Export XL</button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr><th>Roll</th><th>Quiz</th><th>Score</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filteredResults.map(r => 
              <tr key={r._id}>
                <td>{r.studentRoll}</td>
                <td>{r.quizTitle}</td>
                <td>{r.score}</td>
                <td>{new Date(r.date).toLocaleString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={()=>deleteResult(r._id)}>Delete</button></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
