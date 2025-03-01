from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.honeypot_ssh
logs_collection = db.ssh_logs

def log_ssh_attempt(ip, username, password):
    logs_collection.insert_one({"ip": ip, "username": username, "password": password})

def log_command(ip, command):
    logs_collection.insert_one({"ip": ip, "command": command})
