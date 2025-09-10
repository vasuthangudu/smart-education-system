import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const gradesRef = useRef(null);
  const attendanceRef = useRef(null);
  const gradesChartRef = useRef(null);
  const attendanceChartRef = useRef(null);

  useEffect(() => {
    if (gradesChartRef.current) gradesChartRef.current.destroy();
    if (attendanceChartRef.current) attendanceChartRef.current.destroy();

    gradesChartRef.current = new Chart(gradesRef.current, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Grades (%)",
            data: [75, 80, 85, 88, 92, 95],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    attendanceChartRef.current = new Chart(attendanceRef.current, {
      type: "doughnut",
      data: {
        labels: ["Present", "Absent"],
        datasets: [
          {
            data: [92, 8],
            backgroundColor: ["#16a34a", "#ef4444"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => {
      if (gradesChartRef.current) gradesChartRef.current.destroy();
      if (attendanceChartRef.current) attendanceChartRef.current.destroy();
    };
  }, []);

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Enrolled Courses</h6>
            <h3>6</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Completed Assignments</h6>
            <h3>18</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Attendance</h6>
            <h3>92%</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Upcoming Exams</h6>
            <h3>2</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 shadow-sm mb-4" style={{ height: "300px" }}>
            <h6>Grades Over Time</h6>
            <canvas ref={gradesRef}></canvas>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm mb-4" style={{ height: "300px" }}>
            <h6>Attendance Record</h6>
            <canvas ref={attendanceRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
