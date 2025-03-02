from flask import Blueprint, render_template, request, jsonify
import requests

telnet_bp = Blueprint("telnet", __name__)
BASE_URL = "http://localhost:5004"

@telnet_bp.route("/telnet")
def telnet_interface():
    return render_template("telnet.html")

@telnet_bp.route("/telnet/login", methods=["POST"])
def telnet_login():
    data = request.json
    response = requests.post(f"{BASE_URL}/api/telnet/login", json=data)
    return jsonify(response.json())

@telnet_bp.route("/telnet/command", methods=["POST"])
def telnet_command():
    data = request.json
    response = requests.post(f"{BASE_URL}/api/telnet/command", json=data)
    return jsonify(response.json())

@telnet_bp.route("/telnet/logs", methods=["GET"])
def telnet_logs():
    response = requests.get(f"{BASE_URL}/api/telnet/logs")
    return jsonify(response.json())