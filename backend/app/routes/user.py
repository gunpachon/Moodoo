from flask import Blueprint, request, jsonify
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from app.utils.models import User

user_bp = Blueprint('user', __name__)
@user_bp.route('/get_user', methods=['GET'])
@jwt_required()
@swag_from('../../docs/get_user.yml')
def get_user():
      user_id = get_jwt_identity()
      user = User.query.get(user_id)
      if user is None:
            return jsonify({"message": "User not found"}), 404

      user_data = {
            "id": user.id,
            "username": user.username,
            "nickname": user.nickname,
            "streak": user.streak,
            "created_at": user.created_at
      }

      return jsonify(user_data), 200



@user_bp.route('/update_user', methods=['PUT'])
@jwt_required()
@swag_from('../../docs/update_user.yml')
def update_user():
      data = request.get_json()
      user_id = get_jwt_identity()

      user = User.query.get(user_id)
      if not user:
            return jsonify({"message": "User not found"}), 404

      if 'nickname' in data:
            user.nickname = data['nickname']

      try:
            db.session.commit()
      except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error updating nickname: {str(e)}"}), 500

      return jsonify({
            "message": "Nickname updated successfully",
            "nickname": user.nickname,
      }), 200