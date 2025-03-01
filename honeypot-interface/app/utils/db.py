from flask_pymongo import PyMongo

mongo = PyMongo()

def initialize_db(app):
    """Initialize MongoDB with Flask app."""
    mongo.init_app(app)
