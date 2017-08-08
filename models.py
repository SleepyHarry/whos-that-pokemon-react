from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Leaderboard(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    generation = db.Column(db.Integer(), nullable=False)  # ∈ {1, 2, 3, 4, 5}

    score = db.Column(db.Integer(), nullable=False)
    initials = db.Column(db.String(), nullable=False)
