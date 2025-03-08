import streamlit as st
import base64
import os
from PIL import Image
import io

def get_base64_encoded_image(image_path):
    """
    Get base64 encoded string of an image for use in CSS background
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        str: Base64 encoded string of the image
    """
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode()
    except Exception as e:
        print(f"Error loading image {image_path}: {e}")
        return None

def get_audio_base64(file_path):
    """
    Get base64 encoded string of an audio file
    
    Args:
        file_path (str): Path to the audio file
        
    Returns:
        str: Base64 encoded string of the audio file
    """
    try:
        with open(file_path, "rb") as audio_file:
            audio_bytes = audio_file.read()
            base64_audio = base64.b64encode(audio_bytes).decode("utf-8")
            return base64_audio
    except Exception as e:
        print(f"Error loading audio {file_path}: {e}")
        return None

def play_audio(base64_audio):
    """
    Create HTML to play audio
    
    Args:
        base64_audio (str): Base64 encoded audio string
        
    Returns:
        None: Displays audio HTML in Streamlit
    """
    if base64_audio:
        audio_html = f"""
            <audio autoplay>
                <source src="data:audio/mp3;base64,{base64_audio}" type="audio/mp3">
            </audio>
        """
        st.markdown(audio_html, unsafe_allow_html=True)

def set_background_image(image_path):
    """
    Set a background image for the Streamlit page
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        None: Applies CSS to set background image
    """
    base64_image = get_base64_encoded_image(image_path)
    if base64_image:
        background_css = f"""
        <style>
        .stApp {{
            background-image: url("data:image/png;base64,{base64_image}");
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }}
        .stApp > header {{
            background-color: transparent;
        }}
        </style>
        """
        st.markdown(background_css, unsafe_allow_html=True)
    else:
        print(f"Failed to set background image: {image_path}")

def add_background_overlay(opacity=0.7, color="#F9F5F0"):
    """
    Add a semi-transparent overlay to the background for better text readability
    
    Args:
        opacity (float): Opacity level (0.0 to 1.0)
        color (str): Overlay color in hex format
        
    Returns:
        None: Applies CSS to create overlay
    """
    overlay_css = f"""
    <style>
    .stApp:before {{
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: {color};
        opacity: {opacity};
        z-index: -1;
    }}
    </style>
    """
    st.markdown(overlay_css, unsafe_allow_html=True)

def create_placeholder_images():
    """
    Create placeholder images if they don't exist
    This is useful for testing before actual images are added
    
    Returns:
        dict: Paths to created placeholder images
    """
    placeholders = {
        "background": os.path.join("assets", "images", "zen_garden_bg.png"),
        "torii": os.path.join("assets", "images", "torii_gate.png"),
        "lantern": os.path.join("assets", "images", "lantern.png"),
        "cherry_blossom": os.path.join("assets", "images", "cherry_blossom.png"),
        "ema": os.path.join("assets", "images", "ema_plaque.png")
    }
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.join("assets", "images"), exist_ok=True)
    
    # Create placeholder images with different colors
    colors = {
        "background": (249, 245, 240),  # Soft White
        "torii": (63, 75, 131),        # Indigo Blue
        "lantern": (212, 175, 55),     # Gold
        "cherry_blossom": (246, 206, 206),  # Sakura Pink
        "ema": (123, 161, 125)         # Bamboo Green
    }
    
    for name, path in placeholders.items():
        if not os.path.exists(path):
            color = colors.get(name, (200, 200, 200))
            img = Image.new('RGB', (800, 600), color=color)
            
            # Add text to image
            from PIL import ImageDraw, ImageFont
            draw = ImageDraw.Draw(img)
            try:
                font = ImageFont.truetype("arial.ttf", 40)
            except IOError:
                font = ImageFont.load_default()
                
            text = f"Placeholder for {name}"
            textwidth, textheight = draw.textsize(text, font)
            x = (800 - textwidth) // 2
            y = (600 - textheight) // 2
            draw.text((x, y), text, fill=(0, 0, 0), font=font)
            
            # Save image
            img.save(path)
            print(f"Created placeholder image: {path}")
    
    return placeholders

def create_placeholder_sounds():
    """
    Create placeholder text files for sounds
    This is useful for documenting what sounds are needed
    
    Returns:
        dict: Paths to placeholder sound files
    """
    placeholders = {
        "water_ripple": os.path.join("assets", "sounds", "water_ripple.txt"),
        "zen_background": os.path.join("assets", "sounds", "zen_background.txt"),
        "bell": os.path.join("assets", "sounds", "bell.txt")
    }
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.join("assets", "sounds"), exist_ok=True)
    
    # Create placeholder text files
    for name, path in placeholders.items():
        if not os.path.exists(path):
            with open(path, "w") as f:
                f.write(f"Placeholder for {name} sound.\n\n")
                f.write("Replace this file with an actual .mp3 or .wav file with the same name.\n")
                f.write("For example, replace water_ripple.txt with water_ripple.mp3\n\n")
                f.write("Suggested sounds:\n")
                if name == "water_ripple":
                    f.write("- A gentle water ripple sound for when the user tosses the Ema plaque\n")
                elif name == "zen_background":
                    f.write("- Soft ambient background music with Japanese instruments\n")
                elif name == "bell":
                    f.write("- A gentle temple bell sound for transitions between pages\n")
            print(f"Created placeholder for sound: {path}")
    
    return placeholders
