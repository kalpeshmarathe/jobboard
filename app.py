from flask import Flask, jsonify, request, session, redirect, url_for, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import decimal


app = Flask(__name__)
app.secret_key = 'my_secret_key_1234'

CORS(app)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:kalpesh@localhost/job'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the User model
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

# Define the routes
@app.route('/jobs', methods=['POST'])
def filter_jobs():
    try:
        # Get filter parameters from request body
        data = request.json
        location = data.get('location')
        title = data.get('title')
        
        # Construct the base query
        query = "SELECT * FROM Jobs WHERE 1"
        
        # Add filters if parameters are provided
        if location:
            query += f" AND Location = '{location}'"
        if title:
            query += f" AND JobTitle = '{title}'"
        
        # Execute query to fetch job details
        cursor = db.engine.execute(query)
        
        # Fetch all job details
        jobs = [dict(row) for row in cursor.fetchall()]
        
        # Convert Decimal objects to floats
        for job in jobs:
            for key, value in job.items():
                if isinstance(value, decimal.Decimal):
                    job[key] = float(value)
        
        # Return job details as JSON response
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json  # Assuming the request body is in JSON format
        username = data['username']
        password = data['password']
        hashed_password = generate_password_hash(password)
        user = Users(username=username, password_hash=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json  # Assuming the request body is in JSON format
        username = data['username']
        password = data['password']
        user = Users.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['id'] = user.id
            return jsonify({"message": "Logged in successfully", "status": "success"}), 200
        else:
            return jsonify({"message": "Invalid username or password", "status": "error"}), 401
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/profile')
def profile():
    try:
        user_id = session.get('user_id')
        if user_id: 
            user = Users.query.get(id)
            return jsonify({"username": user.username, "status": "success"}), 200
        else:
            return jsonify({"message": "You are not logged in", "status": "error"}), 401
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

@app.route('/logout')
def logout():
    try:
        session.pop('user_id', None)
        return jsonify({"message": "Logged out successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500




if __name__ == '__main__':
    app.run(debug=True)
