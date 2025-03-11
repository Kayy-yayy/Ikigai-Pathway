import streamlit as st
import sys
import os
from streamlit_extras.switch_page_button import switch_page

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Page configuration
st.set_page_config(
    page_title="About Ikigai | Ikigai Pathway",
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

# Main content
st.markdown('<div style="background-color: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 20px auto; max-width: 800px;">', unsafe_allow_html=True)

# Top navigation
st.markdown('<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">', unsafe_allow_html=True)
st.markdown('<a href="/" style="text-decoration: none;"><h3 style="margin: 0; color: #3498db;">← Back to Home</h3></a>', unsafe_allow_html=True)
st.markdown('<a href="/ikigai_chart" style="text-decoration: none;"><h3 style="margin: 0; color: #3498db;">Ikigai Chart →</h3></a>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Title
st.markdown('<h1 style="text-align: center; color: #333; margin-bottom: 30px;">About Ikigai</h1>', unsafe_allow_html=True)

# Introduction
st.markdown('''
<div style="margin-bottom: 30px;">
    <h2>What is Ikigai?</h2>
    <p style="font-size: 1.1rem; line-height: 1.6;">
        Ikigai (生き甲斐) is a Japanese concept that means "a reason for being." It is the intersection of what you love, 
        what you are good at, what the world needs, and what you can be paid for. The term is composed of two Japanese words: 
        "iki" (生き) meaning "life" and "gai" (甲斐) meaning "value" or "worth."
    </p>
    <p style="font-size: 1.1rem; line-height: 1.6;">
        Finding your ikigai is considered the secret to a long, happy, and meaningful life in Japanese culture, 
        particularly in Okinawa, which is known for having some of the longest-living people in the world.
    </p>
</div>
''', unsafe_allow_html=True)

# The four components
st.markdown('''
<div style="margin-bottom: 30px;">
    <h2>The Four Components of Ikigai</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div style="background-color: rgba(246, 206, 206, 0.3); padding: 20px; border-radius: 10px;">
            <h3 style="color: #F6CECE;">What You Love</h3>
            <p>Your passion and the activities that bring you joy and fulfillment.</p>
        </div>
        <div style="background-color: rgba(123, 161, 125, 0.3); padding: 20px; border-radius: 10px;">
            <h3 style="color: #7BA17D;">What You're Good At</h3>
            <p>Your skills, talents, and strengths that come naturally to you or that you've developed.</p>
        </div>
        <div style="background-color: rgba(63, 75, 131, 0.3); padding: 20px; border-radius: 10px;">
            <h3 style="color: #3F4B83;">What the World Needs</h3>
            <p>The problems, challenges, or opportunities where you can make a positive impact.</p>
        </div>
        <div style="background-color: rgba(212, 175, 55, 0.3); padding: 20px; border-radius: 10px;">
            <h3 style="color: #D4AF37;">What You Can Be Paid For</h3>
            <p>The ways your skills and passions can be monetized or provide economic value.</p>
        </div>
    </div>
</div>
''', unsafe_allow_html=True)

# The intersections
st.markdown('''
<div style="margin-bottom: 30px;">
    <h2>The Intersections</h2>
    <p style="font-size: 1.1rem; line-height: 1.6;">
        When these four elements overlap, they create important aspects of a fulfilling life:
    </p>
    <ul style="font-size: 1.1rem; line-height: 1.6;">
        <li><strong>Passion:</strong> What you love and what you're good at</li>
        <li><strong>Mission:</strong> What you love and what the world needs</li>
        <li><strong>Vocation:</strong> What you're good at and what you can be paid for</li>
        <li><strong>Profession:</strong> What the world needs and what you can be paid for</li>
    </ul>
    <p style="font-size: 1.1rem; line-height: 1.6;">
        When all four elements overlap, you've found your <strong>Ikigai</strong> - your reason for being.
    </p>
</div>
''', unsafe_allow_html=True)

# Benefits
st.markdown('''
<div style="margin-bottom: 30px;">
    <h2>Benefits of Finding Your Ikigai</h2>
    <ul style="font-size: 1.1rem; line-height: 1.6;">
        <li>Greater sense of purpose and meaning in life</li>
        <li>Increased motivation and engagement in daily activities</li>
        <li>Better work-life balance and job satisfaction</li>
        <li>Improved mental health and well-being</li>
        <li>More resilience during challenging times</li>
        <li>Potential for greater longevity (as observed in Okinawa)</li>
    </ul>
</div>
''', unsafe_allow_html=True)

# Journey button
st.markdown('''
<div style="text-align: center; margin-top: 40px;">
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
