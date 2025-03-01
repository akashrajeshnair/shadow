from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
logs_collection = db.logs
devices_collection = db.devices
firewall_collection = db.firewall
