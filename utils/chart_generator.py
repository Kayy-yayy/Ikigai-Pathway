import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Circle
from matplotlib.patheffects import withStroke
import io
from PIL import Image
import base64

def generate_ikigai_chart(responses, color_scheme=None):
    """
    Generate a personalized ikigai chart based on user responses
    
    Args:
        responses (dict): Dictionary containing user responses for each ikigai category
        color_scheme (dict, optional): Custom color scheme for the chart
        
    Returns:
        str: Base64 encoded PNG image of the ikigai chart
    """
    # Default color scheme (Japanese-inspired)
    if color_scheme is None:
        color_scheme = {
            'love': '#F6CECE',         # Sakura Pink
            'good_at': '#7BA17D',      # Bamboo Green
            'world_needs': '#3F4B83',  # Indigo Blue
            'paid_for': '#D4AF37',     # Gold
            'background': '#F9F5F0',   # Soft White
            'text': '#2A2A2A'          # Sumi Ink Black
        }
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=(10, 10), facecolor=color_scheme['background'])
    
    # Set up the axis
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.axis('off')
    
    # Create circles
    circles = {
        'love': Circle((-0.3, 0.3), 0.7, alpha=0.6, fc=color_scheme['love']),
        'good_at': Circle((0.3, 0.3), 0.7, alpha=0.6, fc=color_scheme['good_at']),
        'world_needs': Circle((-0.3, -0.3), 0.7, alpha=0.6, fc=color_scheme['world_needs']),
        'paid_for': Circle((0.3, -0.3), 0.7, alpha=0.6, fc=color_scheme['paid_for'])
    }
    
    # Add circles to plot
    for circle in circles.values():
        ax.add_patch(circle)
    
    # Add labels for each circle
    labels = {
        'love': 'What you\nLOVE',
        'good_at': 'What you are\nGOOD AT',
        'world_needs': 'What the\nWORLD NEEDS',
        'paid_for': 'What you can be\nPAID FOR'
    }
    
    positions = {
        'love': (-0.7, 0.7),
        'good_at': (0.7, 0.7),
        'world_needs': (-0.7, -0.7),
        'paid_for': (0.7, -0.7)
    }
    
    for category, label in labels.items():
        ax.text(positions[category][0], positions[category][1], label,
                ha='center', va='center', fontsize=14, fontweight='bold',
                color=color_scheme['text'],
                path_effects=[withStroke(linewidth=3, foreground=color_scheme['background'])])
    
    # Add intersection labels
    intersections = {
        'passion': (0, 0.5, 'PASSION'),
        'mission': (-0.5, 0, 'MISSION'),
        'vocation': (0.5, 0, 'VOCATION'),
        'profession': (0, -0.5, 'PROFESSION'),
        'ikigai': (0, 0, 'IKIGAI')
    }
    
    for _, (x, y, label) in intersections.items():
        ax.text(x, y, label, ha='center', va='center', fontsize=12,
                color=color_scheme['text'],
                path_effects=[withStroke(linewidth=3, foreground=color_scheme['background'])])
    
    # Add user responses as small text in each circle
    response_positions = {
        'love': (-0.3, 0.3),
        'good_at': (0.3, 0.3),
        'world_needs': (-0.3, -0.3),
        'paid_for': (0.3, -0.3)
    }
    
    for category, items in responses.items():
        if items:
            text = "\n".join(items[:3])  # Limit to first 3 items
            ax.text(response_positions[category][0], response_positions[category][1],
                    text, ha='center', va='center', fontsize=8,
                    color=color_scheme['text'], fontweight='light',
                    path_effects=[withStroke(linewidth=2, foreground=color_scheme['background'])])
    
    # Add title
    ax.text(0, 1.1, 'Your Ikigai Pathway', ha='center', va='center',
            fontsize=24, fontweight='bold', color=color_scheme['text'])
    
    # Convert plot to image
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
    buf.seek(0)
    
    # Convert to base64 for embedding in HTML
    img = Image.open(buf)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    plt.close(fig)
    
    return img_str
