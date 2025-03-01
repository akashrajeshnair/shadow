from flask import Blueprint, request, jsonify
from database import logs_collection
from logger import log_event
import datetime

devices_bp = Blueprint("devices", __name__)

fake_devices = [
    {"device_id": "D001", "name": "Smart Bulb", "status": "online"},
    {"device_id": "D002", "name": "Smart Camera", "status": "offline"},
    {"device_id": "D003", "name": "Thermostat", "status": "online"},
]

@devices_bp.route("/api/devices", methods=["GET"])
def list_devices():
    log_event("Listed fake IoT devices")
    
    logs_collection.insert_one({
        "timestamp": datetime.datetime.utcnow(),
        "device": "Router",
        "ip": request.remote_addr,
        "command": "GET /api/devices",
        "data": None,
        "response": fake_devices
    })
    
    return jsonify(fake_devices)
