import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import AuthModal from '../components/AuthModal';

export default function IkigaiChart() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tips, setTips] = useState<Array<{ tip: string; category: string }>>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load user responses and generate chart data
  useEffect(() => {
    if (!user) return;

    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses?user_id=${user.id}`);
        
        if (!res.ok) {
          throw new Error('Failed to load responses');
        }
        
        const data = await res.json();
        
        // Check if we have responses for all pillars
        const pillars = ['passion', 'profession', 'mission', 'vocation'];
        const hasAllPillars = pillars.every(pillar => 
          data.some((item: any) => item.pillar === pillar)
        );
        
        if (!hasAllPillars) {
          setChartData(null);
          return;
        }
        
        // Process responses into chart data
        const processedData: any = {};
        
        pillars.forEach(pillar => {
          const pillarResponses = data.filter((item: any) => item.pillar === pillar);
          processedData[pillar] = pillarResponses.map((item: any) => ({
            questionId: item.question_id,
            responses: item.response.split('|')
          }));
        });
        
        // Save chart data to Supabase
        const chartRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/charts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            chart_data: processedData
          }),
        });
        
        if (!chartRes.ok) {
          throw new Error('Failed to save chart data');
        }
        
        setChartData(processedData);
        
        // Fetch workplace tips
        const tipsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/charts/${user.id}/tips`);
        
        if (tipsRes.ok) {
          const tipsData = await tipsRes.json();
          setTips(tipsData);
        }
      } catch (err) {
        console.error('Error loading chart data:', err);
        setError('Failed to load your ikigai chart data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResponses();
  }, [user]);

  const handleDownloadPNG = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#F9F5F0',
      });
      
      const link = document.createElement('a');
      link.download = 'ikigai-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error downloading PNG:', err);
      setError('Failed to download chart as PNG');
    }
  };

  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#F9F5F0',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('ikigai-chart.pdf');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download chart as PDF');
    }
  };

  const handleStartJourney = () => {
    router.push('/pillars/passion');
  };

  // If loading, show loading spinner
  if (loading || isLoading) {
    return (
      <Layout title="Your Ikigai Chart">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
        </div>
      </Layout>
    );
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <Layout title="Your Ikigai Chart">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-indigo mb-6">
            Your Ikigai Chart
          </h1>
          
          <p className="font-sawarabi text-sumi mb-8">
            Please sign in or create an account to view your ikigai chart.
          </p>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-indigo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Sign In / Sign Up
          </button>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Layout>
    );
  }

  // If no chart data, show empty state
  if (!chartData) {
    return (
      <Layout title="Your Ikigai Chart">
        <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="font-noto text-3xl text-indigo mb-6">
            Your Ikigai Chart
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <p className="font-sawarabi text-sumi mb-6">
              You haven't completed all four pillars of your ikigai journey yet.
              Complete all four pillars to generate your personalized ikigai chart.
            </p>
            
            <button
              onClick={handleStartJourney}
              className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Ikigai Chart">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-noto text-3xl text-indigo text-center mb-6">
          Your Ikigai Chart
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="mb-6 text-center">
            <p className="font-sawarabi text-sumi">
              Below is your personalized ikigai chart based on your responses.
              Download it as a PNG or PDF to keep as a reminder of your purpose.
            </p>
          </div>
          
          {/* Ikigai Chart Visualization */}
          <div 
            ref={chartRef}
            className="relative w-full h-96 md:h-[32rem] mb-8 bg-softWhite rounded-lg p-4"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 relative">
                {/* Passion Circle */}
                <div className="absolute top-0 left-1/4 right-1/4 h-1/2 rounded-t-full bg-sakura bg-opacity-70 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <h3 className="font-noto text-lg font-bold mb-2">Passion</h3>
                  <div className="text-xs md:text-sm font-sawarabi text-center max-h-full overflow-y-auto">
                    {chartData.passion && chartData.passion.flatMap((q: any) => 
                      q.responses.map((r: string, i: number) => (
                        <div key={`passion-${q.questionId}-${i}`} className="mb-1 px-2 py-1 bg-white bg-opacity-30 rounded">
                          {r}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Profession Circle */}
                <div className="absolute top-1/4 right-0 bottom-1/4 w-1/2 rounded-r-full bg-bamboo bg-opacity-70 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <h3 className="font-noto text-lg font-bold mb-2">Profession</h3>
                  <div className="text-xs md:text-sm font-sawarabi text-center max-h-full overflow-y-auto">
                    {chartData.profession && chartData.profession.flatMap((q: any) => 
                      q.responses.map((r: string, i: number) => (
                        <div key={`profession-${q.questionId}-${i}`} className="mb-1 px-2 py-1 bg-white bg-opacity-30 rounded">
                          {r}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Mission Circle */}
                <div className="absolute top-1/4 left-0 bottom-1/4 w-1/2 rounded-l-full bg-indigo bg-opacity-70 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <h3 className="font-noto text-lg font-bold mb-2 text-white">Mission</h3>
                  <div className="text-xs md:text-sm font-sawarabi text-white text-center max-h-full overflow-y-auto">
                    {chartData.mission && chartData.mission.flatMap((q: any) => 
                      q.responses.map((r: string, i: number) => (
                        <div key={`mission-${q.questionId}-${i}`} className="mb-1 px-2 py-1 bg-white bg-opacity-30 rounded text-sumi">
                          {r}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Vocation Circle */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-1/2 rounded-b-full bg-gold bg-opacity-70 flex flex-col items-center justify-center p-4 overflow-hidden">
                  <h3 className="font-noto text-lg font-bold mb-2">Vocation</h3>
                  <div className="text-xs md:text-sm font-sawarabi text-center max-h-full overflow-y-auto">
                    {chartData.vocation && chartData.vocation.flatMap((q: any) => 
                      q.responses.map((r: string, i: number) => (
                        <div key={`vocation-${q.questionId}-${i}`} className="mb-1 px-2 py-1 bg-white bg-opacity-30 rounded">
                          {r}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Center - Ikigai */}
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <h2 className="font-noto text-xl md:text-2xl font-bold text-sumi">IKIGAI</h2>
                    <p className="font-sawarabi text-xs md:text-sm text-gray-600">Your Purpose</p>
                    <p className="font-hina text-xs md:text-sm text-indigo mt-2">{user.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={handleDownloadPNG}
              className="bg-indigo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download as PNG
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Download as PDF
            </button>
          </div>
        </div>
        
        {/* Workplace Growth Tips */}
        {tips.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="font-noto text-2xl text-bamboo mb-6 text-center">
              Workplace Growth Tips
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    tip.category === 'passion' ? 'bg-sakura bg-opacity-20' :
                    tip.category === 'profession' ? 'bg-bamboo bg-opacity-20' :
                    tip.category === 'mission' ? 'bg-indigo bg-opacity-20' :
                    tip.category === 'vocation' ? 'bg-gold bg-opacity-20' :
                    'bg-gray-100'
                  }`}
                >
                  <p className="font-sawarabi">{tip.tip}</p>
                  <span className="text-xs text-gray-500 mt-2 block capitalize">{tip.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
