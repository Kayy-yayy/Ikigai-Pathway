import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import QuestionModule from '../../components/QuestionModule';
import { useUser } from '../../context/UserContext';
import AuthModal from '../../components/AuthModal';

// Define questions for the Profession pillar
const professionQuestions = [
  {
    id: 'profession-1',
    text: 'What skills come naturally to you that others find difficult?',
  },
  {
    id: 'profession-2',
    text: 'What accomplishments are you most proud of in your life?',
  },
  {
    id: 'profession-3',
    text: 'What do people often compliment you on or come to you for help with?',
  },
  {
    id: 'profession-4',
    text: 'What skills have you developed through dedicated practice?',
  },
];

export default function ProfessionPillar() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the next pillar
    router.push('/pillars/mission');
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <Layout title="Profession Pillar">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bamboo"></div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <Layout title="Profession Pillar">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-bamboo mb-6">
            Discover What You're Good At
          </h1>
          
          <p className="font-sawarabi text-sumi mb-8">
            Please sign in or create an account to explore your ikigai journey.
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Sign Up
          </button>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profession Pillar">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-bamboo bg-opacity-20 rounded-full px-4 py-2 mb-4">
            <h1 className="font-noto text-3xl text-bamboo">
              Profession
            </h1>
          </div>
          
          <p className="font-sawarabi text-sumi">
            Identify what you're good at – your skills, talents, and strengths that you've developed.
          </p>
        </div>
        
        <QuestionModule
          pillar="profession"
          questions={professionQuestions}
          onComplete={handleComplete}
        />
        
        <div className="mt-8 text-center">
          <p className="font-hina text-lg text-gray-600 italic">
            "Your work is to discover your work and then with all your heart to give yourself to it."
            <span className="block mt-2">— Buddha</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
