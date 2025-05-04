import React, { useState, useEffect } from 'react';

const CloudBackground = ({ darkMode }) => {
  // Generate cloud positions once per session using localStorage
  const [clouds] = useState(() => {
    // Try to get existing cloud positions from localStorage
    const savedClouds = localStorage.getItem('yapCloudPositions');
    
    if (savedClouds) {
      return JSON.parse(savedClouds);
    } else {
      // Generate new positions if none exist
      const newClouds = Array.from({ length: 5 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `scale(${0.5 + Math.random() * 1})`,
        opacity: 0.4,
      }));
      
      // Save to localStorage for persistence across components
      localStorage.setItem('yapCloudPositions', JSON.stringify(newClouds));
      return newClouds;
    }
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src="/assets/cloud.svg"
          alt=""
          className="absolute w-32 transition-opacity duration-500"
          style={{
            ...cloud,
            filter: darkMode ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(74%) sepia(11%) saturate(1095%) hue-rotate(177deg) brightness(89%) contrast(84%)',
          }}
        />
      ))}
    </div>
  );
};

export default CloudBackground;