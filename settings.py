import tempfile
import os


db_file = tempfile.NamedTemporaryFile()


class Config(object):
    SECRET_KEY = b'\x01\x86\x13Ih\xbb\x0c<r\xb1S\x0e\x80\xd7\xf3\xc0\xa7\xcf\x8d[\x81\xa3\xed'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class ProdConfig(Config):
    ENV = 'Prod'

    CACHE_TYPE = 'simple'


class DevConfig(Config):
    ENV = 'Dev'
    DEBUG = True
    DEBUG_TB_INTERCEPT_REDIRECTS = False

    CACHE_TYPE = 'null'
    ASSETS_DEBUG = True
