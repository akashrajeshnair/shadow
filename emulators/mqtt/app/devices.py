import random
import time
from flask import request
from logger import log_attack

FAKE_DEVICES = {
    "camera": {"status": "online", "stream_url": "/api/mqtt/device/camera/stream"},
    "light": {"status": "off", "brightness": 50},
    "thermostat": {"temperature": 22, "mode": "auto"},
    "door_lock": {"status": "locked"},
    "smart_plug": {"status": "off", "power_usage": "0W"},
    "motion_sensor": {"motion_detected": False, "last_trigger": None},
}

def handle_device_command(device_name, data):
    """Simulate realistic IoT device responses and log attacker actions."""
    ip_address = request.remote_addr  # Get attacker's IP
    command = data.get("command", "")

    if device_name not in FAKE_DEVICES:
        response = {"error": "Unknown device"}
        log_attack(ip_address, device_name, command, data, response)
        return response

    # Process Commands
    if device_name == "camera":
        response = {"status": "success", "stream_url": FAKE_DEVICES["camera"]["stream_url"]}

    elif device_name == "light":
        if command == "on":
            FAKE_DEVICES["light"]["status"] = "on"
        elif command == "off":
            FAKE_DEVICES["light"]["status"] = "off"
        elif "brightness" in data:
            FAKE_DEVICES["light"]["brightness"] = min(max(int(data["brightness"]), 0), 100)
        response = {"status": "success", "device_state": FAKE_DEVICES["light"]}

    elif device_name == "thermostat":
        if "temperature" in data:
            FAKE_DEVICES["thermostat"]["temperature"] = min(max(int(data["temperature"]), 15), 30)
        if "mode" in data:
            FAKE_DEVICES["thermostat"]["mode"] = data["mode"]
        response = {"status": "success", "device_state": FAKE_DEVICES["thermostat"]}

    elif device_name == "door_lock":
        if command == "unlock":
            FAKE_DEVICES["door_lock"]["status"] = "unlocked"
        elif command == "lock":
            FAKE_DEVICES["door_lock"]["status"] = "locked"
        response = {"status": "success", "device_state": FAKE_DEVICES["door_lock"]}

    elif device_name == "smart_plug":
        if command == "on":
            FAKE_DEVICES["smart_plug"]["status"] = "on"
            FAKE_DEVICES["smart_plug"]["power_usage"] = f"{random.randint(10, 100)}W"
        elif command == "off":
            FAKE_DEVICES["smart_plug"]["status"] = "off"
            FAKE_DEVICES["smart_plug"]["power_usage"] = "0W"
        response = {"status": "success", "device_state": FAKE_DEVICES["smart_plug"]}

    elif device_name == "motion_sensor":
        if command == "trigger":
            FAKE_DEVICES["motion_sensor"]["motion_detected"] = True
            FAKE_DEVICES["motion_sensor"]["last_trigger"] = time.strftime("%Y-%m-%d %H:%M:%S")
        elif command == "reset":
            FAKE_DEVICES["motion_sensor"]["motion_detected"] = False
        response = {"status": "success", "device_state": FAKE_DEVICES["motion_sensor"]}

    else:
        response = {"error": "Invalid command"}

    # Log the attack
    log_attack(ip_address, device_name, command, data, response)
    
    return response
