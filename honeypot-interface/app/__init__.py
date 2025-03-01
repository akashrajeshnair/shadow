from flask import Flask, render_template
from app.routes.ssh import ssh_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(ssh_bp)

    @app.route("/")
    def index():
        return render_template("index.html")

    return app
