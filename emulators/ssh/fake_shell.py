from logger import log_info

class FakeShell:
    def __init__(self):
        self.commands = {
            "ls": "Documents  Downloads  Pictures  Videos",
            "pwd": "/root",
            "whoami": "root",
            "exit": "Connection closed by remote host.",
        }

    def execute(self, command):
        log_info(f"Attacker command: {command}")
        return self.commands.get(command, f"bash: {command}: command not found")

fake_shell = FakeShell()
