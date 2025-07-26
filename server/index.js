const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = require('http').createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Helper function to read JSON files
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, 'assets', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Helper function to find course by ID
function findCourseById(courses, courseId) {
  return courses.find(course => course.id === courseId);
}

// Helper function to find lesson by ID across all courses
function findLessonById(courses, lessonId) {
  for (const course of courses) {
    const lesson = course.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) {
      return { course, lesson };
    }
  }
  return null;
}

// WebSocket connection handling
wss.on('connection', async (ws) => {
  console.log('WebSocket client connected');
  
  let audioChunks = [];
  let transcriptionChunks = [];
  let isRecording = false;

  try {
    // Load audio and transcription data
    const audioData = await readJsonFile('audio.json');
    const transcriptionData = await readJsonFile('transcriptions.json');
    
    audioChunks = audioData;
    transcriptionChunks = transcriptionData;
  } catch (error) {
    console.error('Error loading audio/transcription data:', error);
    ws.send(JSON.stringify({ 
      type: 'error', 
      message: 'Failed to load audio data' 
    }));
    return;
  }

  // Handle incoming messages
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'start_recording':
          console.log('Recording started');
          isRecording = true;
          ws.send(JSON.stringify({ 
            type: 'recording_started',
            message: 'Recording started successfully'
          }));
          
          // Simulate sending audio chunks and receiving transcriptions
          simulateRecording(ws, audioChunks, transcriptionChunks);
          break;
          
        case 'stop_recording':
          console.log('Recording stopped');
          isRecording = false;
          ws.send(JSON.stringify({ 
            type: 'recording_stopped',
            message: 'Recording stopped successfully'
          }));
          break;
          
        case 'audio_chunk':
          // In a real app, this would process actual audio
          // For simulation, we just acknowledge receipt
          console.log('Received audio chunk:', data.chunkId);
          ws.send(JSON.stringify({ 
            type: 'audio_chunk_received',
            chunkId: data.chunkId
          }));
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    isRecording = false;
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Simulate recording process
async function simulateRecording(ws, audioChunks, transcriptionChunks) {
  console.log('Starting recording simulation...');
  
  for (let i = 0; i < audioChunks.length; i++) {
    // Check if recording was stopped
    if (!ws.readyState === WebSocket.OPEN) {
      break;
    }
    
    const audioChunk = audioChunks[i];
    const transcriptionChunk = transcriptionChunks[i];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Send transcription chunk back to client
    ws.send(JSON.stringify({
      type: 'transcription_chunk',
      chunkId: audioChunk.id,
      text: transcriptionChunk.text,
      isFinal: audioChunk.isFinal
    }));
    
    console.log(`Sent transcription chunk ${i + 1}/${audioChunks.length}: "${transcriptionChunk.text}"`);
  }
  
  // Send final transcription complete message
  ws.send(JSON.stringify({
    type: 'transcription_complete',
    message: 'Transcription completed'
  }));
  
  console.log('Recording simulation completed');
}

// API Routes

// GET /api/courses - Return list of all courses
app.get('/api/courses', async (req, res) => {
  try {
    const data = await readJsonFile('course.json');
    res.json(data.courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:courseId - Return course details and lessons
app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const data = await readJsonFile('course.json');
    const course = findCourseById(data.courses, courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// GET /api/lessons/:lessonId - Return lesson details
app.get('/api/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const data = await readJsonFile('course.json');
    const result = findLessonById(data.courses, lessonId);
    
    if (!result) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    const { course, lesson } = result;
    
    // Return lesson with course context
    res.json({
      lesson,
      course: {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        language: course.language
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// GET /api/audio - Return audio chunks for simulation
app.get('/api/audio', async (req, res) => {
  try {
    const audioData = await readJsonFile('audio.json');
    res.json(audioData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audio data' });
  }
});

// GET /api/transcriptions - Return transcription data
app.get('/api/transcriptions', async (req, res) => {
  try {
    const transcriptionData = await readJsonFile('transcriptions.json');
    res.json(transcriptionData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcription data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}`);
}); 