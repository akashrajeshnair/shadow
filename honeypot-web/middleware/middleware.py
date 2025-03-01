import re
from flask import request, jsonify
from utils.logger import log_attack

# Fake system responses for detected commands
FAKE_RESPONSES = {
    "ls": "bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  tmp  usr  var",
    "cat /etc/passwd": """root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
user:x:1000:1000:user:/home/user:/bin/sh""",
    "rm -rf /": "Permission denied.",
    "wget": "wget: command not found",
    "curl": "curl: (6) Could not resolve host: example.com",
    "nc": "bash: nc: command not found",
    "ncat": "bash: ncat: command not found",
    "ssh": "ssh: connect to host 192.168.1.1 port 22: Connection refused",
    "find": "/bin/find: No such file or directory",
    "chmod": "chmod: changing permissions of 'file': Operation not permitted",
    "chown": "chown: changing ownership of 'file': Operation not permitted",
    "ps": "  PID TTY          TIME CMD\n    1 ?        00:00:01 init\n  123 ?        00:00:00 bash\n  456 ?        00:00:00 sshd\n",
    "su": "su: Authentication failure",
    "sudo": "sudo: you must have root privileges to run this command",
    "cron": "cron: can't open or create /var/run/crond.pid: Permission denied",
    "awk": "awk: syntax error at source line 1",
    "sed": "sed: -e expression #1, char 2: extra characters after command",
    "history": " 1  ls\n 2  pwd\n 3  exit",
    "echo .* >": "bash: syntax error near unexpected token `>'",
    "&&": "bash: syntax error near unexpected token `&&'",
    ";": "bash: syntax error near unexpected token `;'",
    "|": "bash: syntax error near unexpected token `|'",
}

# UNIX attack patterns
UNIX_ATTACK_PATTERNS = FAKE_RESPONSES.keys()

def detect_unix_attack():
    """
    Middleware to detect UNIX command injection attempts in the URL or payload.
    If found, log the attack and return a fake system response.
    """
    full_url = request.full_path
    request_data = request.args.to_dict() or request.form.to_dict()

    for command, fake_response in FAKE_RESPONSES.items():
        if re.search(rf"\b{re.escape(command)}\b", full_url, re.IGNORECASE) or any(re.search(rf"\b{re.escape(command)}\b", v, re.IGNORECASE) for v in request_data.values()):
            # Log the attack
            log_attack(request, {"detected_unix_command": command})

            # Return the fake response
            return jsonify({"command": command, "output": fake_response}), 200
