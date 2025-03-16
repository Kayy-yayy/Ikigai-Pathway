import React, { ReactNode, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Ikigai Pathway' }) => {
  const { user } = useUser();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize background music
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set volume to 20%
      
      // Only autoplay on the landing page
      if (router.pathname === '/') {
        audioRef.current.play().catch(err => {
          console.log('Autoplay prevented. User interaction required to play audio.');
        });
      }
    }
  }, [router.pathname]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-softWhite">
      <Head>
        <title>{title} | Ikigai Pathway</title>
        <meta name="description" content="Find your life purpose with Ikigai Pathway" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;700&family=Sawarabi+Mincho&family=Hina+Mincho&display=swap" rel="stylesheet" />
      </Head>

      <header className="bg-sumi text-softWhite p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {user && user.avatar_url && (
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image 
                  src={user.avatar_url} 
                  alt={user.username || 'User avatar'} 
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <Link href="/" className="font-noto text-2xl font-bold text-sakura hover:text-gold transition duration-300">
              Ikigai Pathway
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/about" className="font-sawarabi hover:text-gold transition duration-300">
              About
            </Link>
            <Link href="/ikigai-chart" className="font-sawarabi hover:text-gold transition duration-300">
              Ikigai Chart
            </Link>
            <button 
              onClick={toggleAudio}
              className="text-softWhite hover:text-gold transition duration-300"
              aria-label="Toggle background music"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M9.5 6.5v11a1 1 0 001.5.87l7.5-5.5a1 1 0 000-1.74l-7.5-5.5a1 1 0 00-1.5.87z" />
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
      <audio ref={audioRef} loop>
        <source src="/sounds/zen_background.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Layout;
