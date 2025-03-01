from flask import Blueprint, request, jsonify
from logger import log_request
from database import firewall_collection

firewall_bp = Blueprint("firewall", __name__)

@firewall_bp.route("/api/firewall/rules", methods=["POST"])
def update_firewall_rules():
    data = request.json
    firewall_collection.insert_one(data)  # Store fake firewall rules
    fake_response = {"message": "Firewall rules updated"}

    log_request(
        command="update_firewall",
        data=data,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)

@firewall_bp.route("/api/firewall/status", methods=["GET"])
def firewall_status():
    fake_response = {"firewall": "Enabled", "blocked_ips": ["192.168.1.200"]}

    log_request(
        command="firewall_status",
        data=None,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)
