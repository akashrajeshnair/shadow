from flask import Blueprint, request, jsonify
from database import logs_collection
from logger import log_event
import datetime

security_bp = Blueprint("security", __name__)

@security_bp.route("/api/security/firewall", methods=["POST"])
def update_firewall():
    data = request.json
    log_event(f"Firewall settings changed: {data}")
    
    logs_collection.insert_one({
        "timestamp": datetime.datetime.utcnow(),
        "device": "Router",
        "ip": request.remote_addr,
        "command": "POST /api/security/firewall",
        "data": data,
        "response": "Firewall updated"
    })

    return jsonify({"message": "Firewall settings updated"}), 200
