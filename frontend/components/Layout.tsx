import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import SignupModal from './SignupModal';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>Ikigai Pathway - Find Your Purpose</title>
        <meta name="description" content="Discover your ikigai - your reason for being - through our guided journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      
      <SignupModal />
    </>
  );
};

export default Layout;
