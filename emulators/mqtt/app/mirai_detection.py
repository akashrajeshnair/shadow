import re

# Known Mirai botnet commands and patterns
MIRAI_PATTERNS = [
    re.compile(r"wget http://.*\.bin"),
    re.compile(r"tftp -g -r .*\.bin"),
    re.compile(r"busybox MIRAI"),
    re.compile(r"/bin/busybox MIRAI"),
    re.compile(r"echo -e .* > /dev/watchdog"),
]

def is_mirai_command(command):
    """Check if the given command matches any known Mirai patterns."""
    for pattern in MIRAI_PATTERNS:
        if pattern.search(command):
            return True
    return False