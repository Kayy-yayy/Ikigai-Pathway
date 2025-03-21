import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AuthModal from '../components/AuthModal';
import { useUser } from '../context/UserContext';

export default function Home() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  // Show auth modal on first visit if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      // Check if this is the first visit
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setShowAuthModal(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }
  }, [user, loading]);

  // Handle auth state changes
  useEffect(() => {
    // If user becomes logged in and auth modal is open, close it
    if (user && showAuthModal) {
      setShowAuthModal(false);
    }
  }, [user, showAuthModal]);

  const handleBeginJourney = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Redirect to the first pillar page
      router.push('/pillars/passion');
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('/images/zen_garden_bg.jpg')" }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-sumi bg-opacity-30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center">
          <h1 className="font-noto text-4xl md:text-6xl font-bold text-softWhite mb-6 drop-shadow-lg">
            Discover Your Ikigai
          </h1>
          
          <p className="font-sawarabi text-xl text-softWhite max-w-2xl mb-10 drop-shadow-md">
            Begin a mindful journey to find your life purpose through the ancient Japanese concept of Ikigai
          </p>
          
          <button 
            onClick={handleBeginJourney}
            className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi text-lg py-3 px-8 rounded-md transition duration-300 shadow-lg transform hover:scale-105"
          >
            Begin Your Journey
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </Layout>
  );
}
