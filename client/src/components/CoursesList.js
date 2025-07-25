import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CoursesList.css';

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <header className="courses-header">
        <h1>Language Courses</h1>
        <p>Choose a course to start learning</p>
      </header>
      
      <div className="courses-grid">
        {courses.map((course) => (
          <Link 
            key={course.id} 
            to={`/courses/${course.id}`} 
            className="course-card"
          >
            <div className="course-image">
              <img src={course.thumbnailImageUrl} alt={course.title} />
            </div>
            <div className="course-content">
              <h2 className="course-title">{course.title}</h2>
              <p className="course-subtitle">{course.subtitle}</p>
              <div className="course-meta">
                <span className="course-language">{course.language}</span>
                <span className="course-lessons">{course.lessons.length} lessons</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesList; 