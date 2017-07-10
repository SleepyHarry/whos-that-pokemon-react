import os

from flask import Flask


app = Flask(__name__)


ENV = os.environ.get('ENV', 'Dev')


if __name__ == '__main__':
    app.run(debug=ENV == 'Dev')
