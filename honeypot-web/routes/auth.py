from flask import render_template, request
from routes import auth_bp
from utils.logger import log_login_attempt

@auth_bp.route("/login", methods=["GET", "POST"])
def fake_login():
    """
    Fake login page for attackers to target.
    """
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        log_login_attempt(request, username, password)

        return render_template("login.html", error="Invalid username or password.")

    return render_template("login.html")