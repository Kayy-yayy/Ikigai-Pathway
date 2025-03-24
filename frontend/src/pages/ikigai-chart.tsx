import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Layout from '@/components/Layout';
import { useSimpleUser } from '@/context/SimpleUserContext';

export default function IkigaiChart() {
  const { user, loading } = useSimpleUser();
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tips, setTips] = useState<Array<{ tip: string; category: string }>>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if user has completed questions
  useEffect(() => {
    if (loading) return;
    
    // Redirect if user doesn't exist or hasn't completed their questions
    if (!user || !user.has_completed_questions) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load user responses and generate chart data
  useEffect(() => {
    if (!user || !user.id || !user.has_completed_questions) return;

    const fetchResponses = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses?user_id=${user.id}`);
        
        if (!res.ok) {
          throw new Error('Failed to load responses');
        }
        
        const data = await res.json();
        
        // Group responses by pillar
        const responsesByPillar: Record<string, string[]> = {
          passion: [],
          profession: [],
          mission: [],
          vocation: []
        };
        
        data.forEach((item: any) => {
          if (responsesByPillar[item.pillar]) {
            // Split the pipe-separated responses
            const responses = item.response.split('|');
            responsesByPillar[item.pillar] = [
              ...responsesByPillar[item.pillar],
              ...responses
            ];
          }
        });
        
        // Check if we have responses for all pillars
        const pillars = ['passion', 'profession', 'mission', 'vocation'];
        const hasAllPillars = pillars.every(pillar => 
          responsesByPillar[pillar].length > 0
        );
        
        if (!hasAllPillars) {
          setError('Please complete all four pillars before viewing your Ikigai chart');
          setIsLoading(false);
          return;
        }
        
        // Generate chart data
        const chartData = {
          passion: responsesByPillar.passion,
          profession: responsesByPillar.profession,
          mission: responsesByPillar.mission,
          vocation: responsesByPillar.vocation,
          // Intersections
          love: findIntersection(responsesByPillar.passion, responsesByPillar.mission),
          good: findIntersection(responsesByPillar.passion, responsesByPillar.profession),
          paid: findIntersection(responsesByPillar.profession, responsesByPillar.vocation),
          needs: findIntersection(responsesByPillar.mission, responsesByPillar.vocation),
          // Center - Ikigai
          ikigai: findMultiIntersection([
            responsesByPillar.passion,
            responsesByPillar.profession,
            responsesByPillar.mission,
            responsesByPillar.vocation
          ])
        };
        
        setChartData(chartData);
        
        // Generate tips based on chart data
        generateTips(chartData);
      } catch (err) {
        console.error('Error loading responses:', err);
        setError('Failed to load your responses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResponses();
  }, [user]);

  // Find intersection between two arrays
  const findIntersection = (arr1: string[], arr2: string[]) => {
    return arr1.filter(item => 
      arr2.some(item2 => 
        item.toLowerCase().includes(item2.toLowerCase()) || 
        item2.toLowerCase().includes(item.toLowerCase())
      )
    );
  };

  // Find intersection between multiple arrays
  const findMultiIntersection = (arrays: string[][]) => {
    if (arrays.length === 0) return [];
    
    let result = arrays[0];
    
    for (let i = 1; i < arrays.length; i++) {
      result = findIntersection(result, arrays[i]);
    }
    
    return result;
  };

  // Generate tips based on chart data
  const generateTips = (chartData: any) => {
    const newTips = [];
    
    // Check if ikigai is empty
    if (chartData.ikigai.length === 0) {
      newTips.push({
        tip: "Your Ikigai center is empty. Try to find activities that combine all four pillars.",
        category: "ikigai"
      });
    }
    
    // Check for weak intersections
    if (chartData.love.length === 0) {
      newTips.push({
        tip: "Consider how your passions can address needs in the world.",
        category: "love"
      });
    }
    
    if (chartData.good.length === 0) {
      newTips.push({
        tip: "Look for ways to develop skills in areas you're passionate about.",
        category: "good"
      });
    }
    
    if (chartData.paid.length === 0) {
      newTips.push({
        tip: "Explore how your skills can be applied to address market demands.",
        category: "paid"
      });
    }
    
    if (chartData.needs.length === 0) {
      newTips.push({
        tip: "Consider how addressing world needs can be turned into sustainable work.",
        category: "needs"
      });
    }
    
    // Add general tips
    newTips.push({
      tip: "Revisit your answers regularly as your Ikigai evolves over time.",
      category: "general"
    });
    
    newTips.push({
      tip: "Start small: pick one item from your Ikigai center to explore further.",
      category: "general"
    });
    
    setTips(newTips);
  };

  // Download chart as PDF
  const downloadPDF = async () => {
    if (!chartRef.current) return;
    
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Your Ikigai Chart', pdfWidth / 2, 10, { align: 'center' });
      
      // Add tips
      if (tips.length > 0) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text('Tips for Your Ikigai Journey', pdfWidth / 2, 20, { align: 'center' });
        
        pdf.setFontSize(12);
        let yPos = 40;
        
        tips.forEach((tip, index) => {
          pdf.text(`${index + 1}. ${tip.tip}`, 20, yPos);
          yPos += 10;
        });
      }
      
      pdf.save('ikigai-chart.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to download chart as PDF');
    }
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-noto text-red-600 mb-2">Error</h2>
            <p className="font-sawarabi text-red-700">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-indigo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!chartData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <h1 className="font-noto text-3xl text-indigo mb-6">
            Your Ikigai Chart
          </h1>
          <p className="font-sawarabi text-sumi mb-8">
            Please complete all four pillars of your Ikigai journey to view your chart.
          </p>
          <button
            onClick={() => router.push('/pillars/passion')}
            className="bg-sakura hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
          >
            Start Your Journey
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-noto text-indigo mb-4">
            Your Ikigai Chart
          </h1>
          <p className="text-lg font-sawarabi text-sumi">
            Discover the intersection of what you love, what you're good at, what the world needs, and what you can be paid for
          </p>
        </div>
        
        {/* Ikigai Chart */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <div ref={chartRef} className="relative w-full aspect-square max-w-3xl mx-auto">
            {/* Passion Circle */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 -translate-x-1/4 -translate-y-0 rounded-full bg-sakura bg-opacity-30 flex flex-col justify-center items-center p-4 overflow-hidden">
              <h3 className="font-noto text-sakura text-lg mb-2">Passion</h3>
              <p className="font-sawarabi text-xs text-center">What you LOVE</p>
              <ul className="text-xs mt-2 list-disc pl-4 overflow-y-auto max-h-20">
                {chartData.passion.slice(0, 3).map((item: string, index: number) => (
                  <li key={`passion-${index}`} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Profession Circle */}
            <div className="absolute top-0 right-1/4 w-1/2 h-1/2 translate-x-1/4 -translate-y-0 rounded-full bg-gold bg-opacity-30 flex flex-col justify-center items-center p-4 overflow-hidden">
              <h3 className="font-noto text-gold text-lg mb-2">Profession</h3>
              <p className="font-sawarabi text-xs text-center">What you're GOOD AT</p>
              <ul className="text-xs mt-2 list-disc pl-4 overflow-y-auto max-h-20">
                {chartData.profession.slice(0, 3).map((item: string, index: number) => (
                  <li key={`profession-${index}`} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Mission Circle */}
            <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 -translate-x-1/4 translate-y-0 rounded-full bg-bamboo bg-opacity-30 flex flex-col justify-center items-center p-4 overflow-hidden">
              <h3 className="font-noto text-bamboo text-lg mb-2">Mission</h3>
              <p className="font-sawarabi text-xs text-center">What the world NEEDS</p>
              <ul className="text-xs mt-2 list-disc pl-4 overflow-y-auto max-h-20">
                {chartData.mission.slice(0, 3).map((item: string, index: number) => (
                  <li key={`mission-${index}`} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Vocation Circle */}
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 translate-x-1/4 translate-y-0 rounded-full bg-indigo bg-opacity-30 flex flex-col justify-center items-center p-4 overflow-hidden">
              <h3 className="font-noto text-indigo text-lg mb-2">Vocation</h3>
              <p className="font-sawarabi text-xs text-center">What you can be PAID FOR</p>
              <ul className="text-xs mt-2 list-disc pl-4 overflow-y-auto max-h-20">
                {chartData.vocation.slice(0, 3).map((item: string, index: number) => (
                  <li key={`vocation-${index}`} className="mb-1">{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Ikigai Center */}
            <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg flex flex-col justify-center items-center p-2">
              <h3 className="font-noto text-sumi text-sm mb-1">IKIGAI</h3>
              <ul className="text-xs text-center overflow-y-auto max-h-16">
                {chartData.ikigai.length > 0 ? (
                  chartData.ikigai.slice(0, 2).map((item: string, index: number) => (
                    <li key={`ikigai-${index}`} className="mb-1">{item}</li>
                  ))
                ) : (
                  <li className="italic text-gray-500">Keep exploring to find your Ikigai</li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={downloadPDF}
              className="bg-indigo hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300"
            >
              Download as PDF
            </button>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-noto text-indigo mb-4 text-center">
            Tips for Your Ikigai Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  tip.category === 'ikigai' ? 'bg-sumi bg-opacity-10' :
                  tip.category === 'love' ? 'bg-sakura bg-opacity-10' :
                  tip.category === 'good' ? 'bg-gold bg-opacity-10' :
                  tip.category === 'paid' ? 'bg-indigo bg-opacity-10' :
                  tip.category === 'needs' ? 'bg-bamboo bg-opacity-10' :
                  'bg-gray-100'
                }`}
              >
                <p className="font-sawarabi">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-noto text-indigo mb-4 text-center">
            Next Steps
          </h2>
          
          <p className="font-sawarabi text-sumi mb-6 text-center">
            Your Ikigai journey doesn't end here. Continue to explore and refine your understanding.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/pillars/passion')}
              className="bg-sakura bg-opacity-90 hover:bg-opacity-100 text-white font-sawarabi py-3 px-6 rounded-md transition duration-300"
            >
              Revisit Your Answers
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="bg-indigo bg-opacity-90 hover:bg-opacity-100 text-white font-sawarabi py-3 px-6 rounded-md transition duration-300"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
