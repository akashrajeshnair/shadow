from flask import Blueprint, request, jsonify
from database import logs_collection
import datetime
import logging

firewall_bp = Blueprint("firewall", __name__, url_prefix="/firewall")

# Fake firewall rules storage
fake_firewall_rules = [
    {"id": 1, "rule": "Allow all traffic from 192.168.1.0/24"},
    {"id": 2, "rule": "Block all incoming traffic on port 22"},
    {"id": 3, "rule": "Allow HTTP traffic on port 80"},
]

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

# 📌 List all firewall rules
@firewall_bp.route("/rules", methods=["GET"])
def get_firewall_rules():
    attacker_ip = request.remote_addr
    log_request(attacker_ip, "GET /firewall/rules", None)

    return jsonify({"firewall_rules": fake_firewall_rules}), 200


# 📌 Add a new firewall rule (Fake Implementation)
@firewall_bp.route("/rules", methods=["POST"])
def add_firewall_rule():
    attacker_ip = request.remote_addr
    data = request.json

    if "rule" not in data:
        return jsonify({"error": "Missing 'rule' field"}), 400

    rule_id = len(fake_firewall_rules) + 1
    new_rule = {"id": rule_id, "rule": data["rule"]}
    fake_firewall_rules.append(new_rule)

    log_request(attacker_ip, "POST /firewall/rules", data)

    return jsonify({"message": "Firewall rule added", "rule": new_rule}), 201


# 📌 Delete a firewall rule (Fake Implementation)
@firewall_bp.route("/rules/<int:rule_id>", methods=["DELETE"])
def delete_firewall_rule(rule_id):
    attacker_ip = request.remote_addr
    rule = next((r for r in fake_firewall_rules if r["id"] == rule_id), None)

    if not rule:
        return jsonify({"error": "Rule not found"}), 404

    fake_firewall_rules.remove(rule)
    log_request(attacker_ip, f"DELETE /firewall/rules/{rule_id}", None)

    return jsonify({"message": "Firewall rule deleted", "rule_id": rule_id}), 200


# 📌 Log attacker's actions
def log_request(ip, command, data):
    log_entry = {
        "timestamp": datetime.datetime.utcnow(),
        "ip": ip,
        "command": command,
        "data": data,
        "response": "Fake firewall rule interaction",
    }
    logs_collection.insert_one(log_entry)
    logging.info(f"Firewall Access - {ip} - {command} - {data}")
