import React, { useState, useEffect } from 'react';
import '../styles/theme.css';
import CloudBackground from './CloudBackground';

const LoadingScreen = ({ darkMode, toggleDarkMode }) => {
  
  const loadingMessages = [
    "Yapanalyzing",
    "Consulting the toy box",
    "Thinking really hard",
    "Wrangling responses",
    "Gathering toy opinions",
    "Powering up the imagination",
    "Computing friendship advice",
    "Dusting off the wisdom shelf",
    "Yap yap yapping away"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1);
    }, 500); 

    return () => clearInterval(dotsInterval);
  }, []);

  
  const renderDots = () => {
    return '.'.repeat(dotCount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      <CloudBackground darkMode={darkMode} />
      {/* Theme toggle in the top right */}
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-4 right-4 p-2 rounded-full bg-surface-variant hover:bg-surface text-text-primary"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        )}
      </button>

      {/* Google-inspired loading animation */}
      <div className="mb-10">
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 relative">
            {/* Google-colored loading circle */}
            <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-r-4 border-red-500 border-solid rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
            <div className="absolute inset-0 border-b-4 border-yellow-500 border-solid rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
            <div className="absolute inset-0 border-l-4 border-green-500 border-solid rounded-full animate-spin" style={{animationDuration: '2.5s'}}></div>
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
          {loadingMessages[currentMessageIndex]}
          <span className="text-primary ml-1">{renderDots()}</span>
        </h2>
        <p className="text-text-secondary">
          The toys are discussing your question
        </p>
      </div>
      
      {/* Google-inspired "loader bar" */}
      <div className="mt-10 w-64 h-1 bg-surface-variant rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-loader-slide"></div>
      </div>
    </div>
  );
};


const style = document.createElement('style');
style.textContent = `
  @keyframes loader-slide {
    0% {
      width: 0%;
      margin-left: 0%;
    }
    50% {
      width: 30%;
      margin-left: 70%;
    }
    100% {
      width: 0%;
      margin-left: 100%;
    }
  }
  .animate-loader-slide {
    animation: loader-slide 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default LoadingScreen;