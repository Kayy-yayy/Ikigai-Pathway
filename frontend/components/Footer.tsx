import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-sumi-black text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-noto-serif text-lg font-bold mb-4">Ikigai Pathway</h3>
            <p className="text-sm">
              A mindful journey to discover your life&apos;s purpose through the ancient Japanese concept of Ikigai.
            </p>
          </div>
          
          <div>
            <h3 className="font-noto-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sakura-pink transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sakura-pink transition-colors">
                  About Ikigai
                </Link>
              </li>
              <li>
                <Link href="/ikigai-chart" className="hover:text-sakura-pink transition-colors">
                  Your Ikigai Chart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-noto-serif text-lg font-bold mb-4">Connect</h3>
            <p className="text-sm mb-2">Share your ikigai journey with us:</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-sakura-pink transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-sakura-pink transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-sakura-pink transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Ikigai Pathway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
