from app import create_app, db
from app.utils.models import Mood
from datetime import datetime, timedelta, time
import random

app = create_app()

tags_list = ["Happy", "Stress", "Anxious", "Excited", "Bored", "Passionate", "Relaxed", "Angry", "Embarrassed", "Calm", "Lonely", "Indifferent"]
impact_list = ["Hobbies", "Health", "Fitness", "Spirituality", "Family", "Friends", "Partner", "Dating", "Work", "Travel", "Education", "Weather", "Money"]
notes_list = [
    "Had a great day!",
    "Feeling overwhelmed.",
    "Just another normal day.",
    "Made good progress in studies.",
    "Spent time with friends.",
    "Slept well and exercised.",
    "Too much screen time today.",
    "Felt motivated.",
    "Tired but proud.",
    "Busy but fulfilling day."
]

start_date = datetime(2024, 12, 1)
dates = random.sample([start_date + timedelta(days=i) for i in range(30)], 20)

def random_time():
    hour = random.randint(6, 22)
    minute = random.randint(0, 59)
    return time(hour, minute)

def random_keywords(options):
    return random.sample(options, random.randint(3, 4))  # now returns a real list

mood_entries = [
    Mood(
        user_id=5,
        mood_level=random.randint(1, 5),
        tags=random_keywords(tags_list),     # ✅ now a list
        impact=random_keywords(impact_list), # ✅ now a list
        note=random.choice(notes_list),
        date=date.date(),
        time=random_time(),
        created_at=date
    )
    for date in dates
]

with app.app_context():
    db.session.add_all(mood_entries)
    db.session.commit()
    print("✅ 20 mood entries added with list-style tags and impacts.")
