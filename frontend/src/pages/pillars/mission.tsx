import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import PillarIcon from '@/components/PillarIcon';
import ProgressTracker from '@/components/ProgressTracker';
import { useSimpleUser } from '@/context/SimpleUserContext';

// Define questions for the Mission pillar - reduced to 2 most relevant questions
const missionQuestions = [
  {
    id: 'mission-1',
    text: 'What problems in the world do you feel most drawn to solve?',
  },
  {
    id: 'mission-2',
    text: 'How would you like to contribute to making the world a better place?',
  },
];

export default function MissionPillar() {
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
    
    // Navigate to the next pillar
    router.push('/pillars/vocation');
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
      <div className="max-w-4xl mx-auto">
        {/* Progress Tracker */}
        <ProgressTracker userId={user?.id} />
        
        <div 
          className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 mb-8"
          style={{ 
            backdropFilter: 'blur(10px)',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <PillarIcon pillar="mission" size="lg" className="mr-4" />
            <h1 className="text-3xl md:text-4xl font-noto text-indigo text-center">
              Mission
            </h1>
          </div>
          
          <p className="text-lg font-sawarabi text-sumi mb-8 text-center">
            Explore how you can serve the world and make a difference
          </p>
          
          <QuestionModule
            questions={missionQuestions}
            pillarName="mission"
            pillarColor="indigo"
            onComplete={handleComplete}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
