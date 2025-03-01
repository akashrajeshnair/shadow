from flask import Flask
from routes.network import network_bp
from routes.security import security_bp
from routes.firewall import firewall_bp
from routes.devices import devices_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(network_bp)
app.register_blueprint(security_bp)
app.register_blueprint(firewall_bp)
app.register_blueprint(devices_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
