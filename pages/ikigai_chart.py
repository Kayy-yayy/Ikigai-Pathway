import streamlit as st
import sys
import os
import matplotlib.pyplot as plt
import numpy as np
import base64
from PIL import Image
import io
from matplotlib.patches import Ellipse
from streamlit_extras.switch_page_button import switch_page

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.chart_generator import generate_ikigai_chart

# Page configuration
st.set_page_config(
    page_title="Ikigai Chart | Ikigai Pathway",
    page_icon="🏮",
    layout="wide",
    initial_sidebar_state="collapsed"
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
div[data-testid="collapsedControl"] {display: none;}
section[data-testid="stSidebar"] {display: none;}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

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
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)

# Load CSS
load_css()

# Function to generate an empty Ikigai chart
def generate_empty_ikigai_chart():
    # Create figure and axis
    fig, ax = plt.figure(figsize=(10, 10), dpi=100), plt.gca()
    
    # Set background color
    fig.patch.set_facecolor('#F9F5F0')
    ax.set_facecolor('#F9F5F0')
    
    # Define colors
    colors = {
        'love': '#F6CECE',       # Sakura pink
        'good_at': '#7BA17D',    # Bamboo green
        'world_needs': '#3F4B83', # Indigo blue
        'paid_for': '#D4AF37'    # Gold accent
    }
    
    # Create circles
    circles = {
        'love': Ellipse((0.3, 0.7), 0.5, 0.5, color=colors['love'], alpha=0.5),
        'good_at': Ellipse((0.7, 0.7), 0.5, 0.5, color=colors['good_at'], alpha=0.5),
        'world_needs': Ellipse((0.3, 0.3), 0.5, 0.5, color=colors['world_needs'], alpha=0.5),
        'paid_for': Ellipse((0.7, 0.3), 0.5, 0.5, color=colors['paid_for'], alpha=0.5)
    }
    
    # Add circles to plot
    for circle in circles.values():
        ax.add_patch(circle)
    
    # Add labels
    plt.text(0.3, 0.95, 'What You Love', ha='center', va='center', fontsize=14, fontweight='bold')
    plt.text(0.7, 0.95, 'What You Are\nGood At', ha='center', va='center', fontsize=14, fontweight='bold')
    plt.text(0.3, 0.05, 'What the\nWorld Needs', ha='center', va='center', fontsize=14, fontweight='bold')
    plt.text(0.7, 0.05, 'What You Can\nBe Paid For', ha='center', va='center', fontsize=14, fontweight='bold')
    
    # Add intersection labels
    plt.text(0.5, 0.8, 'PASSION', ha='center', va='center', fontsize=12, fontweight='bold')
    plt.text(0.2, 0.5, 'MISSION', ha='center', va='center', fontsize=12, fontweight='bold')
    plt.text(0.8, 0.5, 'VOCATION', ha='center', va='center', fontsize=12, fontweight='bold')
    plt.text(0.5, 0.2, 'PROFESSION', ha='center', va='center', fontsize=12, fontweight='bold')
    
    # Add IKIGAI at center
    plt.text(0.5, 0.5, 'IKIGAI', ha='center', va='center', fontsize=16, fontweight='bold')
    
    # Remove axes
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    # Convert to base64 for display
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
    buf.seek(0)
    plt.close(fig)
    
    # Encode the image to base64
    img_str = base64.b64encode(buf.read()).decode()
    
    return img_str

# Main content
st.markdown('<div style="background-color: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 900px;">', unsafe_allow_html=True)

