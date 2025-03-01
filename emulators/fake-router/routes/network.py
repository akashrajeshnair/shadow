from flask import Blueprint, request, jsonify
from logger import log_request

network_bp = Blueprint("network", __name__)

@network_bp.route("/api/network/configure", methods=["POST"])
def configure_network():
    data = request.json
    fake_response = {"message": "Network settings updated successfully"}

    log_request(
        command="network_configure",
        data=data,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)

@network_bp.route("/api/network/status", methods=["GET"])
def network_status():
    fake_response = {"status": "Connected", "signal_strength": "Excellent"}

    log_request(
        command="network_status",
        data=None,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)
