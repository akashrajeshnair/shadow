import logging
import uuid
from pymongo import MongoClient
from flask import Flask, request
from scapy.all import getmacbyip

# Configure logging
logging.basicConfig(filename='honeypot.log', level=logging.INFO, format='%(asctime)s - %(message)s')

# MongoDB setup
MONGO_URI = "mongodb+srv://vvsl180504:shadow123@shadow.r9ixy.mongodb.net/?retryWrites=true&w=majority&appName=Shadow"
client = MongoClient(MONGO_URI)
db = client.honeypot
collection = db.commands

# Flask setup
app = Flask(__name__)

# Blacklist of dangerous commands
blacklist = {
    "whoami", "id", "uname", "cat", "rm", "wget", "curl", "nc", "python", "bash", "chmod"
}

def get_mac_address(ip_address):
    """Tries to get the MAC address of the attacker."""
    try:
        mac = getmacbyip(ip_address)
        return mac if mac else "Unknown"
    except Exception:
        return "Unknown"

class SSHCommandExecutionEmulator:
    def __init__(self):
        self.commands = {
            'ls': self.ls,
            'pwd': self.pwd,
            'echo': self.echo,
            'cat': self.cat,
            'whoami': self.whoami,
            'id': self.id,
            'uname': self.uname,
            'wget': self.blocked,
            'curl': self.blocked,
            'nc': self.blocked,
            'python': self.blocked,
            'bash': self.blocked,
            'chmod': self.blocked,
            'rm': self.rm,
        }

    def ls(self, *args):
        return "file1.txt\nfile2.txt\n"

    def pwd(self, *args):
        return "/home/user\n"

    def echo(self, *args):
        return ' '.join(args) + '\n'

    def cat(self, *args):
        if args:
            filename = args[0]
            if filename == "/etc/passwd":
                return "root:x:0:0:root:/root:/bin/bash\n"
            return f"Fake content of {filename}\n"
        return "cat: missing file operand\n"

    def whoami(self, *args):
        return "honeypot_user\n"

    def id(self, *args):
        return "uid=1000(honeypot_user) gid=1000(honeypot_user) groups=1000(honeypot_user)\n"

    def uname(self, *args):
        return "Linux honeypot 5.4.0-42-generic x86_64 GNU/Linux\n"

    def blocked(self, *args):
        return "Command not found\n"

    def rm(self, *args):
        if args and args[0] == "-rf" and args[1] == "/":
            return "rm: it is dangerous to operate recursively on '/'\n"
        return "rm: command not found\n"

    def execute(self, command, ip_address, mac_address):
        """Executes the command and logs it along with IP and MAC address."""
        logging.info(f"Executed command: {command} from IP: {ip_address}, MAC: {mac_address}")

        try:
            # Store in MongoDB
            collection.insert_one({"command": command, "ip_address": ip_address, "mac_address": mac_address})
        except Exception as e:
            logging.error(f"MongoDB Insert Error: {e}")

        # Check for blacklisted commands
        if command.strip().split()[0] in blacklist:
            logging.warning(f"Blacklisted command detected: {command} from IP: {ip_address}, MAC: {mac_address}")
            return "Honeypot trap activated!\n"

        parts = command.strip().split()
        cmd = parts[0]
        args = parts[1:]

        return self.commands.get(cmd, lambda *args: f"Command not found: {cmd}\n")(*args)

@app.route('/execute', methods=['POST'])
def execute_command():
    """Handles incoming command execution requests."""
    command = request.form.get('command', '').strip()
    
    if not command:
        return "Error: No command provided\n", 400

    ip_address = request.remote_addr
    mac_address = get_mac_address(ip_address)

    emulator = SSHCommandExecutionEmulator()
    result = emulator.execute(command, ip_address, mac_address)
    
    return result

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
