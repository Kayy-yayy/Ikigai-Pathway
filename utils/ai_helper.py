import os
import groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client with error handling
api_key = os.getenv("GROQ_API_KEY")
client = None

if api_key:
    try:
        client = groq.Groq(api_key=api_key)
    except TypeError as e:
        # Handle the 'proxies' parameter error that occurs on Streamlit deployment
        if "unexpected keyword argument 'proxies'" in str(e):
            print("Warning: Groq client initialization failed due to proxies parameter")
            # Fallback to None client, will use fallback suggestions
        else:
            raise
else:
    print("Warning: GROQ_API_KEY not found in environment variables")

def get_ai_suggestions(user_input, category):
    """
    Get AI-powered suggestions based on user input for a specific ikigai category
    
    Args:
        user_input (str): The user's input text
        category (str): The ikigai category (love, good_at, world_needs, paid_for)
        
    Returns:
        list: A list of 3-5 suggested words or phrases
    """
    try:
        # If no API key or client, return fallback suggestions
        if not client:
            return get_fallback_suggestions(category)
            
        # Define prompts based on category
        prompts = {
            "love": f"Based on the user's input: '{user_input}' about what they love, suggest 3-5 clarifying words or phrases that might help them explore this passion more deeply. Format as a simple comma-separated list.",
            "good_at": f"Based on the user's input: '{user_input}' about what they're good at, suggest 3-5 clarifying skills or talents that might be related. Format as a simple comma-separated list.",
            "world_needs": f"Based on the user's input: '{user_input}' about what the world needs, suggest 3-5 clarifying societal needs or problems that might be related. Format as a simple comma-separated list.",
            "paid_for": f"Based on the user's input: '{user_input}' about what they can be paid for, suggest 3-5 clarifying job roles, services, or business opportunities that might be related. Format as a simple comma-separated list."
        }
        
        # Get the appropriate prompt
        prompt = prompts.get(category, "")
        if not prompt:
            return []
        
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides concise, thoughtful suggestions for ikigai self-discovery. Respond with only a comma-separated list of suggestions, no explanations or other text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="deepseek-r1-distill-llama-70b",
            max_tokens=200
        )
        
        # Process the response
        suggestions_text = chat_completion.choices[0].message.content.strip()
        suggestions = [s.strip() for s in suggestions_text.split(",")]
        
        return suggestions[:5]  # Limit to 5 suggestions
        
    except Exception as e:
        print(f"Error getting AI suggestions: {e}")
        return get_fallback_suggestions(category)

def get_fallback_suggestions(category):
    """Provide fallback suggestions when API is unavailable"""
    fallbacks = {
        "love": ["Creative expression", "Learning new skills", "Helping others", "Nature exploration", "Personal growth"],
        "good_at": ["Problem solving", "Communication", "Technical skills", "Leadership", "Creative thinking"],
        "world_needs": ["Environmental solutions", "Mental health support", "Education access", "Community building", "Technological innovation"],
        "paid_for": ["Consulting services", "Product development", "Content creation", "Teaching/coaching", "Project management"]
    }
    return fallbacks.get(category, ["Enter more details"])

def generate_workplace_tips(responses):
    """
    Generate personalized workplace growth tips based on user's ikigai responses
    
    Args:
        responses (dict): Dictionary containing user responses for each ikigai category
        
    Returns:
        list: A list of 5-7 actionable workplace growth tips
    """
    try:
        # If no API key or client, return fallback tips
        if not client:
            return get_fallback_tips()
            
        # Combine all responses into a single text
        all_responses = ""
        for category, items in responses.items():
            all_responses += f"{category.replace('_', ' ').title()}: {', '.join(items)}\n"
        
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a career coach specializing in ikigai-based workplace development. Provide 5-7 specific, actionable tips for professional growth based on the user's ikigai responses. Each tip should be 1-2 sentences, practical, and directly tied to their responses. Format as a numbered list with no additional text."
                },
                {
                    "role": "user",
                    "content": f"Based on the following ikigai responses, provide 5-7 actionable workplace growth tips:\n\n{all_responses}"
                }
            ],
            model="deepseek-r1-distill-llama-70b",
            max_tokens=500
        )
        
        # Process the response
        tips_text = chat_completion.choices[0].message.content.strip()
        
        # Split into individual tips
        tips = []
        for line in tips_text.split("\n"):
            line = line.strip()
            if line and any(line.startswith(f"{i}.") for i in range(1, 10)):
                # Remove the number prefix
                tip = line[line.find(".")+1:].strip()
                tips.append(tip)
        
        return tips
        
    except Exception as e:
        print(f"Error generating workplace tips: {e}")
        return get_fallback_tips()

def get_fallback_tips():
    """Provide fallback tips when API is unavailable"""
    return [
        "Focus on projects that align with your passions and strengths to increase job satisfaction and performance.",
        "Develop your core strengths through continuous learning and seek feedback from trusted colleagues.",
        "Look for opportunities to address societal needs in your work to create meaningful impact.",
        "Find ways to monetize your unique skills and interests through side projects or career pivots.",
        "Build a network with people who share your values but bring different skills to the table.",
        "Set aside time each week for reflection on how your work aligns with your ikigai elements.",
        "Create a personal development plan that balances all four aspects of your ikigai."
    ]
