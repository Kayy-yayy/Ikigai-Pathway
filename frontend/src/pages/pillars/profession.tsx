import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import PillarIcon from '@/components/PillarIcon';
import { useSimpleUser } from '@/context/SimpleUserContext';

// Define questions for the Profession pillar
const professionQuestions = [
  {
    id: 'profession-1',
    text: 'What skills or expertise do others recognize in you?',
  },
  {
    id: 'profession-2',
    text: 'What work would you be willing to do even if it was challenging?',
  },
];

export default function ProfessionPillar() {
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
    router.push('/pillars/mission');
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
        {/* Pillar Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-2">
            <PillarIcon pillar="profession" size="lg" className="mr-4" />
            <h1 className="text-3xl md:text-4xl font-noto text-indigo">
              Profession
            </h1>
          </div>
          <p className="text-lg font-sawarabi text-sumi text-center">
            Identify what you can be paid for and what the world needs
          </p>
        </div>
        
        {/* Question Module */}
        <QuestionModule
          questions={professionQuestions}
          pillarName="profession"
          pillarColor="indigo"
          onComplete={handleComplete}
          userId={user?.id}
          totalQuestions={8}
          questionOffset={2}
        />
      </div>
    </Layout>
  );
}
