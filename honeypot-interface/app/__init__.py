from flask import Flask, render_template
from app.routes.ssh import ssh_bp
from app.routes.router import router_bp
from app.routes.telnet import telnet_bp
from app.routes.ftp import ftp_bp
from app.routes.mqtt import mqtt_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(ssh_bp)
    app.register_blueprint(router_bp)
    app.register_blueprint(telnet_bp)
    app.register_blueprint(ftp_bp)
    app.register_blueprint(mqtt_bp)

    @app.route("/")
    def index():
        return render_template("index.html")

    return app
