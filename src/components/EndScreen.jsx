import React, { useState, useEffect } from 'react';
import '../styles/theme.css';
import CloudBackground from './CloudBackground';

const EndScreen = ({ onRestart, darkMode, toggleDarkMode }) => {
  const messages = [
    "Congratulations! You've earned your Official Yapster Certificate!",
    "Yap Session Concluded. Go forth and ponder!",
    "You've successfully yapped your way through!",
    "Expert Yapper Status: Achieved!",
    "Toy Story Characters: Consulted ✓ Wisdom: Acquired ✓",
    "Yap & Yap MVP Award: It's yours!"
  ];
  
  const [randomMessage, setRandomMessage] = useState('');
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowConfetti(true);
    
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <CloudBackground darkMode={darkMode} />
      {/* Theme toggle in the top right */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-surface-variant hover:bg-surface text-text-primary cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>
      </div>
    
      {/* Confetti effect */}
      {showConfetti && (
        <div className="confetti-container absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div 
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${left}%`,
                  top: '-10px',
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '3px',
                  animation: `fall ${animationDuration}s ease-in forwards`,
                  animationDelay: `${delay}s`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="text-center bg-surface p-8 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 max-w-lg w-full relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg border-4 border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="absolute -z-10 opacity-5 inset-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute w-full h-full">
            <path fill="currentColor" d="M39.5,-65.3C52.9,-56.7,66.8,-48.8,72.1,-36.5C77.4,-24.3,74,-7.6,70.8,8.4C67.6,24.4,64.6,39.8,55.8,51.2C47,62.6,32.4,70.1,16.9,74.8C1.4,79.5,-15,81.4,-29.8,77C-44.5,72.7,-57.6,62.1,-66,48.8C-74.4,35.4,-78,19.3,-79.2,3C-80.5,-13.2,-79.3,-29.5,-72,-42.9C-64.7,-56.3,-51.3,-66.7,-37.2,-74.8C-23.1,-82.9,-8.3,-88.6,3,-91.7C14.2,-94.8,26.1,-73.9,39.5,-65.3Z" transform="translate(100 100)" />
          </svg>
        </div>
        
        {/* Certificate/Award content with improved styling */}
        <div className="pt-8 pb-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Yap Complete!
          </h1>
          
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full"></div>
          
          {/* Random quirky message with improved typography */}
          <p className="text-lg md:text-xl text-text-primary mb-6 font-medium">
            {randomMessage}
          </p>
          
          {/* Stats section */}
          <div className="grid grid-cols-2 gap-4 mb-8 border-t border-b border-gray-200 py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">A+</p>
              <p className="text-sm text-text-secondary">Yapping Grade</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">100%</p>
              <p className="text-sm text-text-secondary">Wisdom Received</p>
            </div>
          </div>
          
          {/* Signature with animation */}
          <div className="mb-8 relative">
            <div className="w-32 h-0.5 bg-text-secondary mx-auto mb-2"></div>
            <p className="text-text-secondary italic">The Yap & Yap Team</p>
          </div>
          
          {/* Restart button with enhanced styling */}
          <button
            onClick={onRestart}
            className="bg-primary text-white font-medium text-lg py-3 px-8 rounded-full hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">Yap Again?</span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS animation for confetti
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    70% { opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .animate-fall {
    animation: fall 3s ease-in forwards;
  }
`;
document.head.appendChild(style);

export default EndScreen;