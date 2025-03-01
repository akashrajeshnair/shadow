from flask import Blueprint, request, jsonify
import datetime
import logging
from database import logs_collection

telnet_bp = Blueprint("telnet", __name__)

# Fake commands and their responses
COMMAND_RESPONSES = {
    "help": "Available commands: whoami, uname, ifconfig, exit",
    "whoami": "root",
    "uname": "Linux fake-router 4.19.0-16-amd64 #1 SMP Debian",
    "ifconfig": "eth0: inet 192.168.1.1 netmask 255.255.255.0",
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
    logs = list(logs_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    return jsonify(logs)
