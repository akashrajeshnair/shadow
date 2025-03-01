from flask import Flask, redirect, url_for
from routes.routes import auth_bp
from routes.routes import admin_bp
from routes.routes import api_bp
from routes.routes import search_bp
from routes.routes import upload_bp
from db.db import db
import os

# Initialize Flask app
app = Flask(__name__)

# # Load configuration from config.py if needed
# app.config.from_pyfile('config.py')

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Register Blueprints (modular routes)
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(api_bp, url_prefix="/api")
app.register_blueprint(search_bp, url_prefix="/search")
app.register_blueprint(upload_bp, url_prefix="/upload")


@app.route("/")
def index():
    """Homepage redirects to fake login page."""
    return redirect(url_for("auth.fake_login"))
