from flask import Blueprint, jsonify
from database import devices_collection

devices_bp = Blueprint("devices", __name__)

@devices_bp.route("/api/devices", methods=["GET"])
def list_devices():
    fake_devices = [
        {"id": 1, "name": "Smart Light", "status": "Online"},
        {"id": 2, "name": "Smart Thermostat", "status": "Offline"},
        {"id": 3, "name": "Security Camera", "status": "Online"}
    ]
    devices_collection.insert_many(fake_devices)
    return jsonify(fake_devices)
