import React, { useState, useEffect, useRef } from 'react';
import CharacterTile from './CharacterTile';
import CloudBackground from './CloudBackground';
import '../styles/theme.css';

const ResponseGrid = ({ 
  userQuestion, 
  responses, 
  onSelectCharacter, 
  onSubmitFollowUp, 
  onEndChat,
  darkMode,
  toggleDarkMode,
  onChooseCharacters 
}) => {
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [gridLayout, setGridLayout] = useState({
    columns: 3,
    minHeight: '100px',
  });
  const gridContainerRef = useRef(null);

  const handleSubmitFollowUp = (e) => {
    e.preventDefault();
    if (followUpQuestion.trim()) {
      onSubmitFollowUp(followUpQuestion.trim());
      setFollowUpQuestion(''); 
    }
  };

  
  useEffect(() => {
    const calculateLayout = () => {
      if (!gridContainerRef.current) return;
      
  
      const containerHeight = gridContainerRef.current.clientHeight;
      const containerWidth = gridContainerRef.current.clientWidth;
      
  
      let columns = 3;
      if (containerWidth < 768) columns = 1;
      else if (containerWidth < 1024) columns = 2;
      
      
      const totalItems = responses.length;
      const rows = Math.ceil(totalItems / columns);
      
     
      const gapSize = 12; 
      let availableHeight = containerHeight - (rows > 1 ? (rows - 1) * gapSize : 0);
      let minHeight = Math.floor(availableHeight / rows) - 4;
      
      
      setGridLayout({
        columns,
        minHeight: `${Math.max(minHeight, 100)}px`,
      });
    };
    
    
    setTimeout(calculateLayout, 50);
    
    
    const handleResize = () => {
      calculateLayout();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responses.length]);

  
  const handleTileClick = (character) => {
    
    onSelectCharacter(character);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <CloudBackground darkMode={darkMode} />
      {/* Fixed header with theme toggle and question display */}
      <header className="py-1 px-4 flex items-center justify-between border-b border-gray-300">
        <h2 className="text-lg font-medium text-text-primary truncate flex-1">
          <span className="font-bold pr-2">Q:</span>
          <span className="text-text-secondary">{userQuestion}</span>
        </h2>
        
        {/* Only the theme toggle button - Characters button removed */}
        <div className="flex items-center">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-surface-variant hover:bg-surface text-text-primary transition-all hover:shadow-md cursor-pointer"
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
      
      {/* Scrollable response grid with auto-sizing tiles */}
      <div 
        ref={gridContainerRef}
        className="flex-1 p-2"
      >
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full h-full`}
          style={{
            gridAutoRows: gridLayout.minHeight,
          }}
        >
          {responses.map((response) => (
            <CharacterTile
              key={response.characterId}
              character={{
                id: response.characterId,
                name: response.name,
                avatar: response.avatar
              }}
              responseText={response.responseText}
              onClick={handleTileClick}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
      
      {/* Fixed footer with follow-up form and end button - improved hover effects */}
      <footer className="border-t border-gray-300 p-2 bg-surface">
        <div className="flex max-w-full items-center gap-2">
          <form onSubmit={handleSubmitFollowUp} className="flex flex-1">
            <input
              type="text"
              value={followUpQuestion}
              onChange={(e) => setFollowUpQuestion(e.target.value)}
              placeholder="Ask a follow-up..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-r-md text-button focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer hover:shadow-md"
              disabled={!followUpQuestion.trim()}
            >
              Yap
            </button>
          </form>
          <button
            onClick={onEndChat}
            className="bg-accent text-button-accent font-medium px-4 py-2 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 whitespace-nowrap transition-colors cursor-pointer hover:shadow-md"
          >
            End Yap
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ResponseGrid;