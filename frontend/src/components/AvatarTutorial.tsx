import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '../context/UserContext';

type AvatarTutorialProps = {
  onComplete: () => void;
};

const AvatarTutorial: React.FC<AvatarTutorialProps> = ({ onComplete }) => {
  const { user, updateAvatar, needsAvatarSelection } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Available avatars
  const avatars = [
    { id: 'Geisha', name: 'Geisha' },
    { id: 'Ninja', name: 'Ninja' },
    { id: 'Samurai Warrior', name: 'Samurai Warrior' },
    { id: 'Sumo Wrestler', name: 'Sumo Wrestler' },
  ];
  
  useEffect(() => {
    // Show tutorial if user needs to select an avatar
    if (needsAvatarSelection) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [needsAvatarSelection]);
  
  const handleAvatarSelect = async () => {
    if (!selectedAvatar) return;
    
    try {
      await updateAvatar(selectedAvatar);
      setIsVisible(false);
      onComplete();
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          Choose Your Avatar
        </h2>
        
        <p className="text-sumi mb-6 text-center">
          Select an avatar to represent you on your journey to finding your Ikigai.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                selectedAvatar === avatar.id
                  ? 'border-indigo bg-indigo bg-opacity-10'
                  : 'border-gray-200 hover:border-indigo'
              }`}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <div className="relative h-24 w-full mb-2">
                <Image
                  src={`/images/avatar images/${avatar.id}.jpg`}
                  alt={avatar.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="text-center font-sawarabi text-sm">{avatar.name}</p>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleAvatarSelect}
          disabled={!selectedAvatar}
          className={`w-full font-sawarabi py-2 px-4 rounded-md transition duration-300 ${
            selectedAvatar
              ? 'bg-bamboo hover:bg-bamboo-dark text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Begin Your Journey
        </button>
      </div>
    </div>
  );
};

export default AvatarTutorial;
