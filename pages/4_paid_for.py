import streamlit as st
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.ai_helper import get_ai_suggestions
from streamlit_extras.switch_page_button import switch_page

# Page configuration
st.set_page_config(
    page_title="What You Can Be Paid For | Ikigai Pathway",
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
            background-color: #D4AF37;
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
if 'paid_for_inputs' not in st.session_state:
    st.session_state.paid_for_inputs = [""] * 5  # 5 input fields
    
if 'paid_for_suggestions' not in st.session_state:
    st.session_state.paid_for_suggestions = [[] for _ in range(5)]  # Suggestions for each input

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

# Function to get suggestions
def get_suggestions(input_text, index):
    if input_text and len(input_text) > 3:
        suggestions = get_ai_suggestions(input_text, "paid_for")
        st.session_state.paid_for_suggestions[index] = suggestions
        return suggestions
    return []

# Function to add suggestion to input
def add_suggestion_to_input(suggestion, index):
    st.session_state.paid_for_inputs[index] = suggestion

# Main content
st.markdown('<h1 class="main-header">What You Can Be <span class="gold-accent">Paid For</span></h1>', unsafe_allow_html=True)

# Display progress
display_progress()

st.markdown(
    """
    <div class="centered-content">
        <p>Consider careers, services, or products that people would pay you for.</p>
        <p>What value can you provide? What opportunities exist in the market?</p>
    </div>
    """, 
    unsafe_allow_html=True
)

# Input fields
st.markdown("### Share 3-5 ways you could be compensated for your skills and passions:")

for i in range(5):
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Use a key that includes the index to ensure uniqueness
        input_key = f"paid_for_input_{i}"
        input_value = st.text_input(f"Item {i+1}", key=input_key, value=st.session_state.paid_for_inputs[i])
        
        # Update session state when input changes
        if input_value != st.session_state.paid_for_inputs[i]:
            st.session_state.paid_for_inputs[i] = input_value
            # Get suggestions when input changes
            if input_value:
                get_suggestions(input_value, i)
    
    with col2:
        if i == 0:
            st.markdown("### AI Suggestions")
        
        # Display suggestions as clickable pills
        if st.session_state.paid_for_suggestions[i]:
            for suggestion in st.session_state.paid_for_suggestions[i]:
                suggestion_html = f'<div class="suggestion-pill" onclick="document.getElementById(\'{input_key}\').value=\'{suggestion}\'; document.getElementById(\'{input_key}\').dispatchEvent(new Event(\'input\'));">{suggestion}</div>'
                st.markdown(suggestion_html, unsafe_allow_html=True)
        else:
            st.markdown("Type more for suggestions")

# Navigation buttons
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    col_back, col_next = st.columns(2)
    
    with col_back:
        if st.button("← Back to What the World Needs", key="back_to_world_needs"):
            switch_page("world needs")
    
    with col_next:
        if st.button("Generate Your Ikigai Chart →", key="continue_to_chart"):
            # Save responses to session state
            valid_inputs = [inp for inp in st.session_state.paid_for_inputs if inp.strip()]
            if valid_inputs:
                st.session_state.responses['paid_for'] = valid_inputs
                st.session_state.progress['paid_for_complete'] = True
                switch_page("ikigai chart")
            else:
                st.error("Please enter at least one item before continuing.")

# JavaScript for handling suggestion clicks
st.markdown("""
<script>
function updateInput(inputId, value) {
    document.getElementById(inputId).value = value;
    document.getElementById(inputId).dispatchEvent(new Event('input'));
}
</script>
""", unsafe_allow_html=True)
