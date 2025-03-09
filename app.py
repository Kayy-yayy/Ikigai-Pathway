import streamlit as st
import os
from dotenv import load_dotenv
import json
import base64
from PIL import Image
import io
import matplotlib.pyplot as plt
import numpy as np
from streamlit_extras.switch_page_button import switch_page
from streamlit_lottie import st_lottie
import requests
from utils.media_helper import set_background_image, add_background_overlay, play_audio, get_audio_base64

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Ikigai Pathway",
    page_icon="🏮",
    layout="wide",
    initial_sidebar_state="hidden"
)

# Hide the sidebar and default Streamlit elements
hide_streamlit_style = """
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}
.stDeployButton {display:none;}
.css-1rs6os {visibility: hidden;}
.css-17ziqus {visibility: hidden;}
.css-1dp5vir {visibility: hidden;}
div[data-testid="stSidebarNav"] {display: none;}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Set background image if available
bg_image_path = os.path.join("assets", "images", "zen_garden_bg.png")
if os.path.exists(bg_image_path):
    set_background_image(bg_image_path)
    # Add a semi-transparent overlay for better text readability
    add_background_overlay(opacity=0.8)

# Initialize session state
if 'progress' not in st.session_state:
    st.session_state.progress = {
        'landing_complete': False,
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
        
        .haiku {
            font-style: italic;
            text-align: center;
            margin: 2rem 0;
            font-size: 1.2rem;
        }
        
        .centered-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .ema-button {
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
        
        .ema-button:hover {
            background-color: #3F4B83;
            transform: scale(1.05);
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
        
        /* Content container with semi-transparent background */
        .content-container {
            background-color: rgba(249, 245, 240, 0.85);
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 1rem 0;
        }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# Load animation
def load_lottie_url(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# Progress visualization
def display_progress():
    # Create a container with proper styling
    st.markdown('<div class="progress-container" style="margin: 20px auto; display: flex; justify-content: center; align-items: center; width: 80%; max-width: 800px;">', unsafe_allow_html=True)
    
    # Landing lantern
    lantern_class = "lantern lit" if st.session_state.progress['landing_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["landing_complete"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["landing_complete"] else "none"};">1</div>', unsafe_allow_html=True)
    
    # Path to Love
    st.markdown('<div class="torii-path" style="height: 3px; background-color: #3F4B83; flex-grow: 1; margin: 0 10px;"></div>', unsafe_allow_html=True)
    
    # Love lantern
    lantern_class = "lantern lit" if st.session_state.progress['love_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["love_complete"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["love_complete"] else "none"};">2</div>', unsafe_allow_html=True)
    
    # Path to Good At
    st.markdown('<div class="torii-path" style="height: 3px; background-color: #3F4B83; flex-grow: 1; margin: 0 10px;"></div>', unsafe_allow_html=True)
    
    # Good At lantern
    lantern_class = "lantern lit" if st.session_state.progress['good_at_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["good_at_complete"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["good_at_complete"] else "none"};">3</div>', unsafe_allow_html=True)
    
    # Path to World Needs
    st.markdown('<div class="torii-path" style="height: 3px; background-color: #3F4B83; flex-grow: 1; margin: 0 10px;"></div>', unsafe_allow_html=True)
    
    # World Needs lantern
    lantern_class = "lantern lit" if st.session_state.progress['world_needs_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["world_needs_complete"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["world_needs_complete"] else "none"};">4</div>', unsafe_allow_html=True)
    
    # Path to Paid For
    st.markdown('<div class="torii-path" style="height: 3px; background-color: #3F4B83; flex-grow: 1; margin: 0 10px;"></div>', unsafe_allow_html=True)
    
    # Paid For lantern
    lantern_class = "lantern lit" if st.session_state.progress['paid_for_complete'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["paid_for_complete"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["paid_for_complete"] else "none"};">5</div>', unsafe_allow_html=True)
    
    # Path to Chart
    st.markdown('<div class="torii-path" style="height: 3px; background-color: #3F4B83; flex-grow: 1; margin: 0 10px;"></div>', unsafe_allow_html=True)
    
    # Chart lantern
    lantern_class = "lantern lit" if st.session_state.progress['chart_generated'] else "lantern"
    st.markdown(f'<div class="{lantern_class}" style="width: 40px; height: 40px; border-radius: 50%; background-color: #D4AF37; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; opacity: {1 if st.session_state.progress["chart_generated"] else 0.3}; box-shadow: {" 0 0 15px #D4AF37" if st.session_state.progress["chart_generated"] else "none"};">6</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

# Load CSS
load_css()

# Play background music if available
bg_music_path = os.path.join("assets", "sounds", "zen_background.mp3")
if os.path.exists(bg_music_path) and 'bg_music_played' not in st.session_state:
    bg_music = get_audio_base64(bg_music_path)
    if bg_music:
        play_audio(bg_music)
        st.session_state.bg_music_played = True

# Landing page content
def landing_page():
    # Create a container with proper styling for the main content
    st.markdown('<div class="content-container" style="background-color: rgba(249, 245, 240, 0.85); padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 1rem auto; max-width: 800px;">', unsafe_allow_html=True)
    
    # Main header
    st.markdown('<h1 style="text-align: center; font-size: 3rem; color: #2A2A2A; margin-bottom: 2rem; font-family: \'Noto Serif JP\', serif;">Ikigai Pathway</h1>', unsafe_allow_html=True)
    
    # Hero section with animation
    zen_animation = load_lottie_url("https://assets1.lottiefiles.com/packages/lf20_jR229r.json")
    if zen_animation:
        st_lottie(zen_animation, height=300, key="zen")
    else:
        # Fallback if animation doesn't load
        st.image(os.path.join("assets", "images", "zen_garden_bg.png"), width=300)
    
    # Welcome text
    st.markdown(
        """
        <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 1.2rem;">Welcome to your journey of self-discovery through the ancient Japanese concept of Ikigai.</p>
            <p style="font-size: 1.2rem;">Find where your passion, mission, vocation, and profession intersect to reveal your life's purpose.</p>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    # Haiku style explanation
    st.markdown(
        """
        <div style="font-style: italic; text-align: center; margin: 2rem 0; font-size: 1.2rem;">
            <p>What brings you joy? <span style="color: #F6CECE;">❀ What you love</span></p>
            <p>Skills honed through time and practice <span style="color: #7BA17D;">❀ What you're good at</span></p>
            <p>Service to others <span style="color: #3F4B83;">❀ What the world needs</span></p>
            <p>Value exchanged <span style="color: #2A2A2A;">❀ What you can be paid for</span></p>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    # Start journey button
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("Begin Your Ikigai Journey", key="start_journey", 
                    help="Click to start your Ikigai journey",
                    use_container_width=True):
            # Play water rippling sound if available
            water_sound_path = os.path.join("assets", "sounds", "water_ripple.mp3")
            if os.path.exists(water_sound_path):
                water_sound = get_audio_base64(water_sound_path)
                if water_sound:
                    play_audio(water_sound)
            
            st.session_state.progress['landing_complete'] = True
            switch_page("love")
    
    # Display Ema plaque image if available
    ema_image_path = os.path.join("assets", "images", "ema_plaque.png")
    if os.path.exists(ema_image_path):
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.image(ema_image_path, width=250)
    
    st.markdown('</div>', unsafe_allow_html=True)

# Main app logic
if __name__ == "__main__":
    # Display progress
    display_progress()
    
    # Show landing page
    landing_page()
