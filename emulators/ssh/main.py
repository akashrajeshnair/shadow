import threading
from ssh_server import start_honeypot
from api import start_api

if __name__ == "__main__":
    threading.Thread(target=start_honeypot, daemon=True).start()
    start_api()