# Top navigation
st.markdown('<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">', unsafe_allow_html=True)
st.markdown('<a href="/" style="text-decoration: none;"><h3 style="margin: 0; color: #3498db;">← Back to Home</h3></a>', unsafe_allow_html=True)
st.markdown('<a href="/about" style="text-decoration: none;"><h3 style="margin: 0; color: #3498db;">About Ikigai</h3></a>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Title
st.markdown('<h1 style="text-align: center; color: #333; margin-bottom: 30px;">Your Ikigai Chart</h1>', unsafe_allow_html=True)

# Check if user has completed all sections
all_completed = False
if 'responses' in st.session_state:
    responses = st.session_state.get('responses', {})
    all_completed = all(len(responses.get(key, [])) > 0 for key in ['love', 'good_at', 'world_needs', 'paid_for'])

# Initialize color scheme if not present
if 'color_scheme' not in st.session_state:
    st.session_state.color_scheme = {
        'love': '#F6CECE',       # Sakura pink
        'good_at': '#7BA17D',    # Bamboo green
        'world_needs': '#3F4B83', # Indigo blue
        'paid_for': '#D4AF37'    # Gold accent
    }

# Display appropriate content based on completion status
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
    
    # Add a button to restart the journey
    st.markdown('<div style="text-align: center; margin-top: 30px;">', unsafe_allow_html=True)
    if st.button('Restart Your Journey', key='restart_journey'):
        # Reset session state
        st.session_state.responses = {
            'love': [],
            'good_at': [],
            'world_needs': [],
            'paid_for': []
        }
        st.session_state.progress = {
            'landing_complete': False,
            'love_complete': False,
            'good_at_complete': False,
            'world_needs_complete': False,
            'paid_for_complete': False,
            'chart_generated': False
        }
        # Redirect to the first page
        switch_page("love")
    st.markdown('</div>', unsafe_allow_html=True)
else:
    # Display empty chart with message
    st.markdown('<div style="text-align: center; margin-bottom: 20px;">', unsafe_allow_html=True)
    
    # Generate empty chart
    empty_chart = generate_empty_ikigai_chart()
    
    # Display the empty chart
    st.image(f"data:image/png;base64,{empty_chart}", use_column_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Message about completing the journey
    st.markdown('''
    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: rgba(246, 206, 206, 0.3); border-radius: 10px;">
        <h2 style="color: #3F4B83;">Complete Your Ikigai Journey</h2>
        <p style="font-size: 1.1rem; line-height: 1.6;">
            To generate your personalized Ikigai chart, you need to complete all four sections of the journey:
            What You Love, What You're Good At, What the World Needs, and What You Can Be Paid For.
        </p>
    </div>
    ''', unsafe_allow_html=True)
    
    # Button to begin the journey
    st.markdown('''
    <div style="text-align: center; margin-top: 30px;">
        <button id="begin-journey-btn" style="
            background-color: #7BA17D;
            color: white;
            border: none;
            border-radius: 30px;
            padding: 15px 40px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 0 #5a7a5c, 0 8px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            position: relative;
            top: 0;
        ">
            Begin Your Ikigai Journey
        </button>
    </div>
    
    <script>
        document.getElementById("begin-journey-btn").addEventListener("mouseover", function() {
            this.style.backgroundColor = "#6a9070";
            this.style.top = "-2px";
            this.style.boxShadow = "0 8px 0 #5a7a5c, 0 10px 15px rgba(0, 0, 0, 0.25)";
        });
        
        document.getElementById("begin-journey-btn").addEventListener("mouseout", function() {
            this.style.backgroundColor = "#7BA17D";
            this.style.top = "0";
            this.style.boxShadow = "0 6px 0 #5a7a5c, 0 8px 10px rgba(0, 0, 0, 0.2)";
        });
        
        document.getElementById("begin-journey-btn").addEventListener("mousedown", function() {
            this.style.top = "4px";
            this.style.boxShadow = "0 2px 0 #5a7a5c, 0 4px 6px rgba(0, 0, 0, 0.2)";
        });
        
        document.getElementById("begin-journey-btn").addEventListener("mouseup", function() {
            this.style.top = "-2px";
            this.style.boxShadow = "0 8px 0 #5a7a5c, 0 10px 15px rgba(0, 0, 0, 0.25)";
        });
    </script>
    ''', unsafe_allow_html=True)
    
    # Use Streamlit button for functionality but hide it with CSS
    st.markdown('<style>#begin-journey-btn-container { display: none; }</style>', unsafe_allow_html=True)
    with st.container():
        st.markdown('<div id="begin-journey-btn-container">', unsafe_allow_html=True)
        if st.button('Begin Your Ikigai Journey', key='begin_journey'):
            switch_page("love")
        st.markdown('</div>', unsafe_allow_html=True)
    
    # JavaScript to connect the custom button to the hidden Streamlit button
    st.markdown('''
    <script>
        document.getElementById("begin-journey-btn").addEventListener("click", function() {
            document.querySelector('button[kind="primary"]').click();
        });
    </script>
    ''', unsafe_allow_html=True)

# Close the main container
st.markdown('</div>', unsafe_allow_html=True)
