/**
 * API service for handling requests to the Flask backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get AI suggestions based on user input for a specific pillar
 */
export const getSuggestions = async (input: string, pillar: string) => {
  try {
    const response = await fetch(`${API_URL}/api/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, pillar }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get suggestions');
    }
    
    return data.suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

/**
 * Save a user's response to an ikigai question
 */
export const saveResponse = async (userId: string, pillar: string, questionId: number, response: string) => {
  try {
    const apiResponse = await fetch(`${API_URL}/api/ikigai/save-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        pillar,
        question_id: questionId,
        response,
      }),
    });
    
    const data = await apiResponse.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to save response');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving response:', error);
    return false;
  }
};

/**
 * Get all responses for a user
 */
export const getResponses = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/ikigai/get-responses?user_id=${userId}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get responses');
    }
    
    return data.responses;
  } catch (error) {
    console.error('Error getting responses:', error);
    return {};
  }
};

/**
 * Get responses for a specific pillar for a user
 */
export const getPillarResponses = async (userId: string, pillar: string) => {
  try {
    const response = await fetch(`${API_URL}/api/ikigai/get-pillar-responses?user_id=${userId}&pillar=${pillar}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get pillar responses');
    }
    
    return data.responses;
  } catch (error) {
    console.error('Error getting pillar responses:', error);
    return [];
  }
};

/**
 * Get workplace growth tips based on user's ikigai responses
 */
export const getWorkplaceTips = async (responses: any) => {
  try {
    const response = await fetch(`${API_URL}/api/workplace-tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ responses }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to get workplace tips');
    }
    
    return data.tips;
  } catch (error) {
    console.error('Error getting workplace tips:', error);
    // Return fallback tips
    return [
      "Schedule time for activities you're passionate about each week",
      "Look for opportunities to apply your natural talents in your current role",
      "Connect with mentors who share your mission and values",
      "Identify one small way to bring more of your ikigai into your daily work",
      "Consider how you might create a side project that combines your passions and skills"
    ];
  }
};

/**
 * Validate a Supabase JWT token with the backend
 */
export const validateToken = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to validate token');
    }
    
    return data.user;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
};

/**
 * Update user profile information
 */
export const updateProfile = async (token: string, username: string, avatarUrl: string) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        username,
        avatar_url: avatarUrl,
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    
    return data.user;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};
