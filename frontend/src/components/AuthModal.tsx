import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, verifyOtp } = useUser();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset form when modal opens/closes
    if (!isOpen) {
      setEmail('');
      setOtp('');
      setShowOtpInput(false);
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!email) {
        throw new Error('Email is required');
      }
      
      const result = await signInWithEmail(email);
      setSuccessMessage(result.message);
      setShowOtpInput(true);
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (!otp) {
        throw new Error('Verification code is required');
      }
      
      setSuccessMessage('Verifying your code...');
      
      // Add a timeout to prevent infinite loading
      const verificationPromise = verifyOtp(email, otp);
      const timeoutPromise = new Promise<{success: boolean, message: string}>((_, reject) => 
        setTimeout(() => reject(new Error('Verification is taking longer than expected. Please try again.')), 10000)
      );
      
      const result = await Promise.race([verificationPromise, timeoutPromise]) as {success: boolean, message: string};
      setSuccessMessage(result.message);
      
      // Close modal after successful verification
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click was outside the modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-sumi bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className="bg-softWhite rounded-lg shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sumi hover:text-indigo"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-noto text-indigo text-center mb-6">
          {showOtpInput ? 'Enter Verification Code' : 'Begin Your Journey'}
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

        {!showOtpInput ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-sawarabi text-sumi mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
                required
              />
            </div>

            <p className="text-sm text-gray-600 mb-4">
              We'll send a verification code to your email to sign in.
            </p>

            <button
              type="submit"
              disabled={loading || !email}
              className={`w-full font-sawarabi py-2 px-4 rounded-md transition duration-300 ${
                email 
                  ? 'bg-bamboo hover:bg-bamboo-dark text-white transform hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-4">
              <label htmlFor="otp" className="block font-sawarabi text-sumi mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
                placeholder="Enter the code sent to your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otp}
              className={`w-full font-sawarabi py-2 px-4 rounded-md transition duration-300 ${
                otp 
                  ? 'bg-bamboo hover:bg-bamboo-dark text-white transform hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false);
                setOtp('');
              }}
              className="w-full mt-2 font-sawarabi py-2 px-4 text-indigo hover:text-indigo-dark"
            >
              Back to Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
