from flask import Flask, request, jsonify
import time
import threading
from logger import log_attack
from devices import handle_device_command
from camera import camera_bp

app = Flask(__name__)

# Fake MQTT Broker
MQTT_BROKER_HOST = "0.0.0.0"
MQTT_BROKER_PORT = 1883  # This is just a placeholder, not an actual MQTT server

attacker_sessions = {}

def log_attack(attacker_ip, attack_type, details):
    """Log attacker interactions with the fake MQTT service."""
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    log_entry = {
        "timestamp": timestamp,
        "attacker_ip": attacker_ip,
        "attack_type": attack_type,
        "details": details
    }
    print(f"[LOG] {log_entry}")  # This will later be written to a real database or file

app.register_blueprint(camera_bp)

@app.route("/api/mqtt/connect", methods=["POST"])
def fake_mqtt_connect():
    """Simulate an attacker connecting to the fake MQTT broker."""
    attacker_ip = request.remote_addr
    print(f"[+] New MQTT connection: {attacker_ip}")
    
    # Store session data
    attacker_sessions[attacker_ip] = time.time()
    
    # Log the attack
    log_attack(attacker_ip, "MQTT_CONNECT", {"status": "Connected"})

    return jsonify({"status": "success", "message": "Connected to fake MQTT broker"})


@app.route("/api/mqtt/message", methods=["POST"])
def fake_mqtt_message():
    """Simulate receiving an MQTT message from an attacker."""
    attacker_ip = request.remote_addr
    data = request.json
    topic = data.get("topic", "unknown")
    payload = data.get("payload", "empty")

    print(f"[ALERT] MQTT Attack Detected: {attacker_ip} -> {topic}: {payload}")

    # Log the attack
    log_attack(attacker_ip, "MQTT_MESSAGE", {"topic": topic, "payload": payload})

    return jsonify({"status": "success", "message": "Fake MQTT message received"})

@app.route("/api/mqtt/device/<device_name>", methods=["POST"])
def fake_mqtt_device(device_name):
    data = request.json
    attacker_ip = request.remote_addr

    response = handle_device_command(device_name, data)

    log_attack(attacker_ip, "MQTT_DEVICE_ACCESS", {"device": device_name, "command": data})

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
