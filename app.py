import streamlit as st
import os
import json
import requests
from dotenv import load_dotenv
from streamlit_lottie import st_lottie
import time

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="Ikigai Pathway",
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
div[data-testid="stSidebarNav"] {display: none;}
div[data-testid="collapsedControl"] {display: none;}
section[data-testid="stSidebar"] {display: none;}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Custom CSS for the app
custom_css = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

:root {
    --primary-color: #E94560;
    --secondary-color: #0F3460;
    --background-color: #F9F7F7;
    --text-color: #1A1A2E;
    --accent-color: #16213E;
    --light-accent: #E8F0F2;
}

body {
    font-family: 'Noto Sans JP', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
}

.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.header p {
    font-size: 1.1rem;
    color: var(--secondary-color);
    max-width: 800px;
    margin: 0 auto;
}

.card {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card h3 {
    font-size: 1.3rem;
    font-weight: 500;
    color: var(--secondary-color);
    margin-bottom: 1rem;
}

.card p {
    font-size: 1rem;
    color: var(--text-color);
    margin-bottom: 1.5rem;
}

.button-primary {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 30px;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
}

.button-primary:hover {
    background-color: #d13652;
}

.button-secondary {
    display: inline-block;
    background-color: var(--light-accent);
    color: var(--secondary-color);
    padding: 0.6rem 1.5rem;
    border-radius: 30px;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.3s ease;
    border: none;
    cursor: pointer;
}

.button-secondary:hover {
    background-color: #d9e6ea;
}

.progress-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding: 1rem;
    background-color: var(--light-accent);
    border-radius: 8px;
}

.progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
}

.progress-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: var(--secondary-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    position: relative;
    border: 2px solid var(--secondary-color);
}

.progress-circle.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.progress-label {
    font-size: 0.8rem;
    text-align: center;
    color: var(--secondary-color);
    max-width: 80px;
}

.progress-line {
    height: 2px;
    background-color: var(--secondary-color);
    flex-grow: 1;
    margin: 0 10px;
    position: relative;
    top: -25px;
    z-index: 0;
}

.footer {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.8rem;
    color: var(--secondary-color);
}

.two-column {
    display: flex;
    gap: 2rem;
}

.column {
    flex: 1;
}

@media (max-width: 768px) {
    .two-column {
        flex-direction: column;
    }
}
</style>
"""
st.markdown(custom_css, unsafe_allow_html=True)

# Initialize session state
if 'progress' not in st.session_state:
    st.session_state.progress = {
        'love_complete': False,
        'good_at_complete': False,
        'world_needs_complete': False,
        'paid_for_complete': False,
        'chart_generated': False
    }

# Helper functions
def load_lottie_url(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()

# Load animations
lottie_journey = load_lottie_url("https://assets5.lottiefiles.com/packages/lf20_v4isjbj5.json")
lottie_ikigai = load_lottie_url("https://assets5.lottiefiles.com/private_files/lf30_WdTEui.json")

# Progress visualization
def display_progress():
    st.markdown('<div class="progress-container">', unsafe_allow_html=True)
    
    # Love step
    st.markdown(
        f"""
        <div class="progress-step">
            <div class="progress-circle{'active' if st.session_state.progress['love_complete'] else ''}">1</div>
            <div class="progress-label">What You Love</div>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    # Line to Good At
    st.markdown('<div class="progress-line"></div>', unsafe_allow_html=True)
    
    # Good At step
    st.markdown(
        f"""
        <div class="progress-step">
            <div class="progress-circle{'active' if st.session_state.progress['good_at_complete'] else ''}">2</div>
            <div class="progress-label">What You're Good At</div>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    # Line to World Needs
    st.markdown('<div class="progress-line"></div>', unsafe_allow_html=True)
    
    # World Needs step
    st.markdown(
        f"""
        <div class="progress-step">
            <div class="progress-circle{'active' if st.session_state.progress['world_needs_complete'] else ''}">3</div>
            <div class="progress-label">What the World Needs</div>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    # Line to Paid For
    st.markdown('<div class="progress-line"></div>', unsafe_allow_html=True)
    
    # Paid For step
    st.markdown(
        f"""
        <div class="progress-step">
            <div class="progress-circle{'active' if st.session_state.progress['paid_for_complete'] else ''}">4</div>
            <div class="progress-label">What You Can Be Paid For</div>
        </div>
        """, 
        unsafe_allow_html=True
    )
    
    st.markdown('</div>', unsafe_allow_html=True)

# Landing page
def landing_page():
    # Header
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    st.markdown('<div class="header">', unsafe_allow_html=True)
    st.markdown('<h1>Ikigai Pathway</h1>', unsafe_allow_html=True)
    st.markdown('<p>Discover your purpose and find balance in life through the ancient Japanese concept of Ikigai</p>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Progress tracker
    display_progress()
    
    # Main content
    st.markdown('<div class="two-column">', unsafe_allow_html=True)
    
    # Left column - Explanation
    st.markdown('<div class="column">', unsafe_allow_html=True)
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<h3>What is Ikigai?</h3>', unsafe_allow_html=True)
    st.markdown("""
    <p>
    Ikigai (生き甲斐) is a Japanese concept that means "a reason for being." 
    It is the intersection of four elements:
    </p>
    <ul>
        <li><strong>What you love</strong> - Your passion and interests</li>
        <li><strong>What you're good at</strong> - Your skills and strengths</li>
        <li><strong>What the world needs</strong> - The problems you can help solve</li>
        <li><strong>What you can be paid for</strong> - How you can earn a living</li>
    </ul>
    <p>
    By exploring these four areas and finding their intersection, you can discover your Ikigai - 
    your purpose that brings fulfillment and balance to your life.
    </p>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Right column - Animation and button
    st.markdown('<div class="column">', unsafe_allow_html=True)
    st.markdown('<div class="card" style="text-align: center;">', unsafe_allow_html=True)
    
    # Lottie animation
    if lottie_ikigai:
        st_lottie(lottie_ikigai, height=250, key="ikigai_animation")
    else:
        st.image("https://i.imgur.com/8Fy90AI.png", width=250)
    
    st.markdown('<h3>Ready to find your Ikigai?</h3>', unsafe_allow_html=True)
    st.markdown('<p>Begin your journey by exploring what you love. Each step will bring you closer to discovering your purpose.</p>', unsafe_allow_html=True)
    
    # Start button
    if st.button("Begin Your Journey", key="start_button"):
        st.session_state.progress['landing_complete'] = True
        st.switch_page("pages/1_love.py")
    
    st.markdown('</div>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)  # Close two-column
    
    # Footer
    st.markdown('<div class="footer">', unsafe_allow_html=True)
    st.markdown(' 2025 Ikigai Pathway | A journey to finding your purpose', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)  # Close main-container

# Main app logic
def main():
    landing_page()

if __name__ == "__main__":
    main()
