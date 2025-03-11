import streamlit as st
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ai_helper import get_ai_suggestions
from streamlit_extras.switch_page_button import switch_page

# Page configuration
st.set_page_config(
    page_title="What You're Good At | Ikigai Pathway",
    page_icon="🏮",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS
def load_css():
    css = """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Sawarabi+Mincho&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Sawarabi Mincho', serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Noto Serif JP', serif;
        }
        
        .sakura-pink {
            color: #F6CECE;
        }
        
        .bamboo-green {
            color: #7BA17D;
        }
        
        .indigo-blue {
            color: #3F4B83;
        }
        
        .sumi-black {
            color: #2A2A2A;
        }
        
        .gold-accent {
            color: #D4AF37;
        }
        
        .soft-bg {
            background-color: #F9F5F0;
        }
        
        .main-header {
            text-align: center;
            font-size: 3rem;
            color: #2A2A2A;
            margin-bottom: 2rem;
        }
        
        .centered-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .progress-container {
            margin: 2rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;
        }
        
        .lantern {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #D4AF37;
            opacity: 0.3;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .lantern.lit {
            opacity: 1;
            box-shadow: 0 0 15px #D4AF37;
        }
        
        .torii-path {
            height: 5px;
            background-color: #3F4B83;
            flex-grow: 1;
            margin: 0 10px;
        }
        
        .suggestion-pill {
            display: inline-block;
            background-color: #7BA17D;
            color: #2A2A2A;
            padding: 5px 10px;
            border-radius: 20px;
            margin: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .suggestion-pill:hover {
            background-color: #3F4B83;
            color: white;
        }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# Load CSS
load_css()

# Initialize session state for this page
if 'good_at_inputs' not in st.session_state:
    st.session_state.good_at_inputs = [""] * 5  # 5 input fields
    
if 'good_at_suggestions' not in st.session_state:
    st.session_state.good_at_suggestions = [[] for _ in range(5)]  # Suggestions for each input

# Progress visualization
def display_progress():
    # Create a container with proper styling
    st.markdown('<div style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px;">', unsafe_allow_html=True)
    
    # Love lantern (completed)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0; opacity: 0.7;"></div>', unsafe_allow_html=True)
    
    # Good At lantern (highlighted/active)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #3498db; box-shadow: 0 0 10px #3498db;"></div>', unsafe_allow_html=True)
    
    # World Needs lantern (inactive)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0;"></div>', unsafe_allow_html=True)
    
    # Paid For lantern (inactive)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0;"></div>', unsafe_allow_html=True)
    
    # Close the container
    st.markdown('</div>', unsafe_allow_html=True)

# Main content
st.markdown('<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 800px;">', unsafe_allow_html=True)

# Top section with question number and Ikigai Chart link
st.markdown('<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">', unsafe_allow_html=True)
st.markdown('<h2 style="color: #3498db;">Question 2</h2>', unsafe_allow_html=True)
st.markdown('<a href="#" style="color: #3498db; text-decoration: underline;">Ikigai Chart</a>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Main question
st.markdown('<h1 style="margin-bottom: 20px;">What are you GOOD AT?</h1>', unsafe_allow_html=True)

# User input section
st.markdown('<p style="margin-bottom: 10px;">List skills, talents, or abilities that you excel at or have developed:</p>', unsafe_allow_html=True)

# Text area for user input
user_input = st.text_area("Your skills", key="good_at_input", height=150)

# Background image/decoration
st.markdown('<div style="height: 150px; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; margin: 20px 0;"><span style="color: #888;">Background Image</span></div>', unsafe_allow_html=True)

# AI suggestions section
st.markdown('<div style="margin-top: 20px;">', unsafe_allow_html=True)
st.markdown('<h3>AI Suggestions</h3>', unsafe_allow_html=True)

if st.button("Get Suggestions", key="get_suggestions"):
    if user_input:
        with st.spinner("Generating suggestions..."):
            suggestions = get_ai_suggestions(user_input, "good_at")
            if suggestions:
                for i, suggestion in enumerate(suggestions):
                    st.markdown(f"- {suggestion}")
            else:
                st.error("Unable to generate suggestions. Please try again.")
    else:
        st.warning("Please enter some text to get suggestions.")

st.markdown('</div>', unsafe_allow_html=True)

# Navigation buttons
col1, col2 = st.columns(2)
with col1:
    st.button("Back", key="back_button", on_click=lambda: switch_page("love"))
with col2:
    if st.button("Next", key="next_button"):
        # Save responses
        if user_input:
            st.session_state.responses['good_at'] = [item.strip() for item in user_input.split('\n') if item.strip()]
            st.session_state.progress['good_at_complete'] = True
            switch_page("world needs")
        else:
            st.warning("Please enter at least one thing you're good at before proceeding.")

# Close the main container
st.markdown('</div>', unsafe_allow_html=True)

# Display progress visualization
display_progress()
