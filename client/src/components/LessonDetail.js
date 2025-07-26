import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './LessonDetail.css';

function LessonDetail() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const wsRef = useRef(null);

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

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    console.log('Attempting WebSocket connection...');
    
    try {
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          switch (data.type) {
            case 'recording_started':
              console.log('Recording started:', data.message);
              break;
              
            case 'recording_stopped':
              console.log('Recording stopped:', data.message);
              setIsRecording(false);
              break;
              
            case 'transcription_chunk':
              console.log('Received transcription chunk:', data.text);
              setTranscription(prev => prev + data.text);
              break;
              
            case 'transcription_complete':
              console.log('Transcription completed:', data.message);
              setIsRecording(false);
              break;
              
            case 'error':
              console.error('WebSocket error:', data.message);
              setError(data.message);
              break;
              
            default:
              console.log('Unknown WebSocket message:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        setIsRecording(false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
        setError('WebSocket connection failed');
      };
      
      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setIsConnecting(false);
      setError('Failed to connect to recording service');
    }
  }, [isConnecting, isConnected]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleRecordClick = () => {
    if (!isRecording) {
      // Start recording
      if (!isConnected) {
        connectWebSocket();
        // Wait a bit for connection to establish
        setTimeout(() => {
          if (isConnected && wsRef.current) {
            wsRef.current.send(JSON.stringify({ type: 'start_recording' }));
            setIsRecording(true);
            setTranscription(''); // Clear previous transcription
          }
        }, 500);
      } else {
        // Already connected, start recording immediately
        wsRef.current.send(JSON.stringify({ type: 'start_recording' }));
        setIsRecording(true);
        setTranscription('');
      }
    } else {
      // Stop recording
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'stop_recording' }));
      }
      setIsRecording(false);
    }
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
              disabled={isConnecting}
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

            {isConnecting && (
              <div className="connection-status">
                <p>Connecting to recording service...</p>
              </div>
            )}

            {isRecording && (
              <div className="recording-status">
                <p>Recording in progress...</p>
                <p className="recording-hint">Simulation: Audio chunks are being processed</p>
              </div>
            )}

            {transcription && (
              <div className="transcription-display">
                <h3>Your Speech:</h3>
                <div className="transcription-text">{transcription}</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LessonDetail;