from flask import jsonify, request
from routes.routes import api_bp
from utils.logger import log_attack

@api_bp.route("/data", methods=["GET"])
def fake_api():
    log_attack(request)
    return jsonify({"status": "error", "message": "Unauthorized access!"})
