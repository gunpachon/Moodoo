from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from app.utils.models import User
from app import db
from flasgger import swag_from

login_bp = Blueprint('login', __name__)


@login_bp.route('/login', methods=['POST'])
@swag_from('../../docs/login.yml')
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid username or password"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200
