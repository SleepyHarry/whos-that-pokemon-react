import os

from flask import Flask, render_template


app = Flask(
    __name__,
    static_folder='build', static_url_path='',
    template_folder='build',
)


ENV = os.environ.get('ENV', 'Dev')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=ENV == 'Dev')
