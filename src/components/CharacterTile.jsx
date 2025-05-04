import React from 'react';
import '../styles/theme.css';
import { chars } from '../data/characters';

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

const CharacterTile = ({ character, responseText, onClick, darkMode }) => {
  const avatarPath = character.avatar 
    ? `/src/assets/avatars/${character.avatar}`
    : '/src/assets/avatars/default.png';
  const themeColor = getThemeColor(character.id, darkMode);
  const textColor = getTextColorForBg(themeColor, darkMode);

  return (
    <div 
      className="rounded-lg shadow-md hover:shadow-lg p-0 cursor-pointer transition-all duration-200 flex flex-row h-full border border-opacity-30 overflow-hidden transform hover:scale-[1.01]"
      style={{ 
        background: `linear-gradient(to right, ${themeColor || 'var(--color-surface)'}, ${themeColor || 'var(--color-surface)'}CC)`,
        borderColor: textColor,
      }}
      onClick={() => onClick(character)}
    >
      {/* Avatar and name on the left - improved styling */}
      <div className="flex flex-col items-center justify-center mr-3 min-w-[80px] h-full py-3 pl-3 relative">
        <div className="w-16 h-16 mb-1 flex-shrink-0 relative">
          <img 
            src={avatarPath} 
            alt={`${character.name} avatar`}
            className="w-full h-full object-cover"
            style={{ 
              boxShadow: `0 3px 10px ${textColor}33`,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/avatars/default.png';
            }}
          />
        </div>
        <h3 
          className="font-bold text-xs text-center mt-1"
          style={{
            color: textColor,
            textShadow: `0 1px 2px ${textColor === '#fff' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}`
          }}
        >
          {character.name}
        </h3>
      </div>

      {/* Message on the right - enhanced styling */}
      <div className="flex-grow overflow-hidden flex flex-col justify-center p-3 relative">
        {/* Optional subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '15px 15px',
            color: textColor
          }}
        ></div>

        <p 
          className="text-sm md:text-base text-left overflow-y-auto relative z-10 font-medium leading-relaxed" 
          style={{
            color: textColor,
            textShadow: `0 1px 1px ${textColor === '#fff' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)'}`
          }}
        >
          {responseText}
        </p>
      </div>
    </div>
  );
};

export default CharacterTile;