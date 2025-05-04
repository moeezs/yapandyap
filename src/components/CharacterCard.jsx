import React from 'react';
import '../styles/theme.css';

const CharacterCard = ({ character, isSelected, onClick, darkMode }) => {
  const avatarPath = character.avatar 
    ? `/assets/avatars/${character.avatar}`
    : '/assets/avatars/default.png';

  const getBackgroundColor = () => {
    if (!character.themeColor) return darkMode ? 'var(--color-surface)' : 'var(--color-background)';
    return darkMode ? character.themeColor.dark : character.themeColor.light;
  };

  const getTextColor = (bgColor) => {
    if (!bgColor) return darkMode ? '#fff' : '#222';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance < 0.5 ? '#fff' : '#222';
  };

  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor(backgroundColor);
  
  return (
    <div 
      className={`rounded-lg transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden ${
        isSelected 
          ? 'scale-[1.02] shadow-md' 
          : 'hover:scale-[1.03] hover:shadow-md'
      }`}
      style={{
        boxShadow: isSelected ? '0 0 0 2px var(--color-primary), var(--shadow-sm)' : 'var(--shadow-sm)',
      }}
      onClick={onClick}
    >
      {/* Character image with gradient overlay - fixed positioning */}
      <div className="relative h-24 overflow-hidden" style={{ 
        backgroundColor: darkMode ? 'var(--color-surface-variant)' : 'var(--color-background)'
      }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={avatarPath} 
            alt={`${character.name} avatar`}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '100%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/avatars/default.png';
            }}
          />
        </div>
        <div 
          className="absolute inset-0 z-10" 
          style={{
            background: `linear-gradient(0deg, ${backgroundColor}CC 0%, transparent 70%)`
          }}
        ></div>
        
        {/* Selection indicator badge */}
        {isSelected && (
          <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>
      
      {/* Character info */}
      <div 
        className="p-2 flex-grow flex flex-col"
        style={{ 
          backgroundColor: backgroundColor,
          color: textColor
        }}
      >
        <h3 className="font-bold text-sm mb-0.5">{character.name}</h3>
        <p className="text-xs opacity-90 line-clamp-2">{character.shortDescription}</p>
        
        {/* Character personality tags */}
        <div className="flex flex-wrap gap-1 mt-1">
          {character.persona.split(',').slice(0, 1).map((trait, index) => (
            <span 
              key={index}
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${textColor}22`,
                color: textColor
              }}
            >
              {trait.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;