import React from 'react';
import { chars } from '../data/characters';
import CharacterCard from './CharacterCard';
import CloudBackground from './CloudBackground';
import '../styles/theme.css';

const CharacterSelectPage = ({ 
  selected, 
  onSelect, 
  onConfirm, 
  onBack,
  darkMode,
  toggleDarkMode 
}) => {
  
  const toggleCharacter = (characterId) => {
    if (selected.includes(characterId)) {
      
      if (selected.length > 1) {
        onSelect(selected.filter(id => id !== characterId));
      }
    } else {
  
      onSelect([...selected, characterId]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
      <CloudBackground darkMode={darkMode} />
      {/* Header with back button, title, and theme toggle */}
      <header className="flex items-center justify-between border-b border-gray-300 p-2">
        <button 
          onClick={onBack}
          className="flex items-center text-text-primary hover:text-primary hover:bg-surface-variant px-3 py-1 rounded-md transition-all duration-200 cursor-pointer hover:shadow-sm"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </button>
        
        <h1 className="text-xl font-bold text-text-primary">Choose Characters</h1>
        
        <div className="flex items-center">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-surface-variant hover:bg-surface text-text-primary cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
        </div>
      </header>

      {/* Main content - character grid (no scrolling) */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden">
        <p className="text-text-secondary mb-2 text-sm">
          Select the characters you want to interact with. Each has their own unique personality.
        </p>
        
        {/* Character grid with increased gap between cards */}
        <div className="grid grid-cols-3 gap-5 flex-1 max-h-[calc(100vh-130px)]">
          {chars.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={selected.includes(character.id)}
              onClick={() => toggleCharacter(character.id)}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* Footer with confirm button */}
      <footer className="p-2 border-t border-gray-300 bg-surface">
        <div className="flex justify-between items-center">
          <div className="text-text-secondary">
            <span className="font-medium">{selected.length}</span> of {chars.length} selected
          </div>
          <button
            onClick={onConfirm}
            disabled={selected.length === 0}
            className={`px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-all duration-200 shadow-sm ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:transform hover:scale-105'}`}
          >
            Confirm Selection
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CharacterSelectPage;