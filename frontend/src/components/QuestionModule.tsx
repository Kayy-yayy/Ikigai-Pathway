import React, { useState, useEffect, useRef } from 'react';
import { useSimpleUser } from '../context/SimpleUserContext';
import { FaQuestionCircle } from 'react-icons/fa';

type Question = {
  id: string;
  text: string;
};

type QuestionModuleProps = {
  pillarName: string;
  pillarColor: string;
  questions: Question[];
  onComplete: () => void;
  userId?: string;
  totalQuestions?: number; // Total questions across all pillars
  questionOffset?: number; // Offset for this pillar's questions
};

// Help tooltips for each pillar
const pillarTooltips = {
  passion: {
    default: "Passion is what you love to do. Think about activities that bring you joy and that you'd do even if you weren't paid.",
    examples: ["I love teaching others", "I enjoy creating art", "I feel energized when solving puzzles"]
  },
  profession: {
    default: "Profession is what you're good at. Consider your skills, talents, and areas where you excel.",
    examples: ["I'm skilled at analyzing data", "I excel at public speaking", "I'm good at organizing events"]
  },
  mission: {
    default: "Mission is what the world needs. Think about problems you see in society that you care about solving.",
    examples: ["The world needs more environmental protection", "Communities need better education access", "People need mental health support"]
  },
  vocation: {
    default: "Vocation is what you can be paid for. Consider skills and services that people would compensate you for.",
    examples: ["People would pay me for my design skills", "I could be compensated for my coaching abilities", "My technical expertise is marketable"]
  }
};

const QuestionModule: React.FC<QuestionModuleProps> = ({ 
  pillarName, 
  pillarColor, 
  questions, 
  onComplete,
  userId,
  totalQuestions = 8, // Default to 8 (2 per pillar)
  questionOffset = 0, // Default to 0 (first pillar)
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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

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
      
      // Ensure proper JSON formatting by using JSON.stringify with replacer function
      // to handle any special characters that might cause JSON parsing issues
      const body = JSON.stringify(filteredResponses, (key, value) => {
        // If the value is a string, ensure it's properly escaped
        if (typeof value === 'string') {
          return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        }
        return value;
      });
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = 'Failed to save responses';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the raw error text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
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

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipRef]);

  // Calculate the global question number (across all pillars)
  const globalQuestionNumber = questionOffset + currentQuestionIndex + 1;
  const globalProgressPercentage = Math.round((globalQuestionNumber / totalQuestions) * 100);

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
        <div className="flex items-center mb-2">
          <span className="font-sawarabi text-sm text-gray-600">
            Question {globalQuestionNumber} of {totalQuestions}
          </span>
          <span className="ml-auto font-sawarabi text-sm text-gray-600">
            {globalProgressPercentage}% Complete
          </span>
          <div className="relative ml-3" ref={tooltipRef}>
            <button 
              className="text-gray-500 hover:text-indigo transition-colors duration-300"
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Help"
            >
              <FaQuestionCircle size={20} />
            </button>
            {showTooltip && (
              <div className="absolute z-10 right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-fade-in">
                <h4 className="font-noto text-sm mb-2 text-indigo">About {pillarName}</h4>
                <p className="text-sm mb-2">{pillarTooltips[pillarName.toLowerCase() as keyof typeof pillarTooltips]?.default || "Think about what matters to you in this area."}</p>
                <div className="mt-3">
                  <h5 className="text-xs font-bold mb-1">Examples:</h5>
                  <ul className="text-xs text-gray-600 list-disc pl-4">
                    {pillarTooltips[pillarName.toLowerCase() as keyof typeof pillarTooltips]?.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${pillarColor} h-2 rounded-full transition-all duration-500 ease-in-out`}
            style={{ width: `${globalProgressPercentage}%` }}
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
            <div className="flex flex-col gap-3">
              {responses[currentQuestion.id].map((response, index) => (
                <div 
                  key={index}
                  className={`bg-${pillarColor} bg-opacity-20 rounded-lg px-4 py-3 flex items-center shadow-sm transform transition-all duration-300 hover:shadow-md hover:translate-x-1`}
                >
                  <span className="font-sawarabi">{index + 1}. {response}</span>
                  <button
                    onClick={() => removeResponse(currentQuestion.id, index)}
                    className="ml-auto text-gray-500 hover:text-red-500 transition-colors duration-300"
                    disabled={isSaving}
                    aria-label="Remove response"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* AI Suggestions */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-noto text-sm mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            AI Suggestions:
          </h3>
          {suggestions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestion(suggestion)}
                  className="bg-white hover:bg-gray-100 border border-gray-300 rounded-full px-3 py-1 font-sawarabi text-sm transition duration-300 transform hover:scale-105"
                  disabled={isSaving}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Type in the input field to get AI suggestions</p>
          )}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        {currentQuestionIndex > 0 ? (
          <button
            onClick={handlePrevious}
            className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-sawarabi transition duration-300 hover:bg-gray-300 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSaving}
          >
            Previous
          </button>
        ) : (
          <div></div> // Empty div to maintain layout when button is hidden
        )}
        
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
