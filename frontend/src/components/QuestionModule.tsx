import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

type QuestionModuleProps = {
  pillar: string;
  questions: {
    id: string;
    text: string;
  }[];
  onComplete: () => void;
};

const QuestionModule: React.FC<QuestionModuleProps> = ({ pillar, questions, onComplete }) => {
  const { user } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string[] }>({});
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Load existing responses when component mounts
  useEffect(() => {
    if (user) {
      const loadResponses = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses?user_id=${user.id}&pillar=${pillar}`);
          
          if (!res.ok) {
            throw new Error('Failed to load responses');
          }
          
          const data = await res.json();
          
          // Transform API response to our format
          const loadedResponses: { [key: string]: string[] } = {};
          data.forEach((item: any) => {
            loadedResponses[item.question_id] = item.response.split('|');
          });
          
          setResponses(loadedResponses);
        } catch (err) {
          console.error('Error loading responses:', err);
          setError('Failed to load your previous responses');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadResponses();
    }
  }, [user, pillar]);

  // Get AI suggestions as user types
  useEffect(() => {
    if (!currentInput || currentInput.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/suggestions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: currentInput,
            pillar: pillar,
          }),
        });
        
        if (!res.ok) {
          throw new Error('Failed to get suggestions');
        }
        
        const data = await res.json();
        setSuggestions(data.suggestions);
      } catch (err) {
        console.error('Error getting suggestions:', err);
        // Silently fail for suggestions
        setSuggestions([]);
      }
    }, 500); // Debounce
    
    return () => clearTimeout(timer);
  }, [currentInput, pillar]);

  const handleAddResponse = () => {
    if (!currentInput.trim()) return;
    
    // Update responses state
    setResponses(prev => {
      const questionId = currentQuestion.id;
      const existingResponses = prev[questionId] || [];
      const newResponses = [...existingResponses, currentInput.trim()];
      
      // Limit to 5 responses
      if (newResponses.length > 5) {
        newResponses.shift();
      }
      
      return {
        ...prev,
        [questionId]: newResponses,
      };
    });
    
    setCurrentInput('');
    setSuggestions([]);
  };

  const handleRemoveResponse = (questionId: string, index: number) => {
    setResponses(prev => {
      const newResponses = [...(prev[questionId] || [])];
      newResponses.splice(index, 1);
      return {
        ...prev,
        [questionId]: newResponses,
      };
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    setSuggestions([]);
  };

  const handleNext = async () => {
    // Save current question responses
    if (user && responses[currentQuestion.id]?.length > 0) {
      try {
        setIsSaving(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            pillar: pillar,
            question_id: currentQuestion.id,
            response: responses[currentQuestion.id].join('|'),
          }),
        });
        
        if (!res.ok) {
          throw new Error('Failed to save responses');
        }
      } catch (err) {
        console.error('Error saving responses:', err);
        setError('Failed to save your responses');
        return;
      } finally {
        setIsSaving(false);
      }
    }
    
    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo">
            {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
          </span>
        </div>
        
        <h2 className="font-noto text-xl text-sumi mb-6">
          {currentQuestion.text}
        </h2>
        
        <div className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo"
            />
            <button
              onClick={handleAddResponse}
              className="bg-bamboo text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition duration-300"
              disabled={!currentInput.trim()}
            >
              Add
            </button>
          </div>
          
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-indigo bg-opacity-10 text-indigo text-sm px-3 py-1 rounded-full hover:bg-opacity-20 transition duration-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Current Responses */}
        <div className="mb-6">
          <h3 className="font-sawarabi text-sm text-gray-500 mb-2">
            Your Answers (3-5 recommended):
          </h3>
          
          {responses[currentQuestion.id]?.length > 0 ? (
            <ul className="space-y-2">
              {responses[currentQuestion.id].map((response, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-softWhite p-3 rounded-md"
                >
                  <span className="font-sawarabi">{response}</span>
                  <button
                    onClick={() => handleRemoveResponse(currentQuestion.id, index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove response"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No answers yet</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo text-white hover:bg-opacity-90'
          } transition duration-300`}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={isSaving}
          className="bg-bamboo text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
        >
          {isSaving
            ? 'Saving...'
            : currentQuestionIndex === questions.length - 1
            ? 'Complete'
            : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default QuestionModule;
