import React, { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

type UserInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string, avatarId: string) => void;
};

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, onSave }) => {
  const [email, setEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Available avatars
  const avatars = [
    { id: 'Geisha', name: 'Geisha' },
    { id: 'Ninja', name: 'Ninja' },
    { id: 'Samurai Warrior', name: 'Samurai Warrior' },
    { id: 'Sumo Wrestler', name: 'Sumo Wrestler' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    if (!selectedAvatar) {
      setError('Please select an avatar');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Call the onSave function to handle saving to Supabase
      onSave(email, selectedAvatar);
      
    } catch (error) {
      console.error('Error saving user info:', error);
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          Welcome to Ikigai Pathway
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Please provide your email and select an avatar to personalize your journey
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sumi mb-2 font-sawarabi">
              Your Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
              placeholder="Enter your email"
              disabled={loading}
              required
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
          
          <button
            type="submit"
            disabled={loading || !email || !selectedAvatar}
            className={`w-full py-2 px-4 rounded-md font-sawarabi ${
              loading || !email || !selectedAvatar
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-bamboo hover:bg-opacity-90 text-white'
            }`}
          >
            {loading ? 'Saving...' : 'Begin Your Journey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoModal;
