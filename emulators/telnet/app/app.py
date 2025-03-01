from flask import Flask
from routes.telnet import telnet_bp

app = Flask(__name__)

# Register Blueprint
app.register_blueprint(telnet_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
