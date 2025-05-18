from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.utils.models import Challenge
from datetime import date as dt_date
from flasgger import swag_from

challenge_bp = Blueprint('challenge', __name__)
@challenge_bp.route('/add_challenge', methods=['POST'])
@jwt_required()
@swag_from('../../docs/add_challenge.yml')
def create_challenge():
  data = request.get_json()
  user_id = get_jwt_identity()
  
  name = data.get('name')
  date_str = data.get('date')
  is_custom = data.get('is_custom', True)
  
  if not date_str:
    date = dt_date.today()
  
  if not name or not date_str:
    return jsonify({"message": "Name and date are required"}), 400
  
  try:
    date = datetime.strptime(date_str, "%Y-%m-%d").date()
  except ValueError:
    return jsonify({"message": "Invalid date format (YYYY-MM-DD)"}), 400
  
  challenge = Challenge(
    user_id=user_id,
    name=name,
    date=date,
    is_custom=is_custom,
    completed=False
  )

  db.session.add(challenge)
  db.session.commit()
  return jsonify({"message": "Challenge created successfully"}), 201


@challenge_bp.route('/get_challenge', methods=['GET'])
@jwt_required()
@swag_from('../../docs/get_challenge.yml')
def get_challenge():
  date_str = request.args.get('date')

  if not date_str:
      return jsonify({'message': 'Date query parameter is required'}), 400

  try:
      query_date = datetime.strptime(date_str, '%Y-%m-%d').date()
  except ValueError:
      return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

  user_id = get_jwt_identity() 
  challenges = Challenge.query.filter_by(user_id=user_id, date=query_date).all()
  
  result = []
  for challenge in challenges:
      result.append({
        'id': challenge.id,
        'name': challenge.name,
        'date': challenge.date.isoformat(),
        'completed': challenge.completed,
        'created_at': challenge.created_at.isoformat()
        })

  return jsonify(result), 200


@challenge_bp.route('/update_challenge', methods=['PUT'])
@jwt_required()
@swag_from('../../docs/update_challenge.yml') 
def update_challenge():
    challenge_id = request.args.get('id', type=int)
    if not challenge_id:
        return jsonify({"message": "Challenge ID is required"}), 400
    
    data = request.get_json()
    completed = data.get('completed', True)

    user_id = get_jwt_identity()
    challenge = Challenge.query.filter_by(id=challenge_id, user_id=user_id).first()

    if not challenge:
        return jsonify({"message": "Challenge not found or not yours"}), 404

    challenge.completed = completed  # Mark as completed

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error updating challenge: {str(e)}"}), 500

    return jsonify({"message": "Challenge marked as completed"}), 200
  
@challenge_bp.route('/delete_challenge', methods=['DELETE'])
@jwt_required()
@swag_from('../../docs/delete_challenge.yml') 
def delete_challenge():
    challenge_id = request.args.get('id', type=int)
    if not challenge_id:
        return jsonify({"message": "Challenge ID is required"}), 400

    user_id = get_jwt_identity()
    challenge = Challenge.query.filter_by(id=challenge_id, user_id=user_id).first()

    if not challenge:
        return jsonify({"message": "Challenge not found or not yours"}), 404

    try:
        db.session.delete(challenge)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error deleting challenge: {str(e)}"}), 500

    return jsonify({"message": "Challenge deleted successfully"}), 200