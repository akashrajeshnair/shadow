import socket
import threading
import paramiko
from config import HONEYPOT_PORT
from logger import log_info, log_error
from database import log_ssh_attempt

HOST_KEY = paramiko.RSAKey.generate(2048)

class SSHHoneypot(paramiko.ServerInterface):
    def __init__(self, client_address):
        self.event = threading.Event()
        self.client_address = client_address

    def check_auth_password(self, username, password):
        log_info(f"SSH Attempt: {self.client_address[0]} → {username}/{password}")
        log_ssh_attempt(self.client_address[0], username, password)
        return paramiko.AUTH_SUCCESSFUL

def start_honeypot():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(("0.0.0.0", HONEYPOT_PORT))
    server_socket.listen(10)

    log_info(f"SSH Honeypot Running on Port {HONEYPOT_PORT}")

    while True:
        client, addr = server_socket.accept()
        log_info(f"New SSH connection from {addr[0]}")

        transport = paramiko.Transport(client)
        transport.add_server_key(HOST_KEY)
        server = SSHHoneypot(addr)

        try:
            transport.start_server(server=server)
            transport.accept(20)  # Accept a channel
        except Exception as e:
            log_error(f"Error handling SSH: {e}")
        finally:
            transport.close()
            client.close()
