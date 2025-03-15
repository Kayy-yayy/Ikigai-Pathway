import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { getSuggestions, saveResponse as apiSaveResponse, getPillarResponses } from '../services/api';

type Question = {
  id: number;
  text: string;
};

type PillarData = {
  title: string;
  description: string;
  questions: Question[];
  color: string;
};

type PillarQuestionsProps = {
  pillarName: string;
  pillarData: PillarData;
};

const PillarQuestions = ({ pillarName, pillarData }: PillarQuestionsProps) => {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [suggestions, setSuggestions] = useState<{ [key: number]: string[] }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  
  const user = useUser();

  // Load saved responses when component mounts
  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;
    
    try {
      const pillarResponses = await getPillarResponses(user.id, pillarName);
      
      if (pillarResponses && pillarResponses.length > 0) {
        // Map responses to question IDs
        // Note: The API returns an array of responses, we need to map them to question IDs
        // This is a simplified approach - in a real app, you'd need to ensure the mapping is correct
        const loadedResponses = pillarData.questions.reduce((acc, question, index) => {
          if (pillarResponses[index]) {
            acc[question.id] = pillarResponses[index];
          }
          return acc;
        }, {} as { [key: number]: string });
        
        setResponses(loadedResponses);
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const saveUserResponse = async (questionId: number, response: string) => {
    if (!user) return;
    
    try {
      await apiSaveResponse(user.id, pillarName, questionId, response);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleResponseChange = (questionId: number, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Debounce saving to avoid too many requests
    const timeoutId = setTimeout(() => {
      saveUserResponse(questionId, value);
    }, 1000);
    
    // Get AI suggestions if input is at least 5 characters
    if (value.length >= 5) {
      getAISuggestions(questionId, value);
    } else {
      setSuggestions(prev => ({ ...prev, [questionId]: [] }));
    }
    
    return () => clearTimeout(timeoutId);
  };

  const getAISuggestions = async (questionId: number, input: string) => {
    setLoading(prev => ({ ...prev, [questionId]: true }));
    
    try {
      const suggestionList = await getSuggestions(input, pillarName);
      setSuggestions(prev => ({ ...prev, [questionId]: suggestionList }));
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const addSuggestionToResponse = (questionId: number, suggestion: string) => {
    const currentResponse = responses[questionId] || '';
    const newResponse = currentResponse + (currentResponse.endsWith(' ') ? '' : ' ') + suggestion;
    
    setResponses(prev => ({ ...prev, [questionId]: newResponse }));
    saveUserResponse(questionId, newResponse);
  };

  return (
    <div className="space-y-8">
      {pillarData.questions.map((question) => (
        <div key={question.id} className="question-card bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 font-noto-serif">{question.text}</h3>
          
          <div className="response-area">
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Type your response here..."
              className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
            />
            
            {suggestions[question.id] && suggestions[question.id].length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions[question.id].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => addSuggestionToResponse(question.id, suggestion)}
                      className={`px-3 py-1 rounded-md text-sm bg-opacity-20 hover:bg-opacity-30 transition-colors bg-${pillarData.color}`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {loading[question.id] && (
              <p className="text-sm text-gray-500 mt-2">Getting suggestions...</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PillarQuestions;
