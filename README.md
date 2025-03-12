# Ikigai Pathway

A calming, visually engaging web application that guides users through a self-discovery journey to find their ikigai (life purpose) using AI-guidance. The experience mimics a mindful walk through a Zen garden, blending traditional Japanese aesthetics with playful interactivity.

## Features

- **User Registration**: Sign up with email, username, and avatar selection
- **Four Ikigai Pillars**: Interactive question modules for each pillar of ikigai
  - Passion (What You Love)
  - Mission (What the World Needs)
  - Vocation (What You Are Good At)
  - Profession (What You Can Be Paid For)
- **AI-Powered Suggestions**: As users type answers, the app suggests clarifying words/phrases
- **Personalized Ikigai Chart**: Auto-generated Venn diagram based on user inputs
- **Downloadable Results**: Export your ikigai chart as PNG or PDF
- **Workplace Growth Tips**: Actionable tips tied to your ikigai profile

## Tech Stack

- **Backend**: Python with Flask
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML, CSS, JavaScript
- **AI Integration**: Google Gemini API (placeholder implementation)
- **Data Visualization**: Chart.js for ikigai diagram

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/Ikigai-Pathway.git
cd Ikigai-Pathway
```

2. Create a virtual environment and activate it:
```
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Run the application:
```
python app.py
```

5. Open your browser and navigate to:
```
http://127.0.0.1:5000/
```

## Project Structure

- `app.py`: Main application file with Flask routes and database models
- `templates/`: HTML templates for the web pages
- `static/`: Static assets (CSS, JavaScript, images)
- `requirements.txt`: Python dependencies

## Deployment

The application can be deployed to various platforms:

1. **Heroku**:
   - Create a `Procfile` with: `web: gunicorn app:app`
   - Deploy using the Heroku CLI or GitHub integration

2. **PythonAnywhere**:
   - Upload the code and set up a WSGI configuration
   - Follow their Flask deployment guide

3. **AWS, Azure, or GCP**:
   - Deploy as a containerized application or on a virtual machine

## Future Enhancements

- Full integration with Google Gemini API for more personalized suggestions
- User accounts with saved ikigai profiles
- Social sharing functionality
- Mobile app version
- Expanded growth resources based on ikigai profile

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Inspired by the Japanese concept of Ikigai
- UI design influenced by traditional Japanese aesthetics
