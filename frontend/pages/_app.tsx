import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';

function MyApp({ 
  Component, 
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}

export default MyApp;
