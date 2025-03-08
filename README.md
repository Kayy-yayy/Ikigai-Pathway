# Ikigai Pathway

## Overview
Ikigai Pathway is a calming, visually engaging web application that guides users through a self-discovery journey to find their ikigai (life purpose) using AI-guidance. The experience mimics a mindful walk through a Zen garden, blending traditional Japanese aesthetics with playful interactivity.

## Features
- **Interactive Journey**: Navigate through the four pillars of ikigai in a serene Japanese-inspired interface
- **AI-Powered Suggestions**: Receive personalized suggestions as you answer questions using Groq API
- **Personalized Ikigai Chart**: Generate and download your own ikigai diagram
- **Workplace Growth Tips**: Unlock actionable insights based on your responses
- **Progress Visualization**: Track your journey with a torii gate pathway and lit lanterns

## Installation
1. Clone this repository
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```
   streamlit run app.py
   ```

## Structure
- `app.py`: Main Streamlit application
- `pages/`: Individual pages for the application
- `utils/`: Utility functions and helpers
- `assets/`: Images, sounds, and other static assets
- `styles/`: CSS styles for customizing the application

## Technologies Used
- Python
- Streamlit
- Groq API for AI suggestions
- Matplotlib for chart generation
- Streamlit extras for enhanced UI components

## License
MIT
