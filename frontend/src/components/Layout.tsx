import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSimpleUser } from '../context/SimpleUserContext';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useSimpleUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize background music
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set volume to 20%
      
      // Check if user has a preference for audio
      const audioEnabled = localStorage.getItem('audioEnabled');
      
      // Try to play if user previously enabled audio
      if (audioEnabled === 'true') {
        playAudio();
      }
    }
    
    // Add event listener for visibility change to handle tab switching
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Handle tab visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause when tab is not visible
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    } else {
      // Resume if it was playing before
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Could not resume audio:', err);
        });
      }
    }
  };
  
  // Function to play audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        localStorage.setItem('audioEnabled', 'true');
      }).catch(err => {
        console.log('Autoplay prevented. User interaction required to play audio.', err);
        setIsPlaying(false);
      });
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        playAudio();
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('audioEnabled', 'false');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-softWhite">
      <Head>
        <title>{'Ikigai Pathway'}</title>
        <meta name="description" content="Find your life purpose through the Japanese concept of Ikigai" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&family=Sawarabi+Mincho&family=Hina+Mincho&display=swap" rel="stylesheet" />
      </Head>

      <header className="bg-sumi shadow-md">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex justify-between items-center">
            {/* Logo and Avatar Section */}
            <div className="flex items-center">
              {/* User Avatar (if available) */}
              {user && (
                <div className="relative w-10 h-10 mr-3">
                  <div className="w-10 h-10 rounded-full border-2 border-gold overflow-hidden">
                    <Image
                      src={`/images/avatar images/${user.avatar_id}.jpg`}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Logo */}
              <Link href="/">
                <a className="flex items-center">
                  <div className="relative w-10 h-10 mr-2">
                    <Image
                      src="/images/ikigai-logo.png"
                      alt="Ikigai Pathway Logo"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span className="text-xl font-noto text-gold">Ikigai Pathway</span>
                </a>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex space-x-6">
              <Link href="/">
                <a className="text-softWhite hover:text-gold transition duration-300">Home</a>
              </Link>
              <Link href="/pillars/passion">
                <a className="text-softWhite hover:text-gold transition duration-300">Pillars</a>
              </Link>
              {user && user.has_completed_questions && (
                <Link href="/ikigai-chart">
                  <a className="text-softWhite hover:text-gold transition duration-300">Ikigai Chart</a>
                </Link>
              )}
              <Link href="/about">
                <a className="text-softWhite hover:text-gold transition duration-300">About</a>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-softWhite focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden absolute top-16 right-0 w-48 bg-sumi shadow-lg rounded-md py-2 z-50">
                <Link href="/">
                  <a className="block px-4 py-2 text-softWhite hover:bg-indigo hover:bg-opacity-20 transition duration-300">
                    Home
                  </a>
                </Link>
                <Link href="/pillars/passion">
                  <a className="block px-4 py-2 text-softWhite hover:bg-indigo hover:bg-opacity-20 transition duration-300">
                    Pillars
                  </a>
                </Link>
                {user && user.has_completed_questions && (
                  <Link href="/ikigai-chart">
                    <a className="block px-4 py-2 text-softWhite hover:bg-indigo hover:bg-opacity-20 transition duration-300">
                      Ikigai Chart
                    </a>
                  </Link>
                )}
                <Link href="/about">
                  <a className="block px-4 py-2 text-softWhite hover:bg-indigo hover:bg-opacity-20 transition duration-300">
                    About
                  </a>
                </Link>
              </div>
            )}
            
            {/* Audio Toggle */}
            <button 
              onClick={toggleAudio}
              className="text-softWhite hover:text-gold transition duration-300"
              aria-label="Toggle background music"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isPlaying ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M9.5 6.5v11a1 1 0 001.5.87l7.5-5.5a1 1 0 000-1.74l-7.5-5.5a1 1 0 00-1.5.87z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                )}
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-sumi py-6 text-softWhite">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-sawarabi">&copy; {new Date().getFullYear()} Ikigai Pathway</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about">
                <a className="hover:text-gold transition duration-300">About</a>
              </Link>
              <Link href="/privacy">
                <a className="hover:text-gold transition duration-300">Privacy Policy</a>
              </Link>
              <Link href="/terms">
                <a className="hover:text-gold transition duration-300">Terms of Service</a>
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Background audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/sounds/zen_background.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Layout;
