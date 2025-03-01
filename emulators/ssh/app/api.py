from flask import Flask, request, jsonify
from fake_shell import fake_shell
from database import log_command

app = Flask(__name__)

@app.route("/execute", methods=["POST"])
def execute_command():
    data = request.get_json()
    command = data.get("command", "").strip()

    if not command:
        return jsonify({"error": "No command provided"}), 400

    response = fake_shell.execute(command)
    log_command(request.remote_addr, command)  # Logging via API
    return jsonify({"command": command, "response": response})

def start_api():
    app.run(host="0.0.0.0", port=5001, debug=True)
