import type { NextPage } from 'next';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Home: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  const handleBeginJourney = () => {
    if (user) {
      router.push('/pillars/passion');
    } else {
      // Dispatch custom event to open signup modal
      window.dispatchEvent(new Event('openSignupModal'));
    }
  };

  return (
    <>
      <section className="hero bg-zen-garden">
        <div className="hero-content">
          <h1 className="text-4xl font-bold mb-4 font-noto-serif text-indigo-blue">Discover Your Ikigai</h1>
          <p className="mb-8 text-lg">
            Begin a mindful journey to find your life&apos;s purpose through the ancient Japanese concept of Ikigai
          </p>
          <button 
            onClick={handleBeginJourney}
            className="btn btn-primary"
          >
            Begin Your Journey
          </button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center font-noto-serif text-indigo-blue">
            The Four Pillars of Ikigai
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="pillar-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 font-noto-serif text-sakura-pink">What You Love</h3>
              <p className="mb-6 text-gray-700">
                Discover activities and interests that bring you joy and fulfillment.
              </p>
              <Link 
                href={user ? "/pillars/passion" : "#"}
                onClick={!user ? handleBeginJourney : undefined}
                className="btn btn-secondary inline-block"
              >
                Explore
              </Link>
            </div>
            
            <div className="pillar-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 font-noto-serif text-bamboo-green">What the World Needs</h3>
              <p className="mb-6 text-gray-700">
                Identify how your skills and interests can serve others and make a positive impact.
              </p>
              <Link 
                href={user ? "/pillars/mission" : "#"}
                onClick={!user ? handleBeginJourney : undefined}
                className="btn btn-secondary inline-block"
              >
                Explore
              </Link>
            </div>
            
            <div className="pillar-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 font-noto-serif text-indigo-blue">What You Are Good At</h3>
              <p className="mb-6 text-gray-700">
                Recognize your natural talents and developed skills.
              </p>
              <Link 
                href={user ? "/pillars/vocation" : "#"}
                onClick={!user ? handleBeginJourney : undefined}
                className="btn btn-secondary inline-block"
              >
                Explore
              </Link>
            </div>
            
            <div className="pillar-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold mb-3 font-noto-serif text-accent-gold">What You Can Be Paid For</h3>
              <p className="mb-6 text-gray-700">
                Explore how your passions and skills can translate into financial stability.
              </p>
              <Link 
                href={user ? "/pillars/profession" : "#"}
                onClick={!user ? handleBeginJourney : undefined}
                className="btn btn-secondary inline-block"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-sakura-pink bg-opacity-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 font-noto-serif text-indigo-blue">
            Find Balance and Purpose
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Ikigai is the intersection of what you love, what you&apos;re good at, what the world needs, and what you can be paid for. 
            Discover your unique path to a fulfilling life.
          </p>
          <button 
            onClick={handleBeginJourney}
            className="btn btn-primary"
          >
            Start Your Ikigai Journey
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
