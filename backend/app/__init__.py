# Initialize the application package

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize SQLAlchemy outside of the factory function
# This allows us to import db in other modules
db = SQLAlchemy()

def create_app():
    # Create Flask application
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    frontend_dir = os.path.abspath(os.path.join(project_root, 'frontend'))
    
    # Ensure absolute paths
    static_folder = os.path.abspath(os.path.join(frontend_dir, 'static'))
    template_folder = os.path.abspath(os.path.join(frontend_dir, 'templates'))
    
    # Initialize Flask app with explicit template and static folders
    app = Flask(__name__, 
                static_folder=static_folder,
                static_url_path='/static',
                template_folder=template_folder)
    
    # Set additional configuration
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['EXPLAIN_TEMPLATE_LOADING'] = True
    app.config['DEBUG'] = True
    
    # Database configuration (PostgreSQL)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/Lavimac'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Configure CORS to allow all origins
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize database
    db.init_app(app)

    # Create database tables
    with app.app_context():
        db.create_all()

    # Register routes
    from .main import register_routes
    app = register_routes(app)

    # Additional error handling
    @app.errorhandler(404)
    def page_not_found(e):
        app.logger.error(f"404 Error: {e}")
        return "Page not found", 404

    @app.errorhandler(500)
    def internal_server_error(e):
        app.logger.error(f"500 Error: {e}")
        return "Internal server error", 500

    return app

def run_app():
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=True)
