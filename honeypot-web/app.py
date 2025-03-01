from flask import Flask, redirect, url_for
from routes.routes import auth_bp, admin_bp, api_bp, search_bp, upload_bp
from db.db import db
import os
import logging

# Initialize Flask app
app = Flask(__name__)

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Configure logging
logging.basicConfig(
    filename="logs/server.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

logging.info("Starting Honeypot Web Server...")

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

if __name__ == "__main__":
    print("🚀 Honeypot Web Server is running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
