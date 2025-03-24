import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the pillars that need to be completed
const REQUIRED_PILLARS = ['passion', 'mission', 'vocation', 'profession'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get all responses for this user
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select('pillar, question_id')
      .eq('user_id', user_id);

    if (responsesError) throw responsesError;

    // Group responses by pillar
    const pillarResponses: Record<string, Set<string>> = {};
    
    responses?.forEach(response => {
      if (!pillarResponses[response.pillar]) {
        pillarResponses[response.pillar] = new Set();
      }
      pillarResponses[response.pillar].add(response.question_id);
    });

    // Check if all required pillars have at least one response
    const completedPillars = Object.keys(pillarResponses);
    const allPillarsPresent = REQUIRED_PILLARS.every(pillar => completedPillars.includes(pillar));
    
    // Count total questions answered
    const totalQuestionsAnswered = Object.values(pillarResponses).reduce(
      (total, questionSet) => total + questionSet.size, 
      0
    );

    return res.status(200).json({
      allCompleted: allPillarsPresent,
      completedPillars,
      totalQuestionsAnswered,
    });
  } catch (error) {
    console.error('Error checking completion status:', error);
    return res.status(500).json({ error: 'Failed to check completion status' });
  }
}
