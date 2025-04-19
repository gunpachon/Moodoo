from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    nickname = db.Column(db.String(100))
    streak = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Relationship: 1 user -> many moods
    moods = db.relationship('Mood', backref='user', lazy=True)

    def __repr__(self):
        return f"<User {self.username}>"


class Mood(db.Model):
    __tablename__ = 'moods'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    mood_level = db.Column(db.Integer, nullable=False)  # 1–5 scale
    tags = db.Column(db.Text)                           # Comma-separated tags
    impact = db.Column(db.Text)                         # Comma-separated impacts
    note = db.Column(db.Text)                           # Optional journal entry

    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Mood {self.id} (User {self.user_id}) - Level {self.mood_level}>"


class Challenge(db.Model):
    __tablename__ = 'challenges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    name = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)  # 2025-04-20
    completed = db.Column(db.Boolean, default=False)
    is_custom = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Challenge {self.name} - {self.date}>'