import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetail.css';

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/courses/${courseId}`);
      if (!response.ok) {
        throw new Error('Course not found');
      }
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <div className="error">Error: {error}</div>
        <Link to="/courses" className="back-link">← Back to Courses</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error">Course not found</div>
        <Link to="/courses" className="back-link">← Back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <header className="course-header">
        <Link to="/courses" className="back-button">← Back</Link>
        <div className="course-hero">
          <div className="course-hero-image">
            <img src={course.backgroundImageUrl} alt={course.title} />
          </div>
          <div className="course-hero-content">
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.subtitle}</p>
            <div className="course-meta">
              <span className="course-language">{course.language}</span>
              <span className="course-lessons-count">{course.lessons.length} lessons</span>
            </div>
          </div>
        </div>
      </header>

      <main className="course-main">
        <section className="lessons-section">
          <h2>Lessons</h2>
          <div className="lessons-grid">
            {course.lessons.map((lesson, index) => (
              <Link 
                key={lesson.id} 
                to={`/lessons/${lesson.id}`} 
                className="lesson-card"
              >
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-image">
                  <img src={lesson.thumbnailImageUrl} alt={lesson.title} />
                </div>
                <div className="lesson-content">
                  <h3 className="lesson-title">{lesson.title}</h3>
                  <p className="lesson-subtitle">{lesson.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default CourseDetail;
