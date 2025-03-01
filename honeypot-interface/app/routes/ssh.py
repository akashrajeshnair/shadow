from flask import Blueprint, render_template, request, jsonify
import requests

ssh_bp = Blueprint("ssh", __name__)

SSH_EMULATOR_URL = "http://localhost:5001/execute"  # Change if running on a different server

@ssh_bp.route("/ssh", methods=["GET"])
def ssh_page():
    return render_template("ssh.html")

@ssh_bp.route("/ssh/execute", methods=["POST"])
def execute_ssh_command():
    data = request.get_json()
    command = data.get("command", "").strip()

    if not command:
        return jsonify({"error": "No command provided"}), 400

    try:
        response = requests.post(SSH_EMULATOR_URL, json={"command": command})
        return response.json(), response.status_code
    except requests.exceptions.RequestException:
        return jsonify({"error": "Failed to connect to SSH remote"}), 500
