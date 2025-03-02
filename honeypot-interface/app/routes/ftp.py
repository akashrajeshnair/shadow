from flask import Blueprint, render_template, request, jsonify
import requests

ftp_bp = Blueprint("ftp", __name__)
BASE_URL = "http://localhost:5005"

@ftp_bp.route("/ftp")
def ftp_index():
    return render_template("ftp.html")

@ftp_bp.route("/ftp/command", methods=["POST"])
def ftp_command():
    data = request.json
    response = requests.post(f"{BASE_URL}/ftp/command", json=data)
    return jsonify(response.json())

@ftp_bp.route("/ftp/upload", methods=["POST"])
def ftp_upload():
    data = request.json
    response = requests.post(f"{BASE_URL}/ftp/upload", json=data)
    return jsonify(response.json())

@ftp_bp.route("/ftp/list", methods=["GET"])
def ftp_list():
    response = requests.get(f"{BASE_URL}/ftp/list")
    return jsonify(response.json())

@ftp_bp.route("/ftp/download", methods=["POST"])
def ftp_download():
    data = request.json
    response = requests.post(f"{BASE_URL}/ftp/download", json=data)
    return jsonify(response.json())

@ftp_bp.route("/ftp/delete", methods=["POST"])
def ftp_delete():
    data = request.json
    response = requests.post(f"{BASE_URL}/ftp/delete", json=data)
    return jsonify(response.json())