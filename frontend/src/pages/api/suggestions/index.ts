import { NextApiRequest, NextApiResponse } from 'next';

// Mock suggestions for each pillar
const SUGGESTIONS = {
  passion: [
    'Drawing or painting',
    'Writing stories or poetry',
    'Playing musical instruments',
    'Cooking new recipes',
    'Gardening',
    'Photography',
    'Hiking and exploring nature',
    'Reading books',
    'Learning languages',
    'Teaching others',
    'Solving puzzles',
    'Playing sports',
    'Meditation or yoga',
    'Volunteering',
    'Crafting or DIY projects'
  ],
  profession: [
    'Public speaking',
    'Writing clearly',
    'Problem-solving',
    'Critical thinking',
    'Leadership',
    'Organization',
    'Technical skills',
    'Creative thinking',
    'Research abilities',
    'Analytical skills',
    'Attention to detail',
    'Adaptability',
    'Communication',
    'Teamwork',
    'Project management'
  ],
  mission: [
    'Environmental conservation',
    'Education access',
    'Healthcare improvement',
    'Poverty reduction',
    'Mental health awareness',
    'Animal welfare',
    'Elderly care',
    'Child development',
    'Community building',
    'Arts and culture preservation',
    'Technological literacy',
    'Sustainable living',
    'Social justice',
    'Disaster relief',
    'Food security'
  ],
  vocation: [
    'Consulting services',
    'Teaching or tutoring',
    'Content creation',
    'Software development',
    'Design services',
    'Financial planning',
    'Health and wellness coaching',
    'Marketing strategy',
    'Event planning',
    'Project management',
    'Research and analysis',
    'Translation services',
    'Career coaching',
    'Technical writing',
    'Virtual assistance'
  ]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pillar, question } = req.body;

  if (!pillar) {
    return res.status(400).json({ error: 'Pillar is required' });
  }

  // Get suggestions for the specified pillar
  const pillarSuggestions = SUGGESTIONS[pillar as keyof typeof SUGGESTIONS] || [];
  
  // Randomly select 5 suggestions
  const randomSuggestions = [...pillarSuggestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return res.status(200).json({ suggestions: randomSuggestions });
}
