import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import PillarQuestions from '../../components/PillarQuestions';

// Define pillar data
const pillarData = {
  passion: {
    title: 'What You Love',
    description: 'Discover activities and interests that bring you joy and fulfillment.',
    color: 'sakura-pink',
    questions: [
      { id: 1, text: 'What activities make you lose track of time?' },
      { id: 2, text: 'What topics do you enjoy learning about?' },
      { id: 3, text: 'What would you do even if you weren\'t paid for it?' },
    ],
  },
  mission: {
    title: 'What the World Needs',
    description: 'Identify how your skills and interests can serve others and make a positive impact.',
    color: 'bamboo-green',
    questions: [
      { id: 1, text: 'What problems in the world do you feel drawn to solve?' },
      { id: 2, text: 'How would you like to contribute to your community or society?' },
      { id: 3, text: 'What changes would you like to see in the world?' },
    ],
  },
  vocation: {
    title: 'What You Are Good At',
    description: 'Recognize your natural talents and developed skills.',
    color: 'indigo-blue',
    questions: [
      { id: 1, text: 'What skills come naturally to you?' },
      { id: 2, text: 'What do others often compliment you on?' },
      { id: 3, text: 'What tasks or challenges do you excel at?' },
    ],
  },
  profession: {
    title: 'What You Can Be Paid For',
    description: 'Explore how your passions and skills can translate into financial stability.',
    color: 'accent-gold',
    questions: [
      { id: 1, text: 'What skills do you have that others might pay for?' },
      { id: 2, text: 'What careers align with your strengths and interests?' },
      { id: 3, text: 'What value can you provide in the marketplace?' },
    ],
  },
};

// Define pillar navigation
const pillarNavigation = {
  passion: {
    prev: null,
    next: 'mission',
  },
  mission: {
    prev: 'passion',
    next: 'vocation',
  },
  vocation: {
    prev: 'mission',
    next: 'profession',
  },
  profession: {
    prev: 'vocation',
    next: null,
  },
};

const PillarPage = () => {
  const router = useRouter();
  const { pillar } = router.query;
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !isLoading) {
      router.push('/');
    }
  }, [user, isLoading]);
  
  useEffect(() => {
    // Set loading to false once user state is determined
    if (supabaseClient) {
      setIsLoading(false);
    }
  }, [supabaseClient]);
  
  // Handle invalid pillar
  if (!pillar || typeof pillar !== 'string' || !pillarData[pillar as keyof typeof pillarData]) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">Pillar Not Found</h1>
        <p className="mb-8">The pillar you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    );
  }
  
  const currentPillar = pillar as keyof typeof pillarData;
  const currentPillarData = pillarData[currentPillar];
  const navigation = pillarNavigation[currentPillar];
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <>
      <section className={`bg-${currentPillarData.color} bg-opacity-20 py-16`}>
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 font-noto-serif text-indigo-blue">
            {currentPillarData.title}
          </h1>
          <p className="text-xl mb-0 text-sumi-black">
            {currentPillarData.description}
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <PillarQuestions 
              pillarName={currentPillar} 
              pillarData={currentPillarData} 
            />
            
            <div className="mt-12 flex justify-between">
              {navigation.prev ? (
                <Link 
                  href={`/pillars/${navigation.prev}`}
                  className="btn btn-secondary"
                >
                  &larr; Previous: {pillarData[navigation.prev as keyof typeof pillarData].title}
                </Link>
              ) : (
                <Link 
                  href="/"
                  className="btn btn-secondary"
                >
                  &larr; Back to Home
                </Link>
              )}
              
              {navigation.next ? (
                <Link 
                  href={`/pillars/${navigation.next}`}
                  className="btn btn-primary"
                >
                  Next: {pillarData[navigation.next as keyof typeof pillarData].title} &rarr;
                </Link>
              ) : (
                <Link 
                  href="/ikigai-chart"
                  className="btn btn-primary"
                >
                  View Your Ikigai Chart &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PillarPage;
