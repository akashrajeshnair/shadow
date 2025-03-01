from flask import Flask
from routes.ftp import ftp_bp

app = Flask(__name__)
app.register_blueprint(ftp_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
