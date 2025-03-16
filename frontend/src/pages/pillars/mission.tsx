import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import QuestionModule from '../../components/QuestionModule';
import { useUser } from '../../context/UserContext';
import AuthModal from '../../components/AuthModal';

// Define questions for the Mission pillar
const missionQuestions = [
  {
    id: 'mission-1',
    text: 'What issues or causes do you care deeply about?',
  },
  {
    id: 'mission-2',
    text: 'How would you like to make a difference in other people's lives?',
  },
  {
    id: 'mission-3',
    text: 'What problems in the world do you feel drawn to solve?',
  },
  {
    id: 'mission-4',
    text: 'What changes would you like to see in your community or society?',
  },
];

export default function MissionPillar() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the next pillar
    router.push('/pillars/vocation');
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <Layout title="Mission Pillar">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <Layout title="Mission Pillar">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-indigo mb-6">
            Discover What the World Needs
          </h1>
          
          <p className="font-sawarabi text-sumi mb-8">
            Please sign in or create an account to explore your ikigai journey.
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-indigo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Sign Up
          </button>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mission Pillar">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo bg-opacity-20 rounded-full px-4 py-2 mb-4">
            <h1 className="font-noto text-3xl text-indigo">
              Mission
            </h1>
          </div>
          
          <p className="font-sawarabi text-sumi">
            Explore what the world needs – how you can contribute to society and make a positive impact.
          </p>
        </div>
        
        <QuestionModule
          pillar="mission"
          questions={missionQuestions}
          onComplete={handleComplete}
        />
        
        <div className="mt-8 text-center">
          <p className="font-hina text-lg text-gray-600 italic">
            "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well."
            <span className="block mt-2">— Ralph Waldo Emerson</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
