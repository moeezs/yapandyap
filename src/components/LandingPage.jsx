import React, { useState, useEffect, useRef } from 'react';
import '../styles/theme.css';
import '../styles/fonts.css';
import CloudBackground from './CloudBackground';

function LandingPage({ onSubmitQuestion, darkMode, toggleDarkMode, onChooseCharacters }) {
  const [question, setQuestion] = useState('');
  const lampRef = useRef(null);
  const letterRefs = useRef([]);

  const setLetterRef = (el, index) => {
    letterRefs.current[index] = el;
  };

  useEffect(() => {
    const lampElement = lampRef.current;
    const letters = letterRefs.current.filter(Boolean);
    
    if (!lampElement || letters.length === 0) {
      console.error("Lamp or letter refs not found!");
      return;
    }
    
  
    const landingPositions = [
      { percent: 0, index: 0 },   
      { percent: 10.5, index: 1 },
      { percent: 24.5, index: 2 },
      { percent: 38.5, index: 3 },
      { percent: 52.5, index: 4 },
      { percent: 66.5, index: 5 },
      { percent: 80.5, index: 6 } 
    ];
    
    
    const handleAnimationIteration = () => {
      console.log('Animation iteration triggered');
    };
    
    lampElement.addEventListener('animationiteration', handleAnimationIteration);
    
    
    let animationId;
    let lastSquashedIndex = -1;
    let lastDirection = null;
    const animationDuration = 8000;
    const startTime = performance.now();
    
    const animate = (time) => {
      
      const elapsed = (time - startTime) % animationDuration;
      const progress = elapsed / animationDuration;
      
      const isForward = progress < 0.5;
      const directionChanged = lastDirection !== null && isForward !== lastDirection;
      lastDirection = isForward;
      

      const effectiveProgress = isForward 
        ? (progress * 2) * 100 
        : ((1 - progress) * 2) * 100; 
      
      
      if (directionChanged && !isForward) {
        lampElement.classList.add('flipped');
        console.log('Flipping lamp at end');
      } 
      else if (directionChanged && isForward) {
        lampElement.classList.remove('flipped');
        console.log('Unflipping lamp at beginning');
      }
      
      
      const margin = 1.5;
      
      
      const targetLanding = landingPositions.find(pos => 
        Math.abs(effectiveProgress - pos.percent) < margin
      );
      
      
      if (targetLanding && targetLanding.index !== lastSquashedIndex) {
        lastSquashedIndex = targetLanding.index;
        
      
        letters.forEach(letter => letter.classList.remove('squashed'));
        
      
        if (targetLanding) {
          letters[targetLanding.index].classList.add('squashed');
          console.log(`Squashing letter ${targetLanding.index} at progress ${Math.round(effectiveProgress)}%`);
        }
      }
      
      else if (!targetLanding) {
        lastSquashedIndex = -1;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    
    return () => {
      cancelAnimationFrame(animationId);
      lampElement.removeEventListener('animationiteration', handleAnimationIteration);
      letters.forEach(letter => letter.classList.remove('squashed'));
      lampElement.classList.remove('flipped');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmitQuestion(question.trim());
      setQuestion(''); // Clear input after submission
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans p-4 relative">
      <CloudBackground darkMode={darkMode} />
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button 
          onClick={onChooseCharacters}
          className="px-3 py-2 rounded-md bg-surface-variant hover:bg-surface text-text-primary flex items-center cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
          aria-label="Choose characters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Choose Characters
        </button>
        
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

      {/* Toy Story inspired logo */}
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-6xl font-bold mb-2 text-center toy-story-font logo-3d relative">
          <img
            ref={lampRef}
            src="/assets/lamp.png"
            alt="Jumping Lamp"
            className="pixar-lamp"
          />
          <span ref={el => setLetterRef(el, 0)} className="text-[#4285F4] character-animate" style={{"--i": 0}}>Y</span>
          <span ref={el => setLetterRef(el, 1)} className="text-[#EA4335] character-animate" style={{"--i": 1}}>a</span>
          <span ref={el => setLetterRef(el, 2)} className="text-[#FBBC05] character-animate" style={{"--i": 2}}>p</span>
          <span ref={el => setLetterRef(el, 3)} className="text-[#4285F4] character-animate" style={{"--i": 3}}>&</span>
          <span ref={el => setLetterRef(el, 4)} className="text-[#34A853] character-animate" style={{"--i": 4}}>Y</span>
          <span ref={el => setLetterRef(el, 5)} className="text-[#EA4335] character-animate" style={{"--i": 5}}>a</span>
          <span ref={el => setLetterRef(el, 6)} className="text-[#FBBC05] character-animate" style={{"--i": 6}}>p</span>
        </h1>
        <p className="text-lg text-text-secondary text-center">Ask anything, get answers from your virtual friends.</p>
      </div>

      {/* Google-inspired search input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex rounded-full border border-gray-300 bg-surface hover:shadow-md focus-within:shadow-md transition-shadow duration-300 overflow-hidden">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Should I call my ex back?"
            className="flex-grow p-4 pl-6 bg-transparent border-none outline-none text-text-primary"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-primary hover:bg-primary-dark text-white font-medium transition duration-150 ease-in-out cursor-pointer hover:shadow-inner"
            disabled={!question.trim()}
          >
            Yap!
          </button>
        </div>
        
        <div className="mt-4 flex justify-center text-sm text-text-secondary">
          <span>Press "Yap!" to get advice from your toy friends</span>
        </div>
      </form>
    </div>
  );
}

export default LandingPage;