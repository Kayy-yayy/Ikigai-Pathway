import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Image from 'next/image';

const avatarOptions = [
  { id: 'avatar1', src: '/images/avatars/avatar1.png' },
  { id: 'avatar2', src: '/images/avatars/avatar2.png' },
  { id: 'avatar3', src: '/images/avatars/avatar3.png' },
  { id: 'avatar4', src: '/images/avatars/avatar4.png' },
];

const SignupModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    // Add event listener for the custom event
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('openSignupModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openSignupModal', handleOpenModal);
    };
  }, []);

  // Close modal if user is logged in
  useEffect(() => {
    if (user) {
      setIsOpen(false);
    }
  }, [user]);

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password: `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`, // Generate random password
        options: {
          data: {
            username,
            avatar_url: selectedAvatar,
          },
        },
      });
      
      if (error) throw error;
      
      // If successful, close the modal
      if (data.user) {
        closeModal();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fixed inset-0 bg-sumi-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="modal-content bg-white p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-noto-serif font-bold text-indigo-blue">Begin Your Journey</h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-sumi-black"
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Choose your avatar
            </label>
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((avatar) => (
                <div key={avatar.id} className="relative">
                  <input
                    type="radio"
                    id={avatar.id}
                    name="avatar"
                    value={avatar.id}
                    checked={selectedAvatar === avatar.id}
                    onChange={() => setSelectedAvatar(avatar.id)}
                    className="absolute opacity-0"
                  />
                  <label
                    htmlFor={avatar.id}
                    className={`block cursor-pointer border-2 rounded-full overflow-hidden ${
                      selectedAvatar === avatar.id ? 'border-accent-gold' : 'border-transparent'
                    }`}
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={avatar.src}
                        alt={`Avatar ${avatar.id}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Begin Journey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
