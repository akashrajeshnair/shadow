from flask import Flask
from app.routes.admin import admin_bp
from app.routes.auth import auth_bp
from app.routes.iot import iot_bp
from app.routes.logs import logs_bp
from app.routes.sandbox import sandbox_bp
from app.utils.db import initialize_db
import os

app = Flask(__name__)

# Load Configurations
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/honeypot")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey")

# Initialize Database
initialize_db(app)

# Register Blueprints (Modular Routes)
app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(iot_bp, url_prefix="/api/devices")
app.register_blueprint(logs_bp, url_prefix="/api/logs")
app.register_blueprint(sandbox_bp, url_prefix="/api/sandbox")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
