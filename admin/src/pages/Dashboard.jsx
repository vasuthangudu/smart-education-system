import React from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Students", data: [200, 400, 600, 800, 1000, 1200], borderColor: "#2563eb", tension: 0.3 },
      { label: "Teachers", data: [20, 30, 50, 60, 70, 85], borderColor: "#16a34a", tension: 0.3 }
    ]
  };

  const pieData = {
    labels: ["Science", "Math", "History", "Arts"],
    datasets: [{ data: [12, 10, 8, 12], backgroundColor: ["#2563eb", "#f97316", "#16a34a", "#e11d48"] }]
  };

  return (
    <div>
      {/* Stats */}
      <div className="row mb-4">

      <div className="col-md-3">
  <div className="card p-3 shadow-sm d-flex align-items-center">
    <img 
      src="https://preskool.dreamstechnologies.com/html/template/assets/img/icons/student.svg" 
      alt="Students" 
      style={{ width: "40px", height: "40px", marginBottom: "10px" }} 
    />
    <h6>Total Students</h6>
    <h3>1,250</h3>
  </div>
</div>


<div className="col-md-3">
  <div className="card p-3 shadow-sm d-flex align-items-center">
    <img
      src="https://preskool.dreamstechnologies.com/html/template/assets/img/icons/teacher.svg"
      alt="Teachers"
      style={{ width: "40px", height: "40px", marginBottom: "10px" }}
    />
    <h6>Total Teachers</h6>
    <h3>85</h3>
  </div>
</div>


<div className="col-md-3">
  <div className="card p-3 shadow-sm d-flex align-items-center">
    <img
      src="https://preskool.dreamstechnologies.com/html/template/assets/img/icons/subject.svg"
      alt="Courses"
      style={{ width: "40px", height: "40px", marginBottom: "10px" }}
    />
    <h6>Total Courses</h6>
    <h3>42</h3>
  </div>
</div>

<div className="col-md-3">
  <div className="card p-3 shadow-sm d-flex align-items-center">
    <img
      src="https://wpassets.adda247.com/wp-content/uploads/multisite/2022/12/20112242/Upcoming-Government-Exam-2023.png"
      alt="Upcoming Exams"
      style={{ width: "40px", height: "40px", marginBottom: "10px" }}
    />
    <h6>Upcoming Exams</h6>
    <h3>5</h3>
  </div>
</div>



      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 shadow-sm mb-4">
            <h6>Student vs Teacher Growth</h6>
            <Line data={lineData} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm mb-4">
            <h6>Course Distribution</h6>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Announcements & Events */}
      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm mb-4">
            <h6>Recent Announcements</h6>
            <ul>
              <li>Exam Schedule Released</li>
              <li>New Course on AI</li>
              <li>Holiday on Sept 12</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm mb-4">
            <h6>Upcoming Events</h6>
            <ul>
              <li>Science Fair - Sept 15</li>
              <li>Workshop on ML - Sept 20</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
