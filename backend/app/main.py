from flask import Flask, request, jsonify, send_from_directory, abort, Response, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import sys
import traceback
from dotenv import load_dotenv
import logging
from logging.handlers import RotatingFileHandler
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from werkzeug.security import check_password_hash

# Load environment variables
load_dotenv()

# Get absolute paths
base_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(base_dir, '..', '..'))
static_folder = os.path.join(project_root, 'frontend', 'static')
template_folder = os.path.join(project_root, 'frontend', 'templates')

# Create Flask app
app = Flask(__name__,
            static_folder=static_folder,
            static_url_path='/static',
            template_folder=template_folder)

# Enable CORS
CORS(app)

# Setup logging
def setup_logging(app):
    log_dir = os.path.join(os.path.dirname(__file__), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    handler = RotatingFileHandler(
        os.path.join(log_dir, 'app.log'),
        maxBytes=10000,
        backupCount=3
    )
    handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(levelname)s: %(message)s'
    ))
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

setup_logging(app)

def register_routes(app):
    @app.route('/')
    @app.route('/index.html')
    def index():
        try:
            return render_template('index.html')
        except Exception as e:
            app.logger.error(f"Error rendering index template: {str(e)}")
            traceback.print_exc()
            return str(e), 500

    @app.route('/booking', methods=['GET'])
    def booking():
        try:
            return render_template('booking.html')
        except Exception as e:
            app.logger.error(f"Error rendering booking template: {str(e)}")
            traceback.print_exc()
            return str(e), 500

    @app.route('/favicon.ico')
    def favicon():
        try:
            return send_from_directory(
                os.path.join(app.root_path, '..', '..', 'frontend', 'static', 'img'), 
                'logo.jpg', 
                mimetype='image/jpg'
            )
        except Exception as e:
            app.logger.error(f"Favicon error: {e}")
            return "", 404

    @app.route('/static/<path:filename>')
    def serve_static(filename):
        try:
            return send_from_directory(static_folder, filename)
        except Exception as e:
            app.logger.error(f"Static file error: {e}")
            return str(e), 404

    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'template_folder': app.template_folder,
            'static_folder': app.static_folder,
            'cwd': os.getcwd(),
            'port': 5001
        }), 200

    return app

# Import the db object from the app package
from . import db

# Define models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_type = db.Column(db.String(50), nullable=False)
    room_number = db.Column(db.String(20), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    capacity_adults = db.Column(db.Integer, default=2)
    capacity_children = db.Column(db.Integer, default=1)
    availability_status = db.Column(db.Boolean, default=True)

register_routes(app)

if __name__ == '__main__':
    try:
        port = int(os.environ.get('PORT', 5001))
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        print(f"Error starting the application: {e}")
        traceback.print_exc()
