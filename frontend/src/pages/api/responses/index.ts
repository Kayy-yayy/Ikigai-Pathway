import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET request to fetch responses for a user and pillar
  if (req.method === 'GET') {
    const { user_id, pillar } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      let query = supabase
        .from('responses')
        .select('*')
        .eq('user_id', user_id);

      if (pillar) {
        query = query.eq('pillar', pillar);
      }

      const { data, error } = await query;

      if (error) throw error;

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      return res.status(500).json({ error: 'Failed to fetch responses' });
    }
  }

  // POST request to save responses
  if (req.method === 'POST') {
    try {
      const responses = Array.isArray(req.body) ? req.body : [req.body];

      // Validate responses
      for (const response of responses) {
        if (!response.user_id || !response.question_id || !response.pillar) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
      }

      // Upsert responses (insert or update)
      const { data, error } = await supabase
        .from('responses')
        .upsert(
          responses.map(r => ({
            user_id: r.user_id,
            question_id: r.question_id,
            pillar: r.pillar,
            response: r.response
          })),
          { onConflict: 'user_id,question_id' }
        );

      if (error) throw error;

      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error saving responses:', error);
      return res.status(500).json({ error: 'Failed to save responses' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
