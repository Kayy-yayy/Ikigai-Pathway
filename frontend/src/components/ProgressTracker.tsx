import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PillarIcon from './PillarIcon';

type ProgressTrackerProps = {
  userId?: string;
  compact?: boolean;
};

type PillarProgress = {
  pillar: 'passion' | 'profession' | 'mission' | 'vocation';
  completed: boolean;
  questionCount: number;
  answeredCount: number;
  color: string;
  route: string;
  label: string;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userId, compact = false }) => {
  const [pillarsProgress, setPillarsProgress] = useState<PillarProgress[]>([
    { pillar: 'passion', completed: false, questionCount: 2, answeredCount: 0, color: 'sakura', route: '/pillars/passion', label: 'Passion' },
    { pillar: 'profession', completed: false, questionCount: 2, answeredCount: 0, color: 'bamboo', route: '/pillars/profession', label: 'Profession' },
    { pillar: 'mission', completed: false, questionCount: 2, answeredCount: 0, color: 'indigo', route: '/pillars/mission', label: 'Mission' },
    { pillar: 'vocation', completed: false, questionCount: 2, answeredCount: 0, color: 'gold', route: '/pillars/vocation', label: 'Vocation' },
  ]);
  const [overallProgress, setOverallProgress] = useState(0);
  const router = useRouter();

  // Fetch progress data when component mounts
  useEffect(() => {
    if (userId) {
      fetchProgressData();
    }
  }, [userId]);

  // Fetch progress data from API
  const fetchProgressData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses/progress?user_id=${userId}`);
      
      if (res.ok) {
        const data = await res.json();
        
        // Update pillar progress
        const updatedPillars = pillarsProgress.map(pillar => {
          const pillarData = data.pillars.find((p: any) => p.pillar === pillar.pillar);
          
          if (pillarData) {
            return {
              ...pillar,
              completed: pillarData.completed,
              answeredCount: pillarData.answeredCount,
            };
          }
          
          return pillar;
        });
        
        setPillarsProgress(updatedPillars);
        setOverallProgress(data.overallProgress);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  // Navigate to a pillar page
  const navigateToPillar = (route: string) => {
    router.push(route);
  };

  // Calculate progress percentage for a pillar
  const calculateProgress = (answeredCount: number, questionCount: number) => {
    return (answeredCount / questionCount) * 100;
  };

  // Render compact version (for home page)
  if (compact) {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-noto text-sumi mb-4">Your Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-indigo h-3 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">{overallProgress}% Complete</span>
          <span className="text-xs text-gray-600">
            {pillarsProgress.filter(p => p.completed).length} of 4 Pillars Completed
          </span>
        </div>
      </div>
    );
  }

  // Render full version (for pillar pages)
  return (
    <div className="mb-8 bg-white bg-opacity-90 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-noto text-sumi mb-4">Your Ikigai Journey</h3>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-indigo h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pillarsProgress.map((pillar) => (
          <div 
            key={pillar.pillar}
            className={`rounded-lg p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
              pillar.completed 
                ? `border-${pillar.color} bg-${pillar.color} bg-opacity-20` 
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => navigateToPillar(pillar.route)}
          >
            <div className="flex flex-col items-center">
              <PillarIcon pillar={pillar.pillar} size="md" />
              <span className={`mt-2 font-noto ${pillar.completed ? `text-${pillar.color}` : 'text-gray-500'}`}>
                {pillar.label}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`bg-${pillar.color} h-2 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${calculateProgress(pillar.answeredCount, pillar.questionCount)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
