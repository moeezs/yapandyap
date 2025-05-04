import React, { useRef, useEffect } from 'react';
import '../styles/theme.css';
import { chars } from '../data/characters';
import CloudBackground from './CloudBackground';

const getThemeColor = (characterId, darkMode) => {
  const char = chars.find(c => c.id === characterId);
  if (!char || !char.themeColor) return undefined;
  return darkMode ? char.themeColor.dark : char.themeColor.light;
};

const getTextColorForBg = (bgColor, darkMode) => {
  if (!bgColor) return darkMode ? '#fff' : '#222';
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0,2), 16);
  const g = parseInt(hex.substring(2,4), 16);
  const b = parseInt(hex.substring(4,6), 16);
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5 ? '#fff' : '#222';
};

const ChatPopup = ({ character, history, onClose, darkMode }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const avatarPath = character.avatar 
    ? `/assets/avatars/${character.avatar}`
    : '/assets/avatars/default.png';
  const themeColor = getThemeColor(character.id, darkMode);
  const textColor = getTextColorForBg(themeColor, darkMode);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <CloudBackground darkMode={darkMode} />
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, 
            ${themeColor || 'var(--color-background)'}, 
            ${themeColor || 'var(--color-background)'}DD)`,
          boxShadow: `0 20px 60px -15px ${themeColor || 'rgba(0,0,0,0.5)'}` 
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative design elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -right-24 -top-24 w-96 h-96 opacity-30">
            <path fill={textColor} d="M39.5,-65.3C52.9,-56.7,66.8,-48.8,72.1,-36.5C77.4,-24.3,74,-7.6,70.8,8.4C67.6,24.4,64.6,39.8,55.8,51.2C47,62.6,32.4,70.1,16.9,74.8C1.4,79.5,-15,81.4,-29.8,77C-44.5,72.7,-57.6,62.1,-66,48.8C-74.4,35.4,-78,19.3,-79.2,3C-80.5,-13.2,-79.3,-29.5,-72,-42.9C-64.7,-56.3,-51.3,-66.7,-37.2,-74.8C-23.1,-82.9,-8.3,-88.6,3,-91.7C14.2,-94.8,26.1,-73.9,39.5,-65.3Z" transform="translate(100 100)" />
          </svg>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute -left-24 -bottom-24 w-96 h-96 opacity-30">
            <path fill={textColor} d="M46.2,-77.2C59,-69.1,68,-54.1,75.6,-38.7C83.1,-23.3,89.2,-7.5,87.6,7.5C86.1,22.4,77,36.6,66.1,48.6C55.2,60.6,42.6,70.5,28.1,76.1C13.6,81.8,-2.7,83.3,-17.3,78.9C-31.9,74.5,-44.8,64.2,-54.7,52C-64.7,39.8,-71.9,25.6,-76.1,9.8C-80.4,-6,-81.9,-23.5,-75.6,-37.4C-69.4,-51.3,-55.4,-61.6,-40.9,-68.9C-26.3,-76.2,-11.2,-80.5,3.2,-85.7C17.6,-90.9,33.3,-85.3,46.2,-77.2Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Large avatar with improved styling */}
        <div className="flex flex-col items-center pt-8 pb-2 relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Soft glow background */}
            <div className="absolute w-36 h-36 rounded-full" style={{ 
              background: `radial-gradient(circle, ${textColor}33 0%, transparent 70%)`,
              filter: 'blur(15px)'
            }}></div>
            
            {/* Character image with circular crop and border */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: `${textColor}44` }}>
              <img
                src={avatarPath}
                alt={`${character.name} avatar`}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/assets/avatars/default.png';
                }}
              />
            </div>
            
            {/* Animated pulse effect */}
            <div className="absolute inset-0 rounded-full animate-pulse" style={{
              background: `radial-gradient(circle, ${textColor}22 30%, transparent 70%)`,
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
          </div>
          
          {/* Character name with improved typography */}
          <h3 
            className="mt-4 text-4xl font-extrabold text-center tracking-wide"
            style={{
              color: textColor,
              textShadow: `0 2px 10px ${textColor === '#fff' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)'}`,
              letterSpacing: '0.02em'
            }}
          >
            {character.name}
          </h3>
          
          {/* Close button with improved styling */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur transition-all hover:scale-110"
            style={{ 
              backgroundColor: `${textColor}22`,
              color: textColor,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
            }}
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Persona description with styled divider */}
        <div className="text-center px-6 mb-3 relative">
          <div className="h-px w-1/3 mx-auto my-2 opacity-30" style={{ backgroundColor: textColor }}></div>
          <span 
            className="text-sm italic" 
            style={{ 
              color: textColor,
              opacity: 0.85
            }}
          >
            {character.persona}
          </span>
          <div className="h-px w-1/3 mx-auto my-2 opacity-30" style={{ backgroundColor: textColor }}></div>
        </div>
        
        {/* Chat messages area with improved styling */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 mask-image-linear"
          style={{ 
            maxHeight: 'calc(90vh - 220px)',
            backgroundImage: `radial-gradient(${textColor}05 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {history.length === 0 ? (
            <div 
              className="text-center py-10 px-8 rounded-xl mx-auto max-w-md my-6"
              style={{ 
                backgroundColor: `${textColor}11`, 
                color: textColor,
                border: `1px dashed ${textColor}22`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-50 mb-3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p className="font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            history.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div 
                  key={index} 
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                      isUser 
                        ? 'rounded-tr-none' 
                        : 'rounded-tl-none'
                    }`}
                    style={{
                      backgroundColor: isUser 
                        ? 'var(--color-primary)' 
                        : `${textColor}15`,
                      color: isUser 
                        ? 'var(--color-button-text)' 
                        : textColor,
                      boxShadow: isUser
                        ? '0 4px 12px rgba(0,0,0,0.1)'
                        : `0 4px 12px ${textColor}11`
                    }}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {message.parts[0]?.text || "No message content"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;