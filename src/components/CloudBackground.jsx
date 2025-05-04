import React from 'react';
import cloudSvg from '../assets/cloud.svg';

const CloudBackground = ({ darkMode }) => {
  const clouds = Array.from({ length: 5 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    transform: `scale(${0.5 + Math.random() * 1})`,
    opacity: 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src={cloudSvg}
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