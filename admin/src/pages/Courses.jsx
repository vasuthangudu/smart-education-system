import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = "http://localhost:5005/api/courses";

export default function CoursesUI() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourse, setEditCourse] = useState(null);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => { try { const res = await axios.get(BASE_URL); setCourses(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => { if (window.confirm("Are you sure to delete this course?")) { try { await axios.delete(`${BASE_URL}/${id}`); setCourses(courses.filter(c => c._id !== id)); } catch (err) { console.error(err); } } };

  const handleSaveCourse = async (course, files) => { if (!course.subject || !course.department || !course.faculty) return alert("Please fill all required fields."); const formData = new FormData(); formData.append("subject", course.subject); formData.append("department", course.department); formData.append("faculty", course.faculty); formData.append("videos", JSON.stringify(course.videos || [])); if (files) { for (let file of files) formData.append("materials", file); } if (course.materials) formData.append("existingMaterials", JSON.stringify(course.materials)); try { let res; if (course._id) { res = await axios.put(`${BASE_URL}/${course._id}`, formData); setCourses(courses.map(c => c._id === course._id ? res.data : c)); } else { res = await axios.post(BASE_URL, formData); setCourses([res.data, ...courses]); } setEditCourse(null); } catch (err) { console.error(err); } };

  const filteredCourses = courses.filter(c => c.subject.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-primary">Courses Management</h3>
      <div className="d-flex gap-2 mb-3">
        <input type="text" className="form-control" placeholder="Search by subject..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-primary ms-auto" onClick={() => setEditCourse({ subject: "", department: "", faculty: "", videos: [], materials: [] })}>+ Add Course</button>
      </div>
      {loading ? <p>Loading courses...</p> : (
        <div className="row row-cols-1 row-cols-md-3 g-2">
          {filteredCourses.length === 0 && <p className="text-center">No courses found.</p>}
          {filteredCourses.map(course => (
            <div className="col" key={course._id}>
              <div className="card shadow-sm h-100 small">
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{course.subject}</h6>
                  <p className="card-text mb-1"><strong>Dept:</strong> {course.department}</p>
                  <p className="card-text mb-1"><strong>Faculty:</strong> {course.faculty}</p>
                  {course.videos?.map((v,i)=>(<div className="ratio ratio-16x9 mb-1" key={i}><iframe src={v.url} title={v.title} allowFullScreen></iframe></div>))}
                  <ul className="list-unstyled small mb-1">{course.materials?.map((m,i)=>(<li key={i}><a href={m.url} target="_blank" rel="noreferrer" download>📄 {m.name}</a></li>))}</ul>
                  <div className="mt-auto d-flex gap-1">
                    <button className="btn btn-sm btn-warning w-50" onClick={()=>setEditCourse(course)}>Edit</button>
                    <button className="btn btn-sm btn-danger w-50" onClick={()=>handleDelete(course._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editCourse && <CourseModal course={editCourse} onClose={()=>setEditCourse(null)} onSave={handleSaveCourse} />}
    </div>
  );
}

function CourseModal({ course, onClose, onSave }) {
  const [localCourse, setLocalCourse] = useState(course);
  const [files, setFiles] = useState([]);
  const handleFileChange = e=>setFiles([...e.target.files]);

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{course._id?"Edit Course":"Add Course"}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex flex-column gap-2">
            <input type="text" className="form-control" placeholder="Subject" value={localCourse.subject} onChange={e=>setLocalCourse({...localCourse,subject:e.target.value})} />
            <input type="text" className="form-control" placeholder="Department" value={localCourse.department} onChange={e=>setLocalCourse({...localCourse,department:e.target.value})} />
            <input type="text" className="form-control" placeholder="Faculty" value={localCourse.faculty} onChange={e=>setLocalCourse({...localCourse,faculty:e.target.value})} />
            {localCourse.videos?.map((v,i)=>(<input key={i} type="text" className="form-control" placeholder={`Video URL ${i+1}`} value={v.url||v} onChange={e=>{const updated=[...localCourse.videos];updated[i]={title:`Video ${i+1}`,url:e.target.value};setLocalCourse({...localCourse,videos:updated});}}/>))}
            <button className="btn btn-sm btn-secondary" onClick={()=>setLocalCourse({...localCourse,videos:[...localCourse.videos,{title:"",url:""}]})}>+ Add Video</button>
            <input type="file" multiple className="form-control" onChange={handleFileChange}/>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={()=>onSave(localCourse,files)}>{course._id?"Update":"Add"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
