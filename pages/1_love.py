import streamlit as st
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path to import from app.py
parent_dir = Path(__file__).parent.parent
sys.path.append(str(parent_dir))

# Import from app.py
from app import display_progress

# Page configuration
st.set_page_config(
    page_title="What You Love | Ikigai Pathway",
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

# Initialize session state for responses if not already done
if 'responses' not in st.session_state:
    st.session_state.responses = {
        'love': [],
        'good_at': [],
        'world_needs': [],
        'paid_for': []
    }

# Initialize progress if not already done
if 'progress' not in st.session_state:
    st.session_state.progress = {
        'love_complete': False,
        'good_at_complete': False,
        'world_needs_complete': False,
        'paid_for_complete': False,
        'chart_generated': False
    }

# Main content
def main():
    # Main container
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Header
    st.markdown('<div class="header">', unsafe_allow_html=True)
    st.markdown('<h1>What You Love</h1>', unsafe_allow_html=True)
    st.markdown('<p>Explore your passions, interests, and what brings you joy</p>', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Progress tracker
    display_progress()
    
    # Content area
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown("""
    <h3>Discover Your Passions</h3>
    <p>
    The first component of Ikigai is understanding what you truly love. 
    These are activities, subjects, or experiences that bring you joy, 
    fulfillment, and make you lose track of time.
    </p>
    <p>
    Take a moment to reflect on what activities energize you, what topics 
    fascinate you, and what experiences make you feel most alive.
    </p>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Questions section
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<h3>Reflection Questions</h3>', unsafe_allow_html=True)
    
    # Question 1
    st.markdown("""
    <p><strong>1. What activities make you lose track of time?</strong></p>
    <p><em>Think about when you're so engaged that hours pass without you noticing.</em></p>
    """, unsafe_allow_html=True)
    
    q1_response = st.text_area(
        "Your answer",
        value=st.session_state.responses['love'][0] if len(st.session_state.responses['love']) > 0 else "",
        key="q1_love",
        label_visibility="collapsed",
        height=100
    )
    
    # Question 2
    st.markdown("""
    <p><strong>2. What topics do you enjoy learning about?</strong></p>
    <p><em>Consider subjects you're naturally drawn to explore.</em></p>
    """, unsafe_allow_html=True)
    
    q2_response = st.text_area(
        "Your answer",
        value=st.session_state.responses['love'][1] if len(st.session_state.responses['love']) > 1 else "",
        key="q2_love",
        label_visibility="collapsed",
        height=100
    )
    
    # Question 3
    st.markdown("""
    <p><strong>3. What would you do even if you weren't paid for it?</strong></p>
    <p><em>Imagine having all your financial needs met - what would you still choose to do?</em></p>
    """, unsafe_allow_html=True)
    
    q3_response = st.text_area(
        "Your answer",
        value=st.session_state.responses['love'][2] if len(st.session_state.responses['love']) > 2 else "",
        key="q3_love",
        label_visibility="collapsed",
        height=100
    )
    
    # Question 4
    st.markdown("""
    <p><strong>4. What activities from your childhood did you enjoy that you might have forgotten about?</strong></p>
    <p><em>Sometimes our purest interests emerge in childhood before external pressures influence us.</em></p>
    """, unsafe_allow_html=True)
    
    q4_response = st.text_area(
        "Your answer",
        value=st.session_state.responses['love'][3] if len(st.session_state.responses['love']) > 3 else "",
        key="q4_love",
        label_visibility="collapsed",
        height=100
    )
    
    # Question 5
    st.markdown("""
    <p><strong>5. What makes you feel energized rather than drained?</strong></p>
    <p><em>Consider activities that give you energy instead of taking it away.</em></p>
    """, unsafe_allow_html=True)
    
    q5_response = st.text_area(
        "Your answer",
        value=st.session_state.responses['love'][4] if len(st.session_state.responses['love']) > 4 else "",
        key="q5_love",
        label_visibility="collapsed",
        height=100
    )
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Summary section
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.markdown('<h3>Your Passions Summary</h3>', unsafe_allow_html=True)
    
    summary = st.text_area(
        "Based on your reflections above, summarize the key themes of what you love:",
        value=st.session_state.responses['love'][5] if len(st.session_state.responses['love']) > 5 else "",
        key="summary_love",
        height=150
    )
    
    # Save and continue
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("Save & Continue to What You're Good At", use_container_width=True):
            # Save responses
            st.session_state.responses['love'] = [
                q1_response, q2_response, q3_response, q4_response, q5_response, summary
            ]
            
            # Update progress
            st.session_state.progress['love_complete'] = True
            
            # Navigate to next page
            st.switch_page("pages/2_good_at.py")
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Footer
    st.markdown('<div class="footer">', unsafe_allow_html=True)
    st.markdown('2025 Ikigai Pathway | A journey to finding your purpose', unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)  # Close main-container

if __name__ == "__main__":
    main()
