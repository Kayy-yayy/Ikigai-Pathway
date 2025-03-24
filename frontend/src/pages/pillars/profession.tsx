import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import QuestionModule from '@/components/QuestionModule';
import { useSimpleUser } from '@/context/SimpleUserContext';

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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-noto text-gold mb-4">
            Profession
          </h1>
          <p className="text-lg font-sawarabi text-sumi">
            Discover what you're good at and what the world will pay you for
          </p>
        </div>
        
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-noto text-gold mb-2">
              What is Profession in Ikigai?
            </h2>
            <p className="font-sawarabi text-sumi">
              In the Ikigai framework, profession represents the intersection of what you're good at and what the world will pay you for. 
              These are your marketable skills and talents that can provide financial stability.
              Identifying your professional strengths helps you find work that rewards your capabilities.
            </p>
          </div>
          
          <QuestionModule
            questions={professionQuestions}
            pillarName="profession"
            pillarColor="gold"
            onComplete={handleComplete}
            userId={user?.id}
          />
        </div>
      </div>
    </Layout>
  );
}
