from flask import Blueprint, request, jsonify, session
import uuid
from app.models.honeypot import HoneypotLog

admin_bp = Blueprint("admin", __name__)

# Fake credentials (accept any input)
FAKE_USERNAME = "admin"
FAKE_PASSWORD = "password"

@admin_bp.route("/login", methods=["POST"])
def login():
    """Fake login endpoint that accepts any username/password."""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username and password:
        session["user_id"] = str(uuid.uuid4())  # Fake session ID
        return jsonify({"message": "Login successful", "redirect": "/admin/dashboard"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@admin_bp.route("/dashboard", methods=["GET"])
def dashboard():
    """Fake admin dashboard."""
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    fake_dashboard_data = {
        "servers": ["Web Server 1", "Database Server", "IoT Hub"],
        "devices": ["Camera 1", "Smart Lock", "Thermostat"],
        "logs": "View system logs here."
    }
    return jsonify(fake_dashboard_data), 200


@admin_bp.route("/shutdown_server", methods=["POST"])
def shutdown_server():
    """Fake shutdown action - Logs attack attempt."""
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    HoneypotLog.log_attack(
        ip=request.remote_addr,
        endpoint="/admin/shutdown_server",
        request_data=request.json,
        attack_type="Admin Panel Abuse",
        protocol="HTTP",
        status="Logged"
    )
    return jsonify({"message": "Server shutting down..."}), 200
