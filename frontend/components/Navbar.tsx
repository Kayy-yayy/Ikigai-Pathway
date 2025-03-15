import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          {user && (
            <div className="mr-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <Image 
                    src={user.user_metadata.avatar_url} 
                    alt="User Avatar" 
                    width={40} 
                    height={40} 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-sakura-pink flex items-center justify-center text-sumi-black font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
          <Link href="/" className="font-noto-serif text-xl font-bold text-indigo-blue">
            Ikigai Pathway
          </Link>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-bamboo-green transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-bamboo-green transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/ikigai-chart" className="hover:text-bamboo-green transition-colors">
                Ikigai Chart
              </Link>
            </li>
            {user ? (
              <li>
                <button 
                  onClick={handleLogout}
                  className="hover:text-bamboo-green transition-colors"
                >
                  Logout
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
