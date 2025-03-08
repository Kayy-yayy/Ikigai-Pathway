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
st.markdown('<h1 class="main-header">Your Ikigai Chart</h1>', unsafe_allow_html=True)

# Display progress
display_progress()

# Generate chart if not already generated
if not st.session_state.ikigai_chart:
    with st.spinner("Generating your personalized Ikigai chart..."):
        st.session_state.ikigai_chart = generate_ikigai_chart(st.session_state.responses, st.session_state.color_scheme)
        st.session_state.progress['chart_generated'] = True

# Generate workplace tips if not already generated
if not st.session_state.workplace_tips:
    with st.spinner("Generating your workplace growth tips..."):
        st.session_state.workplace_tips = generate_workplace_tips(st.session_state.responses)

# Display the chart
st.markdown('<div class="centered-content">', unsafe_allow_html=True)
st.markdown("### Your personalized Ikigai diagram")
st.markdown("</div>", unsafe_allow_html=True)

# Color customization
st.markdown("#### Customize your chart colors")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown("Love circle")
    color_options = ['#F6CECE', '#FF9999', '#FFB6C1', '#FFC0CB', '#DB7093']
    for color in color_options:
        selected = "selected" if color == st.session_state.color_scheme['love'] else ""
        st.markdown(f'<div class="color-option {selected}" style="background-color: {color};" onclick="updateColorScheme(\'love\', \'{color}\')"></div>', unsafe_allow_html=True)

with col2:
    st.markdown("Good at circle")
    color_options = ['#7BA17D', '#90EE90', '#98FB98', '#8FBC8F', '#3CB371']
    for color in color_options:
        selected = "selected" if color == st.session_state.color_scheme['good_at'] else ""
        st.markdown(f'<div class="color-option {selected}" style="background-color: {color};" onclick="updateColorScheme(\'good_at\', \'{color}\')"></div>', unsafe_allow_html=True)

with col3:
    st.markdown("World needs circle")
    color_options = ['#3F4B83', '#6495ED', '#4682B4', '#5F9EA0', '#4169E1']
    for color in color_options:
        selected = "selected" if color == st.session_state.color_scheme['world_needs'] else ""
        st.markdown(f'<div class="color-option {selected}" style="background-color: {color};" onclick="updateColorScheme(\'world_needs\', \'{color}\')"></div>', unsafe_allow_html=True)

with col4:
    st.markdown("Paid for circle")
    color_options = ['#D4AF37', '#FFD700', '#DAA520', '#F0E68C', '#BDB76B']
    for color in color_options:
        selected = "selected" if color == st.session_state.color_scheme['paid_for'] else ""
        st.markdown(f'<div class="color-option {selected}" style="background-color: {color};" onclick="updateColorScheme(\'paid_for\', \'{color}\')"></div>', unsafe_allow_html=True)

# Button to regenerate chart with new colors
if st.button("Update Chart Colors"):
    st.session_state.ikigai_chart = generate_ikigai_chart(st.session_state.responses, st.session_state.color_scheme)
    st.experimental_rerun()

# Display the chart image
st.image(f"data:image/png;base64,{st.session_state.ikigai_chart}", use_column_width=True)

# Download button
def get_image_download_link(img_str, filename="ikigai_chart.png", text="Download Your Ikigai Chart"):
    href = f'<a href="data:image/png;base64,{img_str}" download="{filename}" class="download-button">{text}</a>'
    return href

st.markdown(get_image_download_link(st.session_state.ikigai_chart), unsafe_allow_html=True)

# Workplace Growth Tips
st.markdown('<h2 class="main-header">Your Workplace Growth Tips</h2>', unsafe_allow_html=True)

st.markdown(
    """
    <div class="centered-content">
        <p>Click on each cherry blossom to reveal personalized workplace growth tips based on your ikigai.</p>
    </div>
    """, 
    unsafe_allow_html=True
)

# Display tips as cherry blossoms
if st.session_state.workplace_tips:
    col1, col2 = st.columns(2)
    
    for i, tip in enumerate(st.session_state.workplace_tips):
        # Alternate between columns
        with col1 if i % 2 == 0 else col2:
            # Create a unique key for each tip
            tip_key = f"tip_{i}"
            
            # Check if this tip has been revealed
            if f"revealed_{tip_key}" not in st.session_state:
                st.session_state[f"revealed_{tip_key}"] = False
            
            # Create the cherry blossom element
            blossom_class = "cherry-blossom revealed" if st.session_state[f"revealed_{tip_key}"] else "cherry-blossom"
            
            # Create a clickable div
            st.markdown(f"""
            <div class="{blossom_class}" id="{tip_key}" onclick="revealTip('{tip_key}')">
                <div class="cherry-blossom-label">Click to reveal tip #{i+1}</div>
                <div class="cherry-blossom-content">{tip}</div>
            </div>
            """, unsafe_allow_html=True)
            
            # Add a button to reveal the tip (this is a workaround since the onclick in HTML won't work directly in Streamlit)
            if not st.session_state[f"revealed_{tip_key}"]:
                if st.button(f"Reveal Tip #{i+1}", key=f"reveal_button_{i}"):
                    st.session_state[f"revealed_{tip_key}"] = True
                    st.experimental_rerun()

# Navigation buttons
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    if st.button("← Start Over", key="start_over"):
        # Reset session state
        for key in st.session_state.progress:
            st.session_state.progress[key] = False
            
        for key in st.session_state.responses:
            st.session_state.responses[key] = []
            
        st.session_state.ikigai_chart = None
        st.session_state.workplace_tips = None
        
        # Redirect to landing page
        switch_page("app")

# JavaScript for handling color selection and tip reveals
st.markdown("""
<script>
function updateColorScheme(category, color) {
    // This is a placeholder - in a real app, we'd use AJAX to update the server-side state
    // For now, we'll just update the UI to show selection
    const elements = document.querySelectorAll(`.color-option`);
    elements.forEach(el => {
        if (el.style.backgroundColor === color) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
}

function revealTip(tipId) {
    const element = document.getElementById(tipId);
    element.classList.add('revealed');
}
</script>
""", unsafe_allow_html=True)
