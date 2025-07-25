import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CoursesList from './components/CoursesList';
import CourseDetail from './components/CourseDetail';
import LessonDetail from './components/LessonDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/lessons/:lessonId" element={<LessonDetail />} />
          <Route path="/" element={<Navigate to="/courses" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
