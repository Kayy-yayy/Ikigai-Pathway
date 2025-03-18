// This file creates a catch-all API route that proxies requests to your FastAPI backend
// when deployed on Vercel

import { createProxyMiddleware } from 'http-proxy-middleware';

// Create proxy instance outside of handler to reuse
const apiProxy = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/serverless': '', // remove /api/serverless prefix when forwarding
  },
});

export default function handler(req, res) {
  // Don't allow API resolution in Edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    return res.status(404).send('Not found');
  }

  // Forward to API
  return apiProxy(req, res);
}

export const config = {
  api: {
    bodyParser: false, // Don't parse body, proxy will handle it
    externalResolver: true, // Mark as external resolver
  },
};
