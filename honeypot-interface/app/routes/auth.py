from flask import Blueprint, request, jsonify, session
import uuid
from app.models.honeypot import HoneypotLog

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    """Fake login that accepts any credentials."""
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username and password:
        session["user_id"] = str(uuid.uuid4())  # Fake session ID
        session["username"] = username
        session["ip"] = request.remote_addr

        # Log this as a potential attack
        HoneypotLog.log_attack(
            ip=request.remote_addr,
            endpoint="/api/auth/login",
            request_data={"username": username},
            attack_type="Brute Force Login",
            protocol="HTTP",
            status="Logged"
        )

        return jsonify({"message": "Login successful", "redirect": "/admin/dashboard"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Fake logout that just clears session data."""
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/check_session", methods=["GET"])
def check_session():
    """Check if a user is logged in (always true in our honeypot)."""
    if "user_id" in session:
        return jsonify({"logged_in": True, "username": session.get("username")}), 200
    return jsonify({"logged_in": False}), 401
