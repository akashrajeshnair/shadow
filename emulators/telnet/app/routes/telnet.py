from flask import Blueprint, request, jsonify
import datetime
import logging
from database import logs_collection

telnet_bp = Blueprint("telnet", __name__)

# Fake commands and their responses
COMMAND_RESPONSES = {
    "help": "Available commands: open, close, send, quit",
    "status": "Connection status: open",
    "open": "Opening connection to host...",
    "close": "Closing connection...",
    "send": "Sending data...",
    "quit": "Exiting telnet session...",
}

LOG_RESPONSES = {
    1: {"timestamp": "2025-03-02T12:00:00Z", "device": "Telnet-192.168.1.2", "command": "LOGIN", "response": "Login Successful"},
    2: {"timestamp": "2025-03-02T12:05:00Z", "device": "Telnet-192.168.1.3", "command": "help", "response": "Available commands: open, close, send, quit"},
}

@telnet_bp.route("/api/telnet/login", methods=["POST"])
def login():
    """ Simulates a Telnet login """
    data = request.json
    ip = request.remote_addr  # Captures attacker's IP
    username = data.get("username", "unknown")
    password = data.get("password", "unknown")
    
    logging.info(f"Telnet Login Attempt: {ip} → {username}/{password}")
    
    logs_collection.insert_one({
        "timestamp": datetime.datetime.utcnow(),
        "device": f"Telnet-{ip}",
        "ip": ip,
        "command": "LOGIN",
        "data": {"username": username, "password": password},
        "response": "Login Successful"
    })
    
    return jsonify({"message": "Login successful", "ip": ip})


@telnet_bp.route("/api/telnet/command", methods=["POST"])
def execute_command():
    """ Simulates command execution """
    data = request.json
    ip = request.remote_addr
    command = data.get("command", "")
    
    response = COMMAND_RESPONSES.get(command, f"{command}: command not found")
    
    logs_collection.insert_one({
        "timestamp": datetime.datetime.utcnow(),
        "device": f"Telnet-{ip}",
        "ip": ip,
        "command": command,
        "data": None,
        "response": response
    })
    
    return jsonify({"command": command, "response": response})


@telnet_bp.route("/api/telnet/logs", methods=["GET"])
def get_logs():
    """ Retrieve logged commands """
    # Add a new fake log entry each time this endpoint is queried
    new_log_id = len(LOG_RESPONSES) + 1
    new_log = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "device": f"Telnet-{new_log_id}",
        "command": "QUERY_LOGS",
        "response": "Logs retrieved successfully"
    }
    LOG_RESPONSES[new_log_id] = new_log
    
    # Retrieve logs from the database
    logs = list(logs_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    
    # Combine database logs with fake logs
    combined_logs = logs + list(LOG_RESPONSES.values())
    
    return jsonify(combined_logs)