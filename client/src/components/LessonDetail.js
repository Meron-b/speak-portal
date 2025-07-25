import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './LessonDetail.css';

function LessonDetail() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const fetchLesson = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/lessons/${lessonId}`);
      if (!response.ok) {
        throw new Error('Lesson not found');
      }
      const data = await response.json();
      setLessonData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
    // TODO: Implement WebSocket connection for recording simulation
    console.log('Record button clicked - recording simulation will be implemented next');
  };

  if (loading) {
    return (
      <div className="lesson-detail-container">
        <div className="loading">Loading lesson...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-detail-container">
        <div className="error">Error: {error}</div>
        <Link to="/courses" className="back-link">← Back to Courses</Link>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="lesson-detail-container">
        <div className="error">Lesson not found</div>
        <Link to="/courses" className="back-link">← Back to Courses</Link>
      </div>
    );
  }

  const { lesson, course } = lessonData;

  return (
    <div className="lesson-detail-container">
      <header className="lesson-header">
        <Link to={`/courses/${course.id}`} className="back-button">← Back</Link>
        <div className="lesson-hero">
          <div className="lesson-hero-image">
            <img src={lesson.thumbnailImageUrl} alt={lesson.title} />
          </div>
          <div className="lesson-hero-content">
            <div className="course-badge">{course.title}</div>
            <h1 className="lesson-title">{lesson.title}</h1>
            <p className="lesson-subtitle">{lesson.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="lesson-main">
        <section className="lesson-content">
          <div className="lesson-info">
            <h2>Practice Speaking</h2>
            <p>Click the record button below to practice pronouncing this phrase.</p>
          </div>

          <div className="recording-section">
            <div className="phrase-display">
              <div className="phrase-original">{lesson.title}</div>
              <div className="phrase-translation">{lesson.subtitle}</div>
            </div>

            <button 
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={handleRecordClick}
            >
              {isRecording ? (
                <>
                  <div className="recording-indicator"></div>
                  Stop Recording
                </>
              ) : (
                <>
                  <div className="record-icon">🎤</div>
                  Start Recording
                </>
              )}
            </button>

            {isRecording && (
              <div className="recording-status">
                <p>Recording in progress...</p>
                <p className="recording-hint">Simulation: Audio chunks will be sent via WebSocket</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LessonDetail;