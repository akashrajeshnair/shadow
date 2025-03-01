from flask import render_template, request
from routes.routes import upload_bp
from utils.logger import log_attack

@upload_bp.route("/", methods=["GET", "POST"])
def fake_upload():
    if request.method == "POST":
        log_attack(request, {"file_upload": request.files.get("file").filename})
        return render_template("upload.html", message="File upload failed!")

    return render_template("upload.html")
