import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
  const router = useRouter();

  const handleBeginJourney = () => {
    // Direct navigation to the first pillar page without authentication
    router.push('/pillars/passion');
  };

  return (
    <Layout title="Welcome">
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
    </Layout>
  );
}
