from flask import Blueprint, request, jsonify
from logger import log_request

security_bp = Blueprint("security", __name__)

@security_bp.route("/api/security/configure", methods=["POST"])
def configure_security():
    data = request.json
    fake_response = {"message": "Security settings updated successfully"}

    log_request(
        command="security_configure",
        data=data,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)

@security_bp.route("/api/security/status", methods=["GET"])
def security_status():
    fake_response = {"firewall": "Enabled", "encryption": "WPA3"}

    log_request(
        command="security_status",
        data=None,
        response=fake_response,
        ip=request.remote_addr,
        device=request.headers.get("User-Agent", "Unknown Device")
    )

    return jsonify(fake_response)
