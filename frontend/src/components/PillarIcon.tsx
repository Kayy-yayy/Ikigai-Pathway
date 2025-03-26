import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa';

type PillarIconProps = {
  pillar: 'passion' | 'profession' | 'mission' | 'vocation';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const PillarIcon: React.FC<PillarIconProps> = ({ pillar, size = 'md', className = '' }) => {
  // Define size values
  const sizeValues = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  // Define colors for each pillar
  const colors = {
    passion: 'text-sakura',
    profession: 'text-bamboo',
    mission: 'text-indigo',
    vocation: 'text-gold',
  };

  // Define icons for each pillar
  const renderIcon = () => {
    const iconSize = sizeValues[size];
    const colorClass = colors[pillar];
    
    switch (pillar) {
      case 'passion':
        return <FaHeart size={iconSize} className={`${colorClass} ${className} transition-all duration-300 transform hover:scale-110`} />;
      case 'profession':
        return <FaBriefcase size={iconSize} className={`${colorClass} ${className} transition-all duration-300 transform hover:scale-110`} />;
      case 'mission':
        return <FaGlobe size={iconSize} className={`${colorClass} ${className} transition-all duration-300 transform hover:scale-110`} />;
      case 'vocation':
        return <FaCoins size={iconSize} className={`${colorClass} ${className} transition-all duration-300 transform hover:scale-110`} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderIcon()}
    </div>
  );
};

export default PillarIcon;
