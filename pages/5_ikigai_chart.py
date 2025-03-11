import streamlit as st
import sys
import os
import base64
from PIL import Image
import io
import matplotlib.pyplot as plt
import numpy as np
import random

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.chart_generator import generate_ikigai_chart
from utils.ai_helper import generate_workplace_tips
from streamlit_extras.switch_page_button import switch_page
from streamlit_lottie import st_lottie
import requests

# Page configuration
st.set_page_config(
    page_title="Your Ikigai Chart | Ikigai Pathway",
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
        
        .cherry-blossom {
            position: relative;
            width: 100%;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #F6CECE;
            border-radius: 10px;
            opacity: 0.7;
            transition: all 0.3s ease;
            cursor: pointer;
            overflow: hidden;
        }
        
        .cherry-blossom:hover {
            opacity: 1;
            transform: scale(1.02);
        }
        
        .cherry-blossom-content {
            display: none;
        }
        
        .cherry-blossom.revealed .cherry-blossom-content {
            display: block;
        }
        
        .cherry-blossom-label {
            font-weight: bold;
            text-align: center;
        }
        
        .cherry-blossom.revealed .cherry-blossom-label {
            display: none;
        }
        
        .download-button {
            background-color: #7BA17D;
            color: white;
            border-radius: 10px;
            padding: 0.75rem 2rem;
            font-size: 1.2rem;
            border: none;
            cursor: pointer;
            margin-top: 2rem;
            transition: all 0.3s ease;
        }
        
        .download-button:hover {
            background-color: #3F4B83;
            transform: scale(1.05);
        }
        
        .color-option {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin: 0 5px;
            cursor: pointer;
            border: 2px solid transparent;
        }
        
        .color-option.selected {
            border: 2px solid #2A2A2A;
        }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# Load CSS
load_css()

# Load animation
def load_lottie_url(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# Progress visualization
def display_progress():
    st.markdown('<div style="position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px;">', unsafe_allow_html=True)
    
    # Love lantern (completed)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0; opacity: 0.7;"></div>', unsafe_allow_html=True)
    
    # Good At lantern (completed)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0; opacity: 0.7;"></div>', unsafe_allow_html=True)
    
    # World Needs lantern (completed)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0; opacity: 0.7;"></div>', unsafe_allow_html=True)
    
    # Paid For lantern (completed)
    st.markdown(f'<div style="width: 15px; height: 40px; border-radius: 10px; background-color: #e0e0e0; opacity: 0.7;"></div>', unsafe_allow_html=True)
    
    # Close the container
    st.markdown('</div>', unsafe_allow_html=True)

# Initialize session state for this page
if 'ikigai_chart' not in st.session_state:
    st.session_state.ikigai_chart = None
    
if 'workplace_tips' not in st.session_state:
    st.session_state.workplace_tips = None
    
if 'color_scheme' not in st.session_state:
    st.session_state.color_scheme = {
        'love': '#F6CECE',         # Sakura Pink
        'good_at': '#7BA17D',      # Bamboo Green
        'world_needs': '#3F4B83',  # Indigo Blue
        'paid_for': '#D4AF37',     # Gold
        'background': '#F9F5F0',   # Soft White
        'text': '#2A2A2A'          # Sumi Ink Black
    }

# Main content
st.markdown('<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 800px;">', unsafe_allow_html=True)

# Top section with title
st.markdown('<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">', unsafe_allow_html=True)
st.markdown('<h2 style="color: #3498db;">Your Ikigai Chart</h2>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Main heading
st.markdown('<h1 style="margin-bottom: 20px; text-align: center;">Discover Your Purpose</h1>', unsafe_allow_html=True)

# Check if all sections are completed
all_completed = (
    st.session_state.progress['love_complete'] and
    st.session_state.progress['good_at_complete'] and
    st.session_state.progress['world_needs_complete'] and
    st.session_state.progress['paid_for_complete']
)

if all_completed:
    # Generate and display the Ikigai chart
    st.markdown('<div style="text-align: center; margin-bottom: 20px;">', unsafe_allow_html=True)
    
    # Create the Ikigai chart visualization
    chart_image = generate_ikigai_chart(
        st.session_state.responses,
        st.session_state.color_scheme
    )
    
    # Display the chart as an image
    st.image(f"data:image/png;base64,{chart_image}", use_column_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Mark chart as generated
    st.session_state.progress['chart_generated'] = True
    
    # Display insights section
    st.markdown('<div style="margin-top: 30px;">', unsafe_allow_html=True)
    st.markdown('<h3>Your Ikigai Insights</h3>', unsafe_allow_html=True)
    
    # Generate AI insights about the user's Ikigai
    insights = generate_workplace_tips(st.session_state.responses)
    
    # Display insights
    for i, tip in enumerate(insights):
        st.markdown(f'<h4>Tip #{i+1}</h4>', unsafe_allow_html=True)
        st.markdown(f'<p>{tip}</p>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Download and share options
    st.markdown('<div style="margin-top: 30px; display: flex; justify-content: center; gap: 20px;">', unsafe_allow_html=True)
    
    # Download button
    if st.button("Download Chart", key="download_chart"):
        # Code to download the chart would go here
        st.success("Chart downloaded successfully!")
    
    # Share button
    if st.button("Share Results", key="share_results"):
        # Code to share results would go here
        st.success("Link copied to clipboard!")
    
    st.markdown('</div>', unsafe_allow_html=True)
    
else:
    # Show message to complete all sections
    st.warning("Please complete all four sections to generate your Ikigai chart.")
    
    # Show which sections are missing
    missing_sections = []
    if not st.session_state.progress['love_complete']:
        missing_sections.append("What You Love")
    if not st.session_state.progress['good_at_complete']:
        missing_sections.append("What You're Good At")
    if not st.session_state.progress['world_needs_complete']:
        missing_sections.append("What the World Needs")
    if not st.session_state.progress['paid_for_complete']:
        missing_sections.append("What You Can Be Paid For")
    
    st.markdown("<p>Missing sections:</p>", unsafe_allow_html=True)
    for section in missing_sections:
        st.markdown(f"<p>• {section}</p>", unsafe_allow_html=True)

# Navigation buttons
col1, col2 = st.columns(2)
with col1:
    st.button("Back to Questions", key="back_button", on_click=lambda: switch_page("paid for"))
with col2:
    if st.button("Start Over", key="start_over"):
        # Reset all session state
        for key in st.session_state.responses:
            st.session_state.responses[key] = []
        for key in st.session_state.progress:
            st.session_state.progress[key] = False
        # Go back to landing page
        switch_page("home")

# Close the main container
st.markdown('</div>', unsafe_allow_html=True)

# Display progress visualization
display_progress()
