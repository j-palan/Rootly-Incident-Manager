import { useState, useEffect } from 'react';

/**
 * Custom hook to manage simulation timer
 * Handles elapsed time tracking during simulation
 */
export const useSimulationTimer = (isPlaying: boolean) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => setElapsedTime(0);

  return {
    elapsedTime,
    formatTime,
    resetTimer
  };
}; 