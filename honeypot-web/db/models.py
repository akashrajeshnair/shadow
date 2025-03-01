from db.db import db

# Corrected MongoDB Schema using BSON Types
attack_log_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "ip": {"bsonType": "string", "description": "Attacker's IP address"},
            "user_agent": {"bsonType": "string", "description": "Browser/User Agent"},
            "endpoint": {"bsonType": "string", "description": "Targeted endpoint"},
            "method": {"bsonType": "string", "description": "HTTP Method (GET, POST, etc.)"},
            "headers": {"bsonType": "object", "description": "Request headers"},
            "payload": {"bsonType": "object", "description": "Data sent in request"},
            "timestamp": {"bsonType": "string", "description": "Time of attack (ISO format)"}
        }
    }
}

fake_user_schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "properties": {
            "username": {"bsonType": "string", "description": "Fake username"},
            "password": {"bsonType": "string", "description": "Fake password"},
            "ip": {"bsonType": "string", "description": "Attacker's IP"},
            "timestamp": {"bsonType": "string", "description": "Time of login attempt"}
        }
    }
}

# Ensure collections exist before applying schema validation
if "attack_logs" not in db.list_collection_names():
    db.create_collection("attack_logs")

if "fake_users" not in db.list_collection_names():
    db.create_collection("fake_users")

# Apply schema validation (collMod only works if the collection exists)
db.command("collMod", "attack_logs", validator=attack_log_schema)
db.command("collMod", "fake_users", validator=fake_user_schema)

# Collection references
attack_logs = db.attack_logs
fake_users = db.fake_users
