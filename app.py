import os

from flask import Flask, render_template, jsonify

from models import db, Leaderboard

ENV = os.environ.get('ENV', 'Dev')

if ENV == 'Dev':
    app = Flask(
        __name__,
        template_folder='public',
    )
elif ENV == 'Prod':
    app = Flask(
        __name__,
        static_folder='build', static_url_path='',
        template_folder='build',
    )

# noinspection PyUnboundLocalVariable
app.config.from_object(f'settings.{ENV}Config')
db.init_app(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/leaderboard/')
def get_leaderboard():
    leaderboard = Leaderboard.query.order_by(
        Leaderboard.score.desc()
    ).limit(10)

    return jsonify([
        {
            k: getattr(entry, k)
            for k in Leaderboard.__table__.columns.keys()
        }
        for entry in leaderboard
    ])


if __name__ == '__main__':
    app.run(debug=ENV == 'Dev')
