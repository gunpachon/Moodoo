from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
swagger = Swagger()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SWAGGER'] = {
        'title': 'Moodoo API',
        'uiversion': 3
    }

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    swagger.init_app(app)
    CORS(app)  # Allow cross-origin requests

    # Register Blueprints
    from app.routes.signup import signup_bp
    app.register_blueprint(signup_bp, url_prefix='/api')
    
    from app.routes.login import login_bp
    app.register_blueprint(login_bp, url_prefix='/api')

    from app.routes.user import user_bp
    app.register_blueprint(user_bp, url_prefix='/api')
    
    from app.routes.mood import mood_bp
    app.register_blueprint(mood_bp, url_prefix='/api')

    return app
