import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import { useSimpleUser } from '@/context/SimpleUserContext';

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
  const { user, loading, updateQuestionCompletion } = useSimpleUser();
  const [allPillarsCompleted, setAllPillarsCompleted] = useState(false);
  const router = useRouter();

  // Check if all pillars are completed
  useEffect(() => {
    const checkAllPillarsCompleted = async () => {
      if (!user || !user.id) return;
      
      try {
        // Check if responses exist for all pillars
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses/check-completion?user_id=${user.id}`);
        
        if (res.ok) {
          const data = await res.json();
          setAllPillarsCompleted(data.allCompleted);
          
          // If all pillars are completed, update the user's completion status
          if (data.allCompleted && !user.has_completed_questions) {
            await updateQuestionCompletion(true);
          }
        }
      } catch (error) {
        console.error('Error checking pillar completion:', error);
      }
    };
    
    checkAllPillarsCompleted();
  }, [user, updateQuestionCompletion]);

  const handleComplete = async () => {
    // Save responses to the server
    if (user && user.id) {
      try {
        // Check if all pillars are completed after this one
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses/check-completion?user_id=${user.id}`);
        
        if (res.ok) {
          const data = await res.json();
          
          // If this was the last pillar to complete
          if (data.allCompleted && !user.has_completed_questions) {
            await updateQuestionCompletion(true);
          }
        }
      } catch (error) {
        console.error('Error updating completion status:', error);
      }
    }
    
    // Navigate to the ikigai chart page
    router.push('/ikigai-chart');
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-noto text-indigo mb-4">
            Vocation
          </h1>
          <p className="text-lg font-sawarabi text-sumi">
            Discover what the world needs and what the world will pay for
          </p>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-noto text-indigo mb-2">
              What is Vocation in Ikigai?
            </h2>
            <p className="font-sawarabi text-sumi">
              In the Ikigai framework, vocation represents the intersection of what the world needs and what the world will pay for. 
              These are the valuable services and solutions that address real problems in society.
              Identifying your vocation helps you find work that is both sustainable and impactful.
            </p>
          </div>
          
          <QuestionModule
            questions={vocationQuestions}
            pillarName="vocation"
            pillarColor="indigo"
            onComplete={handleComplete}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
