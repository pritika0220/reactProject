import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // Persistence Logic 
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('directory_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ name: '', course: '', grade: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('directory_data', JSON.stringify(students));
  }, [students]);

  // Handlers [cite: 36]
  const addStudent = (e) => {
    e.preventDefault();
    if (!form.name || !form.course || !form.grade) return;
    
    const newStudent = { 
      ...form, 
      id: Date.now(), 
      grade: Number(form.grade), 
      isPresent: true 
    };
    setStudents([newStudent, ...students]);
    setForm({ name: '', course: '', grade: '' });
  };

  const toggleStatus = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  // List Processing [cite: 13, 41]
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>Student Directory</h1>
        
        
        <div className="input-wrapper" style={{ maxWidth: '400px', marginBottom: '24px' }}>
          <input 
            placeholder="Search by student name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </header>

      {/* REUSABLE ADD FORM SECTION [cite: 79] */}
      <form className="form-card" onSubmit={addStudent}>
        <div className="input-wrapper">
          <label>Student Name</label>
          <input 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            placeholder="Enter name" 
          />
        </div>
        <div className="input-wrapper">
          <label>Course</label>
          <input 
            value={form.course} 
            onChange={e => setForm({...form, course: e.target.value})} 
            placeholder="e.g. React" 
          />
        </div>
        <div className="input-wrapper">
          <label>Grade</label>
          <input 
            type="number"
            value={form.grade} 
            onChange={e => setForm({...form, grade: e.target.value})} 
            placeholder="0-100" 
          />
        </div>
        <button type="submit" className="btn-primary">Add Student</button>
      </form>

      {/* CONDITIONAL RENDERING: Empty States [cite: 50, 52] */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
          <p style={{ fontSize: '1.2rem' }}>No student records found.</p>
        </div>
      ) : (
        <div className="student-grid">
          {filtered.map(student => (
            <div key={student.id} className="student-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                {/* CONDITIONAL RENDERING: Top Performer [cite: 57] */}
                {student.grade >= 90 ? <span className="badge badge-top">⭐ Top Performer</span> : <span></span>}
                <button 
                  onClick={() => deleteStudent(student.id)}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
                >✕</button>
              </div>
              
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>{student.name}</h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>{student.course}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{student.grade}%</div>
                {/* CONDITIONAL RENDERING: Status Badge [cite: 53] */}
                <span className={`badge ${student.isPresent ? 'badge-present' : 'badge-absent'}`}>
                  {student.isPresent ? '• Present' : '• Absent'}
                </span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '20px', background: student.isPresent ? '#f1f5f9' : '#6366f1', color: student.isPresent ? '#1e293b' : 'white' }}
                onClick={() => toggleStatus(student.id)}
              >
                {student.isPresent ? 'Mark Absent' : 'Mark Present'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;