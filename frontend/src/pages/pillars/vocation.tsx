import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import QuestionModule from '../../components/QuestionModule';
import { useUser } from '../../context/UserContext';
import AuthModal from '../../components/AuthModal';

// Define questions for the Vocation pillar
const vocationQuestions = [
  {
    id: 'vocation-1',
    text: 'What skills or services would people be willing to pay you for?',
  },
  {
    id: 'vocation-2',
    text: 'What careers align with your skills and interests?',
  },
  {
    id: 'vocation-3',
    text: 'What economic opportunities do you see in your field or community?',
  },
  {
    id: 'vocation-4',
    text: 'What work would provide you with financial stability while using your talents?',
  },
];

export default function VocationPillar() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to the ikigai chart page
    router.push('/ikigai-chart');
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <Layout title="Vocation Pillar">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <Layout title="Vocation Pillar">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-gold mb-6">
            Discover What You Can Be Paid For
          </h1>
          
          <p className="font-sawarabi text-sumi mb-8">
            Please sign in or create an account to explore your ikigai journey.
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gold hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Sign Up
          </button>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Vocation Pillar">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-block bg-gold bg-opacity-20 rounded-full px-4 py-2 mb-4">
            <h1 className="font-noto text-3xl text-gold">
              Vocation
            </h1>
          </div>
          
          <p className="font-sawarabi text-sumi">
            Identify what you can be paid for – activities that provide financial stability and support.
          </p>
        </div>
        
        <QuestionModule
          pillar="vocation"
          questions={vocationQuestions}
          onComplete={handleComplete}
        />
        
        <div className="mt-8 text-center">
          <p className="font-hina text-lg text-gray-600 italic">
            "Choose a job you love, and you will never have to work a day in your life."
            <span className="block mt-2">— Confucius</span>
          </p>
        </div>
      </div>
    </Layout>
  );
}
