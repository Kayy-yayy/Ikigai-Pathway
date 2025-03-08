import streamlit as st
import os
import sys
from streamlit_extras.switch_page_button import switch_page

# Add parent directory to path to import from utils
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from utils.ai_helper import get_ai_suggestions
from utils.media_helper import play_audio, get_audio_base64, add_background_overlay

# Page configuration
st.set_page_config(
    page_title="What You Love | Ikigai Pathway",
    page_icon="🏮",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Add overlay for better text readability with background image
add_background_overlay(opacity=0.8)

# Initialize session state
if 'progress' not in st.session_state:
    st.session_state.progress = {
        'landing_complete': True,  # Assume we came from landing
        'love_complete': False,
        'good_at_complete': False,
        'world_needs_complete': False,
        'paid_for_complete': False,
        'chart_generated': False
    }

if 'responses' not in st.session_state:
    st.session_state.responses = {
        'love': [],
        'good_at': [],
        'world_needs': [],
        'paid_for': []
    }

# Progress visualization
def display_progress():
    st.markdown('<div class="progress-container">', unsafe_allow_html=True)
    
    # Landing lantern
    lantern_class = "lantern lit" if st.session_state.progress['landing_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">1</div>', unsafe_allow_html=True)
    
    # Path to Love
    st.markdown('<div class="torii-path"></div>', unsafe_allow_html=True)
    
    # Love lantern
    lantern_class = "lantern lit" if st.session_state.progress['love_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">2</div>', unsafe_allow_html=True)
    
    # Path to Good At
    st.markdown('<div class="torii-path"></div>', unsafe_allow_html=True)
    
    # Good At lantern
    lantern_class = "lantern lit" if st.session_state.progress['good_at_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">3</div>', unsafe_allow_html=True)
    
    # Path to World Needs
    st.markdown('<div class="torii-path"></div>', unsafe_allow_html=True)
    
    # World Needs lantern
    lantern_class = "lantern lit" if st.session_state.progress['world_needs_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">4</div>', unsafe_allow_html=True)
    
    # Path to Paid For
    st.markdown('<div class="torii-path"></div>', unsafe_allow_html=True)
    
    # Paid For lantern
    lantern_class = "lantern lit" if st.session_state.progress['paid_for_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">5</div>', unsafe_allow_html=True)
    
    # Path to Chart
    st.markdown('<div class="torii-path"></div>', unsafe_allow_html=True)
    
    # Chart lantern
    lantern_class = "lantern lit" if st.session_state.progress['chart_generated'] else "lantern"
    st.markdown(f'<div class="{lantern_class}">6</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

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
        
        .main-header {
            text-align: center;
            font-size: 2.5rem;
            color: #2A2A2A;
            margin-bottom: 2rem;
        }
        
        .sub-header {
            text-align: center;
            font-size: 1.5rem;
            color: #3F4B83;
            margin-bottom: 1.5rem;
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
        
        .content-container {
            background-color: rgba(249, 245, 240, 0.85);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 1rem 0;
        }
        
        .tag-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        
        .tag {
            background-color: #F6CECE;
            color: #2A2A2A;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .tag:hover {
            background-color: #7BA17D;
            color: white;
            transform: scale(1.05);
        }
        
        .tag.selected {
            background-color: #3F4B83;
            color: white;
        }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# Load CSS
load_css()

# Display progress
display_progress()

# Main content
st.markdown('<div class="content-container">', unsafe_allow_html=True)
st.markdown('<h1 class="main-header">What You <span class="sakura-pink">Love</span></h1>', unsafe_allow_html=True)
st.markdown('<h2 class="sub-header">Passion • Joy • Fulfillment</h2>', unsafe_allow_html=True)

st.markdown(
    """
    <div class="centered-content">
        <p>What activities make you lose track of time? What would you do even if you weren't paid?</p>
        <p>Reflect on what brings you joy and fulfillment, regardless of skill level or practicality.</p>
    </div>
    """, 
    unsafe_allow_html=True
)

# User input
user_input = st.text_area("Describe what you love to do:", height=150)

# Get AI suggestions when input is provided
if user_input and st.button("Generate Insights"):
    with st.spinner("Reflecting on your passions..."):
        suggestions = get_ai_suggestions(user_input, "love")
        
        if suggestions:
            st.markdown('<div class="tag-container">', unsafe_allow_html=True)
            for suggestion in suggestions:
                st.markdown(f'<div class="tag">{suggestion}</div>', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Store selected items
            if 'selected_love' not in st.session_state:
                st.session_state.selected_love = []
                
            # Allow user to select items
            selected = st.multiselect(
                "Select the items that resonate with you:",
                suggestions,
                default=st.session_state.selected_love
            )
            
            st.session_state.selected_love = selected
            
            # Update responses when selections are made
            if selected:
                st.session_state.responses['love'] = selected
        else:
            st.error("Unable to generate insights. Please try again or enter more details.")

# Navigation buttons
col1, col2 = st.columns(2)

with col1:
    if st.button("← Back to Home"):
        switch_page("app")

with col2:
    if st.button("Continue to What You're Good At →"):
        # Play bell sound for transition if available
        bell_sound_path = os.path.join("assets", "sounds", "bell.mp3")
        if os.path.exists(bell_sound_path):
            bell_sound = get_audio_base64(bell_sound_path)
            if bell_sound:
                play_audio(bell_sound)
        
        # Mark this page as complete
        st.session_state.progress['love_complete'] = True
        
        # Navigate to next page
        switch_page("2_good_at")

st.markdown('</div>', unsafe_allow_html=True)
