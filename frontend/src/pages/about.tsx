import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function About() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 mb-8"
          style={{ 
            backdropFilter: 'blur(10px)',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <h1 className="text-3xl md:text-4xl font-noto text-indigo mb-6">Understanding Ikigai</h1>
          
          <div className="max-w-none">
            <p className="mb-4">
              Ikigai (生き甲斐) is a Japanese concept that means "a reason for being." It is believed that everyone has an ikigai—a reason to jump out of bed each morning.
            </p>
            
            <p className="mb-6">
              The concept originated in Okinawa, Japan, where it is believed to contribute to the longevity of its residents. Finding your ikigai is considered the convergence of four primary elements:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                className="bg-sakura bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
              >
                <h3 className="text-xl font-noto mb-2">What You Love</h3>
                <p className="text-sm">
                  Activities and experiences that bring you joy, fulfillment, and energy. These are things you would do even if you weren't paid.
                </p>
              </div>
              
              <div 
                className="bg-bamboo bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
              >
                <h3 className="text-xl font-noto mb-2 text-white">What You're Good At</h3>
                <p className="text-sm text-white">
                  Your natural talents, learned skills, and areas where you excel. These often come easily to you and receive recognition from others.
                </p>
              </div>
              
              <div 
                className="bg-indigo bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
              >
                <h3 className="text-xl font-noto mb-2 text-white">What the World Needs</h3>
                <p className="text-sm text-white">
                  Services, solutions, or contributions that address problems or needs in society. This is how your existence improves the lives of others.
                </p>
              </div>
              
              <div 
                className="bg-gold bg-opacity-60 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03]"
              >
                <h3 className="text-xl font-noto mb-2">What You Can Be Paid For</h3>
                <p className="text-sm">
                  Activities others value enough to compensate you for. This allows you to sustain yourself while doing what you love.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-noto text-indigo mb-4">The Intersections of Ikigai</h2>
            
            <p className="mb-4">
              When these four elements overlap, meaningful combinations emerge:
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong className="text-sakura">Passion:</strong> What you love + What you're good at</li>
              <li><strong className="text-indigo">Mission:</strong> What you love + What the world needs</li>
              <li><strong className="text-gold">Vocation:</strong> What you're good at + What you can be paid for</li>
              <li><strong className="text-bamboo">Profession:</strong> What the world needs + What you can be paid for</li>
            </ul>
            
            <p className="mb-6">
              At the center where all four elements converge lies your ikigai—your optimal path that combines passion, mission, profession, and vocation. Finding this sweet spot can lead to a more fulfilled and purposeful life.
            </p>
            
            <h2 className="text-2xl font-noto text-indigo mb-4">Your Ikigai Journey</h2>
            
            <p className="mb-4">
              Discovering your ikigai is a personal journey of self-reflection and exploration. Through this application, you'll explore each of the four elements through guided questions and receive AI-assisted insights to help you identify patterns and connections.
            </p>
            
            <p>
              As you complete each pillar, you'll gradually build your personalized ikigai diagram—a visual representation of your purpose that you can download and reference as you navigate life and career decisions.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mb-16">
          {user && user.has_completed_questions ? (
            <Link href="/ikigai-chart">
              <a className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi py-3 px-6 rounded-md transition duration-300 shadow-lg transform hover:scale-105">
                View Your Ikigai Chart
              </a>
            </Link>
          ) : (
            <Link href="/pillars/passion">
              <a className="bg-bamboo hover:bg-opacity-90 text-white font-sawarabi py-3 px-6 rounded-md transition duration-300 shadow-lg transform hover:scale-105">
                Begin Exploring Your Ikigai
              </a>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
