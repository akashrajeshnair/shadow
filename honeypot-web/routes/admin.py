from flask import render_template, request
from routes.routes import admin_bp
from utils.logger import log_attack

@admin_bp.route("/", methods=["GET"])
def fake_admin():
    log_attack(request)
    return render_template("dashboard.html")
