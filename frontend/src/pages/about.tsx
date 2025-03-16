import React from 'react';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About Ikigai">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-noto text-4xl text-indigo text-center mb-8">
          Understanding Ikigai
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-10">
          <h2 className="font-noto text-2xl text-bamboo mb-4">
            What is Ikigai?
          </h2>
          
          <p className="font-sawarabi text-sumi mb-6">
            Ikigai (生き甲斐) is a Japanese concept that translates roughly to "a reason for being" or "a reason to get up in the morning." 
            It represents the intersection of four fundamental elements that create meaning and purpose in one's life.
          </p>
          
          <div className="relative w-full h-64 md:h-80 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Passion Circle (What you love) */}
                  <circle cx="200" cy="150" r="100" fill="#F6CECE" fillOpacity="0.7" />
                  <text x="200" y="150" textAnchor="middle" className="font-noto text-sm">What you LOVE</text>
                  
                  {/* Profession Circle (What you're good at) */}
                  <circle cx="250" cy="200" r="100" fill="#7BA17D" fillOpacity="0.7" />
                  <text x="250" y="200" textAnchor="middle" className="font-noto text-sm">What you're GOOD AT</text>
                  
                  {/* Mission Circle (What the world needs) */}
                  <circle cx="150" cy="200" r="100" fill="#3F4B83" fillOpacity="0.7" />
                  <text x="150" y="200" textAnchor="middle" className="font-noto text-sm" fill="white">What the world NEEDS</text>
                  
                  {/* Vocation Circle (What you can be paid for) */}
                  <circle cx="200" cy="250" r="100" fill="#D4AF37" fillOpacity="0.7" />
                  <text x="200" y="250" textAnchor="middle" className="font-noto text-sm">What you can be PAID FOR</text>
                  
                  {/* Center - Ikigai */}
                  <text x="200" y="200" textAnchor="middle" className="font-noto text-lg font-bold">IKIGAI</text>
                </svg>
              </div>
            </div>
          </div>
          
          <h2 className="font-noto text-2xl text-bamboo mb-4">
            The Four Pillars of Ikigai
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-sakura bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-noto text-xl mb-2">What you love (Passion)</h3>
              <p className="font-sawarabi">Activities and interests that bring you joy and fulfillment.</p>
            </div>
            
            <div className="bg-bamboo bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-noto text-xl mb-2">What you are good at (Profession)</h3>
              <p className="font-sawarabi">Your skills, talents, and strengths that you've developed.</p>
            </div>
            
            <div className="bg-indigo bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-noto text-xl mb-2">What the world needs (Mission)</h3>
              <p className="font-sawarabi">How you can contribute to society and make a positive impact.</p>
            </div>
            
            <div className="bg-gold bg-opacity-20 p-4 rounded-lg">
              <h3 className="font-noto text-xl mb-2">What you can be paid for (Vocation)</h3>
              <p className="font-sawarabi">Activities that provide financial stability and support.</p>
            </div>
          </div>
          
          <h2 className="font-noto text-2xl text-bamboo mb-4">
            Finding Your Ikigai
          </h2>
          
          <p className="font-sawarabi text-sumi mb-6">
            When these four elements overlap, you discover your ikigai - your purpose or reason for being. 
            The concept originated in Okinawa, Japan, where it has been associated with longevity and well-being.
          </p>
          
          <p className="font-sawarabi text-sumi mb-6">
            Unlike Western concepts of purpose that often focus on career success or material wealth, 
            ikigai encompasses all aspects of life. It's about finding joy and meaning in daily activities, 
            relationships, and contributions to community.
          </p>
          
          <div className="bg-softWhite border-l-4 border-indigo p-4 italic mb-8">
            <p className="font-hina text-lg">
              "Only staying active will make you want to live a hundred years."
              <span className="block text-right mt-2">— Japanese proverb</span>
            </p>
          </div>
          
          <h2 className="font-noto text-2xl text-bamboo mb-4">
            Benefits of Finding Your Ikigai
          </h2>
          
          <ul className="list-disc pl-6 font-sawarabi text-sumi mb-8 space-y-2">
            <li><strong>Improved mental health:</strong> A sense of purpose is linked to reduced depression and anxiety</li>
            <li><strong>Increased longevity:</strong> Studies suggest people with a strong sense of purpose tend to live longer</li>
            <li><strong>Greater resilience:</strong> Helps navigate life's challenges with more determination</li>
            <li><strong>Enhanced daily satisfaction:</strong> Brings fulfillment to everyday activities</li>
            <li><strong>Better work-life balance:</strong> Integrates passion, profession, mission, and vocation</li>
          </ul>
          
          <p className="font-sawarabi text-sumi">
            Ready to discover your ikigai? Our guided journey will help you explore each pillar 
            and find the beautiful intersection that represents your unique purpose.
          </p>
        </div>
      </div>
    </Layout>
  );
}
