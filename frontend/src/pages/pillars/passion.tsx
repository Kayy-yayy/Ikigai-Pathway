import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import { useUser } from '@/context/UserContext';
import AuthModal from '@/components/AuthModal';

// Define questions for the Passion pillar
const passionQuestions = [
  {
    id: 'passion-1',
    text: 'What activities make you lose track of time?',
  },
  {
    id: 'passion-2',
    text: "What would you do even if you weren't paid for it?",
  },
  {
    id: 'passion-3',
    text: 'What activities did you love as a child that you might still enjoy?',
  },
  {
    id: 'passion-4',
    text: 'What topics do you enjoy learning or reading about?',
  },
];

export default function PassionPillar() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the next pillar
    router.push('/pillars/profession');
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sakura"></div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-sakura mb-6">
            Discover What You Love
          </h1>
          
          <p className="font-sawarabi text-sumi mb-8">
            Please sign in or create an account to explore your ikigai journey.
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-sakura hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Sign Up
          </button>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-sakura bg-opacity-20 rounded-full px-4 py-2 mb-4">
            <h1 className="font-noto text-3xl text-sakura">
              Passion
            </h1>
          </div>
          
          <p className="font-sawarabi text-sumi">
            Discover what you love – activities and interests that bring you joy and fulfillment.
          </p>
        </div>
        
        <QuestionModule
          pillar="passion"
          questions={passionQuestions}
          onComplete={handleComplete}
        />
        
        <div className="mt-8 text-center">
          <p className="font-hina text-lg text-gray-600 italic">
            "Follow your bliss and the universe will open doors where there were only walls."
            <span className="block mt-2">— Joseph Campbell</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
