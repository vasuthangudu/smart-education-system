import React from "react";

export default function Dashboard() {
  return (
    <div className="container">
      <h3 className="mb-4">Dashboard</h3>
      <div className="row">
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Assigned Courses</h6>
            <h3>4</h3>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Total Students</h6>
            <h3>120</h3>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Assignments Created</h6>
            <h3>12</h3>
          </div>
        </div>
        <div className="col-md-3 col-6 mb-3">
          <div className="card text-center shadow-sm p-3">
            <h6>Upcoming Classes</h6>
            <h3>3</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
