from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from flasgger import swag_from
from app.utils.models import Mood
from datetime import datetime, timedelta

mood_bp = Blueprint('mood', __name__)
@mood_bp.route('/get_mood', methods=['GET'])
@jwt_required()
@swag_from('../../docs/get_mood.yml')
def get_mood():
      date_str = request.args.get('date')  # Expecting ?date=YYYY-MM-DD
      if not date_str:
            return jsonify({'message': 'Date query parameter is required'}), 400

      try:
            query_date = datetime.strptime(date_str, '%Y-%m-%d').date()
      except ValueError:
            return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

      user_id = get_jwt_identity() 
      moods = Mood.query.filter_by(user_id=user_id, date=query_date).all()

      result = []
      for mood in moods:
            result.append({
                  'id': mood.id,
                  'user_id': mood.user_id,
                  'mood_level': mood.mood_level,
                  'tags': mood.tags if mood.tags else [], 
                  'impact': mood.impact if mood.impact else [],
                  'note': mood.note,
                  'date': mood.date.isoformat(),
                  'time': mood.time.isoformat(),
                  'created_at': mood.created_at.isoformat()
                  })

      return jsonify(result), 200

@mood_bp.route('/get_moods_byMonth', methods=['GET'])
@jwt_required()
@swag_from('../../docs/get_moods_byMonth.yml')
def get_moods_byMonth():
      year = request.args.get('year', type=int) #expecting ?year=YYYY&month=MM
      month = request.args.get('month', type=int)
    
      if not year or not month:
            return jsonify({'message': 'Year and month query parameters are required'}), 400

      if month < 1 or month > 12:
            return jsonify({'message': 'Invalid month. It should be between 1 and 12.'}), 400

      if year < 1:
            return jsonify({'message': 'Invalid year. It should be a positive integer.'}), 400

      # Get the first and last date of the given month and year
      start_date = datetime(year, month, 1)
      end_date = (start_date.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)

      user_id = get_jwt_identity()
      moods = Mood.query.filter(
            Mood.user_id == user_id,
            Mood.date >= start_date.date(),
            Mood.date <= end_date.date()
      ).all()
      if not moods:
            return jsonify({'message': 'No moods found for the specified month'}), 404

      result = []
      for mood in moods:
            result.append({
                  'id': mood.id,
                  'user_id': mood.user_id,
                  'mood_level': mood.mood_level,
                  'tags': mood.tags if mood.tags else [],
                  'impact': mood.impact if mood.impact else [],
                  'note': mood.note,
                  'date': mood.date.isoformat(),
                  'time': mood.time.isoformat(),
                  'created_at': mood.created_at.isoformat()
            })
      return jsonify(result), 200
      
from app.utils.models import User
def update_user_streak(user_id):
       # Get the latest mood log for the user
      last_mood = Mood.query.filter_by(user_id=user_id).order_by(Mood.date.desc()).first()
      if last_mood:
            last_mood_date = last_mood.date
            today = datetime.today().date()

            # Check if the last mood log is from the previous day
            if last_mood_date == today - timedelta(days=1):
                  # Increment streak
                  user = User.query.get(user_id)
                  user.streak += 1
            elif last_mood_date != today:
                  # Reset streak if there's a break in the consecutive days
                  user = User.query.get(user_id)
                  user.streak = 1
            else:
                  # If the user logged today, do nothing to streak
                  pass
      else:
            # If there is no mood log, initialize streak as 1
            user = User.query.get(user_id)
            user.streak = 1

      # Commit the updated streak value to the database
      try:
            db.session.commit()
      except Exception as e:
            db.session.rollback()
            print(f"Error updating streak: {str(e)}")
      
@mood_bp.route('/add_mood', methods=['POST'])
@jwt_required()
@swag_from('../../docs/add_mood.yml')
def add_mood():
      data = request.get_json()

      mood_level = data.get('mood_level')
      tags = data.get('tags')
      impact = data.get('impact')
      note = data.get('note',"")
      date = data.get('date')
      time = data.get('time')

      # Validate required fields
      if mood_level is None or tags is None or impact is None:
            return jsonify({"message": "Mood level, tags, and impact are required"}), 400
      if not (1 <= mood_level <= 5):
            return jsonify({"message": "Mood level must be between 1 and 5"}), 400
      if date:
            try:
                  mood_date = datetime.strptime(date, '%Y-%m-%d').date()
                  if mood_date > datetime.today().date():
                        return jsonify({"message": "You cannot log a mood for a future date"}), 400
            except ValueError:
                  return jsonify({"message": "Invalid date format. Use YYYY-MM-DD"}), 400
      else:
            return jsonify({"message": "Date is required"}), 400
            
      user_id = get_jwt_identity()
      new_mood = Mood(
            user_id=user_id,
            mood_level=mood_level,
            tags=tags,
            impact=impact,
            note=note,
            date=date,
            time=time
      )

      try:
            update_user_streak(user_id)
            db.session.add(new_mood)
            db.session.commit()
      except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Error adding mood: {str(e)}'}), 500

      return jsonify({
            'message': 'Mood added successfully',
            'id': new_mood.id,
            'user_id': new_mood.user_id,
            'mood_level': new_mood.mood_level,
            'tags': new_mood.tags,
            'impact': new_mood.impact,
            'note': new_mood.note,
            'date': new_mood.date.isoformat(),
            'time': new_mood.time.isoformat(),
            'created_at': new_mood.created_at.isoformat(),
            'streak': User.query.get(user_id).streak
      }), 201
      
@mood_bp.route('/update_mood', methods=['PUT'])
@jwt_required()
@swag_from('../../docs/update_mood.yml')
def update_mood():
      mood_id = request.args.get('mood_id', type=int)
      if not mood_id:
            return jsonify({'message': 'Mood ID is required'}), 400

      data = request.get_json()

      # Validate required fields for update
      mood_level = data.get('mood_level', None)
      tags = data.get('tags', None)
      impact = data.get('impact', None)
      note = data.get('note', None)
      date = data.get('date', None)
      time = data.get('time', None)

       # Fetch the mood from the database
      mood = Mood.query.filter_by(id=mood_id).first()

      if not mood:
            return jsonify({'message': 'Mood not found'}), 404
      
      user_id = get_jwt_identity()
      if mood.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403

      if mood_level is not None:
            if not (1 <= mood_level <= 5):
                  return jsonify({"message": "Mood level must be between 1 and 5"}), 400
            mood.mood_level = mood_level
      if tags is not None: 
            mood.tags = tags if isinstance(tags, list) else mood.tags
      if impact is not None:
            mood.impact = impact if isinstance(impact, list) else mood.impact
      if note is not None:
            mood.note = note
      if date is not None:
            try:
                  mood.date = datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                  return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
      if time is not None:
            try:
                  mood.time = datetime.strptime(time, '%H:%M').time()
            except ValueError:
                  return jsonify({'message': 'Invalid time format. Use HH:MM'}), 400

      # Commit the changes to the database
      try:
            db.session.commit()
      except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Error updating mood: {str(e)}'}), 500

      return jsonify({
            'message': 'Mood updated successfully',
            'id': mood.id,
            'user_id': mood.user_id,
            'mood_level': mood.mood_level,
            'tags': mood.tags,
            'impact': mood.impact,
            'note': mood.note,
            'date': mood.date.isoformat(),
            'time': mood.time.isoformat(),
            'created_at': mood.created_at.isoformat()
      }), 200