import os

from flask import Flask, render_template, jsonify, request

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


@app.route('/api/leaderboard/', methods=['GET', 'POST'])
def leaderboard():
    if request.method == 'POST':
        score = request.json

        new_score = Leaderboard(
            generation=score['generation'],
            score=score['points'],
            initials=score['initials'],
        )

        try:
            db.session.add(new_score)
            db.session.commit()
        except:
            db.session.rollback()

            raise

    # return top 10 for each generation
    current_leaderboard = []
    for gen in range(1, 6):
        current_leaderboard.extend(
            Leaderboard.query.filter_by(generation=gen).order_by(
                Leaderboard.score.desc()
            ).limit(10)
        )

    json_leaderboard = [
        {
            k: getattr(entry, k)
            for k in Leaderboard.__table__.columns.keys()
        }
        for entry in current_leaderboard
    ]

    out = {
        'leaderboard': json_leaderboard,
    }

    try:
        # noinspection PyUnboundLocalVariable
        out['new_score'] = {
            k: getattr(new_score, k)
            for k in Leaderboard.__table__.columns.keys()
        }
    except NameError:
        pass

    return jsonify(out)


if __name__ == '__main__':
    app.run(debug=ENV == 'Dev')
