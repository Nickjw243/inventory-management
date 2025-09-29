from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config['JWT_SECRET_KEY'] = 'example_will_change'


metadata = MetaData()
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)

CORS(app)