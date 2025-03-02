from flask import Blueprint, render_template, request, jsonify
import requests

router_bp = Blueprint("router", __name__)
BASE_URL = "http://localhost:5003"

@router_bp.route("/router")
def index():
    devices_response = requests.get(f"{BASE_URL}/api/devices")
    devices = devices_response.json()

    firewall_response = requests.get(f"{BASE_URL}/firewall/rules")
    firewall_rules = firewall_response.json().get("firewall_rules", [])

    network_response = requests.get(f"{BASE_URL}/api/network/config")
    network_config = network_response.json()

    return render_template("router.html", devices=devices, firewall_rules=firewall_rules, network_config=network_config)

@router_bp.route("/security", methods=["POST"])
def security():
    data = request.json
    response = requests.post(f"{BASE_URL}/api/security/firewall", json=data)
    return jsonify(response.json())