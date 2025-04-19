from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app import db
from flasgger import swag_from
from app.utils.models import User

signup_bp = Blueprint('signup', __name__)

@signup_bp.route('/signup', methods=['POST'])
@swag_from('../../docs/signup.yml')  
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    nickname = data.get('nickname', '')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password, nickname=nickname, streak=0)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201
