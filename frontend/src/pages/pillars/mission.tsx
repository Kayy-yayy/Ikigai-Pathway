import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import { useSimpleUser } from '@/context/SimpleUserContext';

// Define questions for the Mission pillar
const missionQuestions = [
  {
    id: 'mission-1',
    text: 'What issues or causes do you care deeply about?',
  },
  {
    id: 'mission-2',
    text: "How would you like to make a difference in other people's lives?",
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bamboo"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-noto text-bamboo mb-4">
            Mission
          </h1>
          <p className="text-lg font-sawarabi text-sumi">
            Discover what you love and what the world needs
          </p>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-noto text-bamboo mb-2">
              What is Mission in Ikigai?
            </h2>
            <p className="font-sawarabi text-sumi">
              In the Ikigai framework, mission emerges at the intersection of what you love and what the world needs. 
              This is where your passions align with making a positive impact on others.
              Identifying your mission helps you find purpose and meaning in your activities.
            </p>
          </div>
          
          <QuestionModule
            questions={missionQuestions}
            pillarName="mission"
            pillarColor="bamboo"
            onComplete={handleComplete}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
