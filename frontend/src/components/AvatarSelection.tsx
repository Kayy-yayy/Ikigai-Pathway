import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

type AvatarSelectionProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AvatarSelection: React.FC<AvatarSelectionProps> = ({ isOpen, onClose }) => {
  const { updateAvatar, needsAvatarSelection, user } = useUser();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  
  // Set default username from email when component mounts
  useEffect(() => {
    if (user?.email) {
      // Extract username from email (part before @)
      const emailUsername = user.email.split('@')[0];
      setUsername(user.username || emailUsername);
    }
  }, [user]);
  
  // Available avatars
  const avatars = [
    { id: 'Geisha', name: 'Geisha' },
    { id: 'Ninja', name: 'Ninja' },
    { id: 'Samurai Warrior', name: 'Samurai Warrior' },
    { id: 'Sumo Wrestler', name: 'Sumo Wrestler' },
  ];
  
  const handleAvatarSelect = async () => {
    if (!selectedAvatar) {
      setError('Please select an avatar to continue');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('Updating your profile...');
      
      // Add a timeout to prevent infinite loading
      const updatePromise = updateAvatar(selectedAvatar, username);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile update is taking longer than expected. Please try again.')), 10000)
      );
      
      try {
        const result = await Promise.race([updatePromise, timeoutPromise]) as {success: boolean, message: string};
        setSuccessMessage(result.message);
        
        // Redirect after a short delay
        setTimeout(() => {
          onClose();
          router.push('/pillars/passion');
        }, 1500);
      } catch (raceError) {
        console.error('Avatar update race error:', raceError);
        setError(raceError instanceof Error ? raceError.message : 'Failed to update profile');
        
        // Force redirect if we're stuck
        setTimeout(() => {
          onClose();
          router.push('/pillars/passion');
        }, 3000);
      }
    } catch (error) {
      console.error('Avatar selection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      
      // Force redirect if we're stuck
      setTimeout(() => {
        onClose();
        router.push('/pillars/passion');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          Personalize Your Journey
        </h2>
        
        <div className="mb-6">
          <label htmlFor="username" className="block text-sumi mb-2 font-sawarabi">
            Choose a username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
            placeholder="Enter username"
            disabled={loading}
          />
        </div>
        
        <p className="text-sumi mb-4 font-sawarabi">Select your avatar:</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                selectedAvatar === avatar.id
                  ? 'border-indigo bg-indigo bg-opacity-10'
                  : 'border-gray-200 hover:border-indigo hover:bg-gray-50'
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
              <p className="text-center text-sumi font-sawarabi">{avatar.name}</p>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        
        <button
          onClick={handleAvatarSelect}
          disabled={loading || !selectedAvatar}
          className={`w-full py-2 px-4 rounded-md font-sawarabi ${
            loading || !selectedAvatar
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo hover:bg-opacity-90 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;
