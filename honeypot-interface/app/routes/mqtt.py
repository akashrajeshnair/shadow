from flask import Blueprint, render_template, request, jsonify, Response
import requests

mqtt_bp = Blueprint("mqtt", __name__)
BASE_URL = "http://localhost:5002"

@mqtt_bp.route("/mqtt")
def mqtt_index():
    return render_template("mqtt.html")

@mqtt_bp.route("/mqtt/connect", methods=["POST"])
def mqtt_connect():
    response = requests.post(f"{BASE_URL}/api/mqtt/connect")
    return jsonify(response.json())

@mqtt_bp.route("/mqtt/message", methods=["POST"])
def mqtt_message():
    data = request.json
    response = requests.post(f"{BASE_URL}/api/mqtt/message", json=data)
    return jsonify(response.json())

@mqtt_bp.route("/mqtt/device/<device_name>", methods=["POST"])
def mqtt_device(device_name):
    data = request.json
    response = requests.post(f"{BASE_URL}/api/mqtt/device/{device_name}", json=data)
    return jsonify(response.json())
