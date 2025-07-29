# Speak full-stack take-home assessment

## Welcome

Thank you for your interest in Speak! We’re excited to have you in our interview process and hope you have a great experience.

This document outlines the details and guidelines for Speak’s full-stack take-home assessment.

## Project overview

You’ll build a miniature language learning portal: a simple web application where users can browse courses, view lessons, and simulate recording/transcribing speech for a lesson.

- Aim to spend less than four hours on this exercise
- Use technologies and frameworks you are most comfortable with
- Persist data via a lightweight database or JSON files
- Feel encouraged to leverage AI tooling to efficiently deliver a solution

## Requirements

### Pages

- A page presenting a list of available courses
- A page presenting the details and lessons for a single course
- A page presenting the details for a single lesson and a _Record_ button

_Note: each page should be designed to support only mobile viewports; they do not need to responsively scale up for wide screens._

#### Recording experience

- Simulate sending audio chunks to the backend via WebSocket
- Simulate real-time updates to display transcribed text as it streams in

<!-- Todo: embed a video or gif of this experience -->

## Provided assets

### Frontend data

- [`audio.json`](/assets/audio.json) contains simulated recorded audio chunks

### Backend data

- [`course.json`](/assets/course.json) contains an enumerable of course entities that exist in the system
- [`transcriptions.json`](/assets/transcriptions.json) contains the corresponding transcribed text for each audio chunk

_Note: Feel free to modify the file type and syntax to align with your chosen technologies._

## Evaluation criteria

- Architecture and code quality
- Code readability and maintainability
- API design
- Real-time communication
- User experience

### Non-goals

Do not feel obligated to invest effort in the following deliverables:

- Automated tests
- User authentication
- Containerization / CI
- Dark mode support

## Onsite presentation

Your take-home project will be a key discussion topic during your onsite interview. Be prepared to discuss:

- Decisions regarding architecture, design, and implementation
- Challenges faced and how you solved them
- Features or improvements you would add with more time

## Running the Application Locally

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/Meron-b/speak-portal.git
   cd full-stack-take-home-assessment
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

The application consists of two parts that need to be run simultaneously:

1. **Start the backend server** (from the `server` directory):
   ```bash
   cd server
   npm start
   ```
   - Server will run on `http://localhost:3001`
   - WebSocket server will be available at `ws://localhost:3001`
   - API endpoints will be available at `http://localhost:3001/api`

2. **Start the frontend client** (from the `client` directory, in a new terminal):
   ```bash
   cd client
   npm start
   ```
   - Client will run on `http://localhost:3000`
   - Browser should automatically open to the application

### Accessing the Application

Once both servers are running:
- Open your browser to `http://localhost:3000`
- The application will display a list of available courses
- Navigate through courses and lessons to test the recording functionality

### API Endpoints

- `GET /api/courses` - List all courses
- `GET /api/courses/:courseId` - Get course details and lessons
- `GET /api/lessons/:lessonId` - Get lesson details
- `GET /api/health` - Health check endpoint

### WebSocket Events

- `start_recording` - Begin recording simulation
- `stop_recording` - End recording simulation
- `transcription_chunk` - Receive real-time transcription data
- `transcription_complete` - Recording session completed
