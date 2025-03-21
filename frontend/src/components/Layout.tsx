import React, { ReactNode, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import AvatarSelection from './AvatarSelection';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Ikigai Pathway' }) => {
  const { user, signOut, needsAvatarSelection } = useUser();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);

  useEffect(() => {
    // Show avatar selection if needed
    if (needsAvatarSelection) {
      setShowAvatarSelection(true);
    }
  }, [needsAvatarSelection]);

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
        <title>{title ? `${title} | Ikigai Pathway` : 'Ikigai Pathway'}</title>
        <meta name="description" content="Find your life purpose through the Japanese concept of Ikigai" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&family=Sawarabi+Mincho&family=Hina+Mincho&display=swap" rel="stylesheet" />
      </Head>

      <header className="bg-sumi text-softWhite p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="font-noto text-2xl font-bold text-sakura hover:text-gold transition duration-300">
              Ikigai Pathway
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div 
                  className="flex items-center space-x-2 text-softWhite hover:text-gold transition duration-300 cursor-pointer"
                  onClick={() => setShowAvatarSelection(true)}
                >
                  {user.avatar_url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image 
                        src={user.avatar_url} 
                        alt="User avatar" 
                        layout="fill" 
                        objectFit="cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-bamboo flex items-center justify-center text-white">
                      {user.email ? user.email[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline">{user.email.split('@')[0]}</span>
                </div>
                <button 
                  onClick={signOut}
                  className="text-softWhite hover:text-gold transition duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/about" className="font-sawarabi hover:text-gold transition duration-300">
                About
              </Link>
            )}
            
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

      <footer className="bg-sumi text-softWhite p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="font-sawarabi text-sm">
            &copy; {new Date().getFullYear()} Ikigai Pathway. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Background audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/sounds/zen_background.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Avatar Selection Modal */}
      <AvatarSelection 
        isOpen={showAvatarSelection} 
        onClose={() => setShowAvatarSelection(false)} 
      />
    </div>
  );
};

export default Layout;
