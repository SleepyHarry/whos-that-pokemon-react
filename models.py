from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Leaderboard(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    score = db.Column(db.Integer())
    initials = db.Column(db.String())
