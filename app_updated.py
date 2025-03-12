from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import os
import json
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ikigai.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    avatar = db.Column(db.String(120), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    ikigai_data = db.relationship('IkigaiData', backref='user', lazy=True)

class IkigaiData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    passion = db.Column(db.Text, nullable=True)
    mission = db.Column(db.Text, nullable=True)
    vocation = db.Column(db.Text, nullable=True)
    profession = db.Column(db.Text, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    date_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Email already registered'})
    
    existing_username = User.query.filter_by(username=data['username']).first()
    if existing_username:
        return jsonify({'success': False, 'message': 'Username already taken'})
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        avatar=data['avatar']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Set session
    session['user_id'] = new_user.id
    
    return jsonify({'success': True, 'user_id': new_user.id})

@app.route('/get_user_data')
def get_user_data():
    if 'user_id' not in session:
        return jsonify({'success': False})
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'success': False})
    
    return jsonify({
        'success': True,
        'username': user.username,
        'avatar': url_for('static', filename=f'images/{user.avatar}')
    })

@app.route('/pillar/<pillar_name>')
def pillar(pillar_name):
    if pillar_name not in ['passion', 'mission', 'vocation', 'profession']:
        return redirect(url_for('index'))
    
    return render_template('pillar.html', pillar=pillar_name)

@app.route('/save_pillar', methods=['POST'])
def save_pillar():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Please sign in'})
    
    data = request.json
    pillar_name = data['pillar']
    answers = data['answers']
    
    # Get or create ikigai data for user
    ikigai_data = IkigaiData.query.filter_by(user_id=session['user_id']).first()
    
    if not ikigai_data:
        ikigai_data = IkigaiData(user_id=session['user_id'])
        db.session.add(ikigai_data)
    
    # Update the appropriate pillar
    setattr(ikigai_data, pillar_name, json.dumps(answers))
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/ikigai_chart')
def ikigai_chart():
    user_data = None
    if 'user_id' in session:
        ikigai_data = IkigaiData.query.filter_by(user_id=session['user_id']).first()
        if ikigai_data:
            user_data = {
                'passion': json.loads(ikigai_data.passion) if ikigai_data.passion else [],
                'mission': json.loads(ikigai_data.mission) if ikigai_data.mission else [],
                'vocation': json.loads(ikigai_data.vocation) if ikigai_data.vocation else [],
                'profession': json.loads(ikigai_data.profession) if ikigai_data.profession else []
            }
    
    return render_template('ikigai_chart.html', user_data=user_data)

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    # This would be where you'd integrate with Gemini API
    # For now, we'll return some mock suggestions
    data = request.json
    input_text = data['text']
    pillar = data['pillar']
    
    suggestions = []
    
    if pillar == 'passion':
        if 'help' in input_text.lower():
            suggestions = ['mentorship', 'community building', 'volunteer work']
        elif 'creat' in input_text.lower():
            suggestions = ['artistic expression', 'design', 'innovation']
            
    elif pillar == 'mission':
        if 'world' in input_text.lower():
            suggestions = ['global impact', 'sustainability', 'social change']
        elif 'teach' in input_text.lower():
            suggestions = ['education', 'knowledge sharing', 'mentorship']
            
    elif pillar == 'vocation':
        if 'tech' in input_text.lower():
            suggestions = ['software development', 'digital transformation', 'IT consulting']
        elif 'business' in input_text.lower():
            suggestions = ['entrepreneurship', 'business strategy', 'leadership']
            
    elif pillar == 'profession':
        if 'data' in input_text.lower():
            suggestions = ['data analysis', 'data science', 'business intelligence']
        elif 'manage' in input_text.lower():
            suggestions = ['project management', 'team leadership', 'operations']
    
    return jsonify({'suggestions': suggestions})

@app.route('/api/growth_tips', methods=['POST'])
def get_growth_tips():
    data = request.json
    ikigai_data = data['ikigai_data']
    
    # In a real implementation, this would analyze the user's ikigai data
    # and generate personalized tips
    
    tips = [
        "Schedule 30 minutes each week to reflect on activities that energized you",
        "Find a mentor in your field who embodies aspects of your ikigai",
        "Start a small side project that combines your passions with your skills",
        "Join communities related to your mission to connect with like-minded individuals",
        "Set specific learning goals related to your profession",
        "Practice mindfulness to stay connected to your purpose during daily tasks",
        "Create a vision board that visually represents your ikigai"
    ]
    
    return jsonify({'tips': tips})

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
