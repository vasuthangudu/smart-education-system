import React, { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, ProgressBar, Table, Badge, Row, Col, Alert } from "react-bootstrap";

// === 📦 Sample JSON Data ===
const overallStats = {
  gpa: 3.7,
  creditsCompleted: 78,
  totalCredits: 120,
  attendance: 88,
  assignmentsSubmitted: 42,
  assignmentsPending: 5,
  quizzesAttempted: 20,
  quizzesMissed: 2,
  avgScore: 82
};

const subjectPerformance = [
  { subject: "Math", score: 85, classAvg: 78 },
  { subject: "Science", score: 90, classAvg: 80 },
  { subject: "History", score: 75, classAvg: 70 },
  { subject: "English", score: 88, classAvg: 84 }
];

const trendData = [
  { week: "Week 1", score: 70 },
  { week: "Week 2", score: 78 },
  { week: "Week 3", score: 85 },
  { week: "Week 4", score: 88 },
  { week: "Week 5", score: 90 }
];

const attendanceMonthly = [
  { month: "Jan", attendance: 85 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 75 },
  { month: "May", attendance: 90 }
];

const upcomingDeadlines = [
  { id: 1, title: "Math Homework 5", due: "2025-09-15" },
  { id: 2, title: "Science Lab Report", due: "2025-09-17" },
  { id: 3, title: "English Essay", due: "2025-09-20" },
  { id: 4, title: "History Quiz", due: "2025-09-22" },
  { id: 5, title: "Science Project", due: "2025-09-25" }
];

const pastAssignments = [
  { id: 1, title: "Math Test 1", grade: "A", feedback: "Great improvement!" },
  { id: 2, title: "Science Quiz", grade: "B+", feedback: "Well done." },
  { id: 3, title: "English Essay 1", grade: "A-", feedback: "Strong argumentation." }
];

const skillsRadar = [
  { subject: "Problem Solving", A: 90, fullMark: 100 },
  { subject: "Collaboration", A: 80, fullMark: 100 },
  { subject: "Communication", A: 85, fullMark: 100 },
  { subject: "Research", A: 75, fullMark: 100 },
  { subject: "Creativity", A: 88, fullMark: 100 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Progress() {
  const [date, setDate] = useState(new Date());
  const attendanceAlert =
    overallStats.attendance < 75 ? (
      <Alert variant="danger">⚠️ Attendance is below 75%!</Alert>
    ) : null;

  return (
    <div className="container mt-4">
      <h2>📊 Student Progress Dashboard</h2>
      {attendanceAlert}

      {/* === Overall Academic Overview === */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h5>GPA</h5>
            <h3>{overallStats.gpa}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Credits Completed</h5>
            <ProgressBar
              now={(overallStats.creditsCompleted / overallStats.totalCredits) * 100}
              label={`${overallStats.creditsCompleted}/${overallStats.totalCredits}`}
            />
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Attendance</h5>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={[{ name: "Present", value: overallStats.attendance },
                    { name: "Absent", value: 100 - overallStats.attendance }]}
                  dataKey="value" outerRadius={60} label
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 shadow-sm text-center">
            <h5>Quick Stats</h5>
            <p>Assignments: {overallStats.assignmentsSubmitted} / {overallStats.assignmentsSubmitted + overallStats.assignmentsPending}</p>
            <p>Quizzes Attempted: {overallStats.quizzesAttempted}</p>
            <p>Avg Score: {overallStats.avgScore}%</p>
          </Card>
        </Col>
      </Row>

      {/* === Subject-wise Performance === */}
      <h4 className="mt-5">📈 Subject-wise Performance</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={subjectPerformance}>
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#8884d8" name="Your Score" />
          <Bar dataKey="classAvg" fill="#82ca9d" name="Class Average" />
        </BarChart>
      </ResponsiveContainer>

      {/* === Assignments & Exams Tracking === */}
      <h4 className="mt-5">📝 Assignments & Exams</h4>
      <Row>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h6>Upcoming Deadlines</h6>
            <ul>
              {upcomingDeadlines.map((d) => (
                <li key={d.id}>{d.title} - <Badge bg="info">{d.due}</Badge></li>
              ))}
            </ul>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h6>Past Performance</h6>
            <Table striped bordered>
              <thead>
                <tr><th>Title</th><th>Grade</th><th>Feedback</th></tr>
              </thead>
              <tbody>
                {pastAssignments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{a.grade}</td>
                    <td>{a.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* === Trend Analysis === */}
      <h4 className="mt-5">📉 Trend Analysis</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* === Attendance Trends === */}
      <h4 className="mt-5">📆 Attendance Trends</h4>
      <Row>
        <Col md={6}>
          <Calendar onChange={setDate} value={date} />
        </Col>
        <Col md={6}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceMonthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* === Engagement & Skills === */}
      <h4 className="mt-5">🌟 Engagement & Skills</h4>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart outerRadius={90} data={skillsRadar}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Skill" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>

      {/* === Recommendations === */}
      <Card className="p-3 mt-5 shadow-sm">
        <h5>💡 Recommendations</h5>
        <ul>
          <li>Review Chapter 5 in Science for better retention.</li>
          <li>Participate in English discussions to improve communication.</li>
          <li>Attend Math remedial class on Friday for extra practice.</li>
        </ul>
      </Card>
    </div>
  );
}
