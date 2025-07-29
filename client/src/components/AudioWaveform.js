import React from 'react';
import './AudioWaveform.css';

function AudioWaveform({ isRecording = false, isConnecting = false }) {
  // Generate an array of random heights for the waveform bars
  const generateBars = () => {
    return Array.from({ length: 25 }, (_, index) => {
      const baseHeight = Math.random() * 60 + 20; // Random height between 20-80%
      const delay = Math.random() * 1.5; // Random animation delay
      return {
        id: index,
        height: baseHeight,
        delay: delay
      };
    });
  };

  const bars = generateBars();

  return (
    <div className="audio-waveform-container">
      <div className="waveform-wrapper">
        <div className={`waveform ${isRecording ? 'recording' : ''} ${isConnecting ? 'connecting' : ''}`}>
          {bars.map((bar) => (
            <div
              key={bar.id}
              className="waveform-bar"
              style={{
                height: `${bar.height}%`,
                animationDelay: `${bar.delay}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AudioWaveform; 