import React from 'react';
import type { AppProps } from 'next/app';
import { SimpleUserProvider } from '../context/SimpleUserContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SimpleUserProvider>
      <Component {...pageProps} />
    </SimpleUserProvider>
  );
}
