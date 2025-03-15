import { useEffect, useState, useRef } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import html2canvas from 'html2canvas';

type ResponseData = {
  passion: string[];
  mission: string[];
  vocation: string[];
  profession: string[];
};

const IkigaiChart = () => {
  const [responses, setResponses] = useState<ResponseData>({
    passion: [],
    mission: [],
    vocation: [],
    profession: [],
  });
  const [workplaceTips, setWorkplaceTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedAllPillars, setHasCompletedAllPillars] = useState(false);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user && !isLoading) {
      router.push('/');
    } else if (user) {
      loadResponses();
    }
  }, [user, isLoading]);
  
  useEffect(() => {
    // Set loading to false once user state is determined
    if (supabaseClient) {
      setIsLoading(false);
    }
  }, [supabaseClient]);
  
  const loadResponses = async () => {
    try {
      const { data, error } = await supabaseClient
        .from('ikigai_responses')
        .select('pillar, response')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      if (data) {
        // Group responses by pillar
        const groupedResponses = data.reduce((acc, item) => {
          if (!acc[item.pillar]) {
            acc[item.pillar] = [];
          }
          acc[item.pillar].push(item.response);
          return acc;
        }, {} as ResponseData);
        
        setResponses(groupedResponses);
        
        // Check if all pillars have responses
        const hasAllPillars = 
          groupedResponses.passion?.length > 0 && 
          groupedResponses.mission?.length > 0 && 
          groupedResponses.vocation?.length > 0 && 
          groupedResponses.profession?.length > 0;
        
        setHasCompletedAllPillars(hasAllPillars);
        
        // If all pillars are completed, get workplace tips
        if (hasAllPillars) {
          getWorkplaceTips();
        }
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };
  
  const getWorkplaceTips = async () => {
    try {
      const response = await fetch('/api/workplace-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWorkplaceTips(data.tips);
      }
    } catch (error) {
      console.error('Error getting workplace tips:', error);
      // Fallback tips if API fails
      setWorkplaceTips([
        "Schedule time for activities you're passionate about each week",
        "Look for opportunities to apply your natural talents in your current role",
        "Connect with mentors who share your mission and values",
        "Identify one small way to bring more of your ikigai into your daily work",
        "Consider how you might create a side project that combines your passions and skills"
      ]);
    }
  };
  
  const downloadChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-ikigai-chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };
  
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
      <section className="bg-sakura-pink bg-opacity-20 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 font-noto-serif text-indigo-blue">Your Ikigai Chart</h1>
          <p className="text-xl mb-0 text-sumi-black">
            The intersection of what you love, what you&apos;re good at, what the world needs, and what you can be paid for
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          {hasCompletedAllPillars ? (
            <div className="max-w-4xl mx-auto">
              <div className="ikigai-diagram" ref={chartRef}>
                <div className="relative w-full max-w-[600px] h-[600px] mx-auto">
                  <div className="absolute top-[50px] left-[50px] w-[300px] h-[300px] rounded-full bg-sakura-pink bg-opacity-70 flex flex-col justify-center items-center text-center p-6">
                    <h3 className="font-noto-serif font-bold mb-2">What You Love</h3>
                    <div className="overflow-auto max-h-[200px] text-sm">
                      {responses.passion?.map((response, index) => (
                        <p key={index} className="mb-1">{response}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute top-[50px] right-[50px] w-[300px] h-[300px] rounded-full bg-bamboo-green bg-opacity-70 flex flex-col justify-center items-center text-center p-6">
                    <h3 className="font-noto-serif font-bold mb-2">What the World Needs</h3>
                    <div className="overflow-auto max-h-[200px] text-sm">
                      {responses.mission?.map((response, index) => (
                        <p key={index} className="mb-1">{response}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-[50px] left-[50px] w-[300px] h-[300px] rounded-full bg-indigo-blue bg-opacity-70 flex flex-col justify-center items-center text-center p-6 text-white">
                    <h3 className="font-noto-serif font-bold mb-2">What You&apos;re Good At</h3>
                    <div className="overflow-auto max-h-[200px] text-sm">
                      {responses.vocation?.map((response, index) => (
                        <p key={index} className="mb-1">{response}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-[50px] right-[50px] w-[300px] h-[300px] rounded-full bg-accent-gold bg-opacity-70 flex flex-col justify-center items-center text-center p-6">
                    <h3 className="font-noto-serif font-bold mb-2">What You Can Be Paid For</h3>
                    <div className="overflow-auto max-h-[200px] text-sm">
                      {responses.profession?.map((response, index) => (
                        <p key={index} className="mb-1">{response}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] rounded-full bg-white border-2 border-sumi-black flex justify-center items-center text-center z-10">
                    <h3 className="font-noto-serif font-bold">Your Ikigai</h3>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={downloadChart}
                  className="btn btn-primary"
                >
                  Download Chart
                </button>
              </div>
              
              {workplaceTips.length > 0 && (
                <div className="mt-16 bg-bamboo-green bg-opacity-20 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6 font-noto-serif text-indigo-blue">
                    Your Personalized Workplace Growth Tips
                  </h2>
                  <p className="mb-6">
                    Based on your ikigai profile, here are some actionable tips to help you bring more purpose to your work:
                  </p>
                  <ul className="space-y-4">
                    {workplaceTips.map((tip, index) => (
                      <li key={index} className="flex">
                        <span className="text-bamboo-green mr-3">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-sakura-pink bg-opacity-20 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4 font-noto-serif text-indigo-blue">
                Your Ikigai Chart is Waiting
              </h2>
              <p className="mb-8">
                Complete all four pillars of the Ikigai journey to generate your personalized chart and workplace growth tips.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-lg border-2 ${responses.passion?.length ? 'border-bamboo-green bg-bamboo-green bg-opacity-10' : 'border-gray-300'}`}>
                  <div className="flex items-center">
                    <span className={`mr-3 text-xl ${responses.passion?.length ? 'text-bamboo-green' : 'text-gray-400'}`}>
                      {responses.passion?.length ? '✓' : '○'}
                    </span>
                    <span className="font-medium">What You Love</span>
                  </div>
                  {!responses.passion?.length && (
                    <Link href="/pillars/passion" className="btn btn-small btn-secondary mt-2 inline-block text-sm">
                      Complete
                    </Link>
                  )}
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${responses.mission?.length ? 'border-bamboo-green bg-bamboo-green bg-opacity-10' : 'border-gray-300'}`}>
                  <div className="flex items-center">
                    <span className={`mr-3 text-xl ${responses.mission?.length ? 'text-bamboo-green' : 'text-gray-400'}`}>
                      {responses.mission?.length ? '✓' : '○'}
                    </span>
                    <span className="font-medium">What the World Needs</span>
                  </div>
                  {!responses.mission?.length && (
                    <Link href="/pillars/mission" className="btn btn-small btn-secondary mt-2 inline-block text-sm">
                      Complete
                    </Link>
                  )}
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${responses.vocation?.length ? 'border-bamboo-green bg-bamboo-green bg-opacity-10' : 'border-gray-300'}`}>
                  <div className="flex items-center">
                    <span className={`mr-3 text-xl ${responses.vocation?.length ? 'text-bamboo-green' : 'text-gray-400'}`}>
                      {responses.vocation?.length ? '✓' : '○'}
                    </span>
                    <span className="font-medium">What You&apos;re Good At</span>
                  </div>
                  {!responses.vocation?.length && (
                    <Link href="/pillars/vocation" className="btn btn-small btn-secondary mt-2 inline-block text-sm">
                      Complete
                    </Link>
                  )}
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${responses.profession?.length ? 'border-bamboo-green bg-bamboo-green bg-opacity-10' : 'border-gray-300'}`}>
                  <div className="flex items-center">
                    <span className={`mr-3 text-xl ${responses.profession?.length ? 'text-bamboo-green' : 'text-gray-400'}`}>
                      {responses.profession?.length ? '✓' : '○'}
                    </span>
                    <span className="font-medium">What You Can Be Paid For</span>
                  </div>
                  {!responses.profession?.length && (
                    <Link href="/pillars/profession" className="btn btn-small btn-secondary mt-2 inline-block text-sm">
                      Complete
                    </Link>
                  )}
                </div>
              </div>
              
              <Link href="/pillars/passion" className="btn btn-primary">
                Begin Your Journey
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default IkigaiChart;
