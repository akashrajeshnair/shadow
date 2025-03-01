from flask import Blueprint, request, jsonify
from database import logs_collection
from logger import log_event
import datetime

network_bp = Blueprint("network", __name__)

@network_bp.route("/api/network/config", methods=["GET"])
def get_network_config():
    fake_config = {
        "hostname": "Router@SmartHome",
        "ip": "192.168.1.1",
        "subnet_mask": "255.255.255.0",
        "gateway": "192.168.1.254",
        "dns": ["8.8.8.8", "8.8.4.4"]
    }
    log_event(f"Accessed network config: {fake_config}")
    
    logs_collection.insert_one({
        "timestamp": datetime.datetime.utcnow(),
        "device": "Router",
        "ip": request.remote_addr,
        "command": "GET /api/network/config",
        "data": None,
        "response": fake_config
    })
    
    return jsonify(fake_config)
