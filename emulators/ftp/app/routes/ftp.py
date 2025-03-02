from flask import Blueprint, request, jsonify
from datetime import datetime
from database import logs_collection

ftp_bp = Blueprint("ftp", __name__)

FAKE_FTP_RESPONSES = {
    "USER": "331 User name okay, need password.",
    "PASS": "230 User logged in, proceed.",
    "LIST": "150 Here comes the directory listing.\n-rw-r--r-- 1 user user 1234 Jan 01 12:00 fake_file.txt",
    "RETR": "150 Opening binary mode data connection for fake_file.txt",
    "STOR": "226 File stored successfully.",
    "DELE": "250 File deleted successfully.",
    "MKD": "257 Directory created successfully.",
    "RMD": "250 Directory removed successfully.",
    "PWD": "257 \"/fake_directory\" is the current directory.",
    "CWD": "250 Directory successfully changed.",
    "PORT": "200 Command okay.",
    "PASV": "227 Entering Passive Mode (127,0,0,1,192,168).",
    "SYST": "215 UNIX Type: L8",
    "TYPE": "200 Type set to I (Binary Mode).",
    "QUIT": "221 Goodbye."
}

@ftp_bp.route("/ftp/command", methods=["POST"])
def handle_ftp_command():
    """ API endpoint to handle FTP commands """
    data = request.json
    ip = request.remote_addr
    device = data.get("device", "unknown")
    command = data.get("command", "").strip().upper()

    response = FAKE_FTP_RESPONSES.get(command, f"500 Unknown command: {command}")

    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": device,
        "ip": ip,
        "command": command,
        "data": data.get("data", ""),
        "response": response
    }
    
    logs_collection.insert_one(log_entry)

    return jsonify({"response": response})

@ftp_bp.route("/ftp/upload", methods=["POST"])
def upload_file():
    """ Simulate file upload """
    data = request.json
    filename = data.get("filename", "unknown")
    response = "226 File stored successfully."

    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": data.get("device", "unknown"),
        "ip": request.remote_addr,
        "command": "STOR",
        "filename": filename,
        "response": response
    }
    logs_collection.insert_one(log_entry)

    return jsonify({"message": response})

@ftp_bp.route("/ftp/list", methods=["GET"])
def list_files():
    """ Simulate listing files """
    fake_files = ["exploit.exe", "payload.zip", "rootkit.so"]
    return jsonify({"files": fake_files})

@ftp_bp.route("/ftp/download", methods=["POST"])
def download_file():
    """ Simulate downloading a file """
    data = request.json
    filename = data.get("filename", "unknown")
    response = f"150 Opening data connection for {filename}."

    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": data.get("device", "unknown"),
        "ip": request.remote_addr,
        "command": "RETR",
        "filename": filename,
        "response": response
    }
    logs_collection.insert_one(log_entry)

    return jsonify({"message": response})

@ftp_bp.route("/ftp/delete", methods=["POST"])
def delete_file():
    """ Simulate deleting a file """
    data = request.json
    filename = data.get("filename", "unknown")
    response = "250 File deleted successfully."

    log_entry = {
        "timestamp": datetime.utcnow(),
        "device": data.get("device", "unknown"),
        "ip": request.remote_addr,
        "command": "DELE",
        "filename": filename,
        "response": response
    }
    logs_collection.insert_one(log_entry)

    return jsonify({"message": response})
