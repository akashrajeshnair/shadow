import requests
import time
from flask import Blueprint, request, jsonify, session

iot_bp = Blueprint("iot", __name__)

# Define emulator API endpoints (Docker service names)
EMULATORS = {
    "http": "http://http-emulator:5001",
    "mqtt": "http://mqtt-emulator:5002",
    "telnet": "http://telnet-emulator:5003",
    "ssh": "http://ssh-emulator:5004"
}

FAKE_IOT_DEVICES = {
    "camera": {"status": "online", "stream_url": "/api/devices/camera/stream"},
    "light": {"status": "off", "brightness": 75},
    "switch": {"status": "on"},
    "thermostat": {"temperature": 22, "mode": "auto"},
}

# Track active attack sessions
active_sessions = {}


@iot_bp.route("/camera/stream", methods=["GET"])
def camera_stream():
    """Fake CCTV video stream (loops a fake video)."""
    attacker_ip = request.remote_addr
    active_sessions[attacker_ip] = time.time()

    return requests.get(f"{EMULATORS['http']}/camera/stream").content, 200, {
        "Content-Type": "multipart/x-mixed-replace; boundary=frame"
    }


@iot_bp.route("/<device_name>/control", methods=["POST"])
def control_device(device_name):
    """Route IoT attack attempts to the correct emulator."""
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    protocol = data.get("protocol", "http").lower()
    
    if protocol not in EMULATORS:
        return jsonify({"error": "Unsupported protocol"}), 400

    # Forward the attack request to the correct emulator
    emulator_url = f"{EMULATORS[protocol]}/{device_name}/control"
    response = requests.post(emulator_url, json=data)

    return jsonify(response.json()), response.status_code
