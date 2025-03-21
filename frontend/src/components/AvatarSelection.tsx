import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

type AvatarSelectionProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ isOpen, onClose }) => {
  const { updateAvatar, needsAvatarSelection } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  
  // Available avatars
  const avatars = [
    { id: 'Geisha', name: 'Geisha' },
    { id: 'Ninja', name: 'Ninja' },
    { id: 'Samurai Warrior', name: 'Samurai Warrior' },
    { id: 'Sumo Wrestler', name: 'Sumo Wrestler' },
  ];
  
  const handleAvatarSelect = async () => {
    if (!selectedAvatar) return;
    
    try {
      setLoading(true);
      setError('');
      
      const result = await updateAvatar(selectedAvatar);
      setSuccessMessage(result.message);
      
      // Redirect after a short delay
      setTimeout(() => {
        onClose();
        router.push('/pillars/passion');
      }, 1500);
    } catch (error) {
      console.error('Error updating avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to update avatar');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen && !needsAvatarSelection) return null;
  
  return (
    <div className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          Choose Your Avatar
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
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
          disabled={loading || !selectedAvatar}
          className={`w-full font-sawarabi py-2 px-4 rounded-md transition duration-300 ${
            selectedAvatar && !loading
              ? 'bg-bamboo hover:bg-bamboo-dark text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Updating...' : 'Begin Your Journey'}
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;
