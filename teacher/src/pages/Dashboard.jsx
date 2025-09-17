import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const[assignment,setAssignments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5008/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.log("err : ", err));
  }, []); // Added [] so it only fetches once

  useEffect(() => {
    fetch("http://localhost:5005/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.log("ERROR : ", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:7002/api/submissions")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.log("ERROR : ", err));
  }, []);

  return (
    <div className="container">
      <h3 className="mb-4">Dashboard</h3>
      <div className="row">
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Assigned Courses</h6>
            <h3>{courses.length}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Students</h6>
            <h3>{students.length}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Assignments Created</h6>
            <h3>{assignment.length}</h3>
          </div>
        </div>
      
      </div>
    </div>
  );
}
