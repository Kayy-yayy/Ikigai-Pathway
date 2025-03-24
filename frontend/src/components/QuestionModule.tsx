import React, { useState, useEffect } from 'react';
import { useSimpleUser } from '../context/SimpleUserContext';

type QuestionModuleProps = {
  pillarName: string;
  pillarColor: string;
  questions: {
    id: string;
    text: string;
  }[];
  onComplete: () => void;
  userId?: string;
};

const QuestionModule: React.FC<QuestionModuleProps> = ({ 
  pillarName, 
  pillarColor, 
  questions, 
  onComplete,
  userId 
}) => {
  const { user } = useSimpleUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string[] }>({});
  const [currentInput, setCurrentInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Load existing responses when component mounts
  useEffect(() => {
    if (userId) {
      const loadResponses = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses?user_id=${userId}&pillar=${pillarName}`);
          
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
          
          // Check if all questions have responses
          const allQuestionsAnswered = questions.every(q => 
            loadedResponses[q.id] && loadedResponses[q.id].length > 0
          );
          
          if (allQuestionsAnswered) {
            setIsCompleted(true);
          }
        } catch (err) {
          console.error('Error loading responses:', err);
          setError('Failed to load your previous responses');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadResponses();
    }
  }, [userId, pillarName, questions]);

  // Load suggestions when the current question changes
  useEffect(() => {
    if (currentQuestion) {
      getSuggestions();
    }
  }, [currentQuestionIndex]);

  // Get AI suggestions for the current question
  const getSuggestions = async () => {
    if (!currentQuestion) return;
    
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.text,
          pillar: pillarName,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to get suggestions');
      }
      
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error getting suggestions:', err);
      // Don't show error for suggestions, just silently fail
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the current input as a response
  const addResponse = () => {
    if (!currentInput.trim()) return;
    
    setResponses(prev => {
      const questionId = currentQuestion.id;
      const existingResponses = prev[questionId] || [];
      
      // Don't add duplicates
      if (existingResponses.some(r => r.toLowerCase() === currentInput.trim().toLowerCase())) {
        return prev;
      }
      
      return {
        ...prev,
        [questionId]: [...existingResponses, currentInput.trim()],
      };
    });
    
    setCurrentInput('');
    setError(''); // Clear any errors when user adds a response
  };

  // Remove a response
  const removeResponse = (questionId: string, index: number) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      newResponses[questionId] = newResponses[questionId].filter((_, i) => i !== index);
      return newResponses;
    });
  };

  // Add a suggestion as a response
  const addSuggestion = (suggestion: string) => {
    setResponses(prev => {
      const questionId = currentQuestion.id;
      const existingResponses = prev[questionId] || [];
      
      // Don't add duplicates
      if (existingResponses.some(r => r.toLowerCase() === suggestion.toLowerCase())) {
        return prev;
      }
      
      return {
        ...prev,
        [questionId]: [...existingResponses, suggestion],
      };
    });
    
    setError(''); // Clear any errors when user adds a suggestion
  };

  // Save responses to the server
  const saveResponses = async () => {
    if (!userId) return false;
    
    try {
      setIsSaving(true);
      
      // Format responses for API
      const responsesToSave = Object.entries(responses).map(([questionId, responseArray]) => ({
        user_id: userId,
        question_id: questionId,
        pillar: pillarName,
        response: responseArray.join('|'),
      }));
      
      // Only save questions that have responses
      const filteredResponses = responsesToSave.filter(r => r.response.length > 0);
      
      if (filteredResponses.length === 0) {
        return false;
      }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredResponses),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save responses');
      }
      
      return true;
    } catch (err) {
      console.error('Error saving responses:', err);
      setError(err instanceof Error ? err.message : 'Failed to save your responses');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle moving to the next question
  const handleNext = async () => {
    // Make sure there's at least one response
    if (!responses[currentQuestion.id] || responses[currentQuestion.id].length === 0) {
      setError('Please add at least one response before continuing');
      return;
    }
    
    // Save responses
    const saved = await saveResponses();
    if (!saved) return;
    
    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setError('');
    } else {
      // All questions answered, complete the module
      setIsCompleted(true);
      onComplete();
    }
  };

  // Handle moving to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setError('');
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addResponse();
    }
  };

  // Handle completing the module if already completed
  const handleCompleteAgain = async () => {
    // Save any new responses
    await saveResponses();
    onComplete();
  };

  // If all questions are already answered, show a summary
  if (isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className={`text-xl font-noto text-${pillarColor} mb-4`}>
          You've completed this section!
        </h2>
        
        <div className="mb-6">
          <p className="font-sawarabi text-sumi mb-4">
            Here's a summary of your responses:
          </p>
          
          {questions.map((question, index) => (
            <div key={question.id} className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-noto text-lg mb-2">
                {index + 1}. {question.text}
              </h3>
              
              <ul className="list-disc pl-6">
                {responses[question.id]?.map((response, i) => (
                  <li key={i} className="font-sawarabi mb-1">
                    {response}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setIsCompleted(false)}
            className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-sawarabi py-2 px-6 rounded-md transition duration-300`}
          >
            Edit Responses
          </button>
          
          <button
            onClick={handleCompleteAgain}
            className={`bg-${pillarColor} hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-sawarabi text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="font-sawarabi text-sm text-gray-600">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${pillarColor} h-2 rounded-full`}
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current question */}
      <div className="mb-6">
        <h2 className={`text-xl font-noto text-${pillarColor} mb-4`}>
          {currentQuestion.text}
        </h2>
        
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response here..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo"
            disabled={isSaving}
          />
          
          <button
            onClick={addResponse}
            className={`ml-2 bg-${pillarColor} hover:bg-opacity-90 text-white font-sawarabi py-2 px-4 rounded-md transition duration-300 disabled:opacity-50`}
            disabled={!currentInput.trim() || isSaving}
          >
            Add
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Current responses */}
        {responses[currentQuestion.id] && responses[currentQuestion.id].length > 0 && (
          <div className="mb-6">
            <h3 className="font-noto text-lg mb-2">Your responses:</h3>
            
            <div className="flex flex-wrap gap-2">
              {responses[currentQuestion.id].map((response, index) => (
                <div 
                  key={index}
                  className={`bg-${pillarColor} bg-opacity-20 rounded-full px-3 py-1 flex items-center`}
                >
                  <span className="font-sawarabi text-sm">{response}</span>
                  <button
                    onClick={() => removeResponse(currentQuestion.id, index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    disabled={isSaving}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="font-noto text-lg mb-2">Suggestions:</h3>
            
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestion(suggestion)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 font-sawarabi text-sm transition duration-300"
                  disabled={isSaving}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-sawarabi py-2 px-6 rounded-md transition duration-300 ${
            currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={currentQuestionIndex === 0 || isSaving}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          className={`bg-${pillarColor} hover:bg-opacity-90 text-white font-sawarabi py-2 px-6 rounded-md transition duration-300 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSaving}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="mt-4 flex justify-center">
          <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-${pillarColor}`}></div>
        </div>
      )}
    </div>
  );
};

export default QuestionModule;
