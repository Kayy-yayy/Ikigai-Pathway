import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import { useSimpleUser } from '@/context/SimpleUserContext';

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-noto text-sakura mb-4">
            Passion
          </h1>
          <p className="text-lg font-sawarabi text-sumi">
            Discover what you love and what you're good at
          </p>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-noto text-sakura mb-2">
              What is Passion in Ikigai?
            </h2>
            <p className="font-sawarabi text-sumi">
              In the Ikigai framework, passion emerges at the intersection of what you love and what you're good at. 
              These are activities that bring you joy and where you naturally excel or have developed skills.
              Identifying your passions is the first step toward finding your life purpose.
            </p>
          </div>
          
          <QuestionModule
            questions={passionQuestions}
            pillarName="passion"
            pillarColor="sakura"
            onComplete={handleComplete}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
