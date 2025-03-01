from app import app
import logging

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        filename="logs/server.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
    )

    logging.info("Starting Honeypot Web Server...")
    print("🚀 Honeypot Web Server is running at http://127.0.0.1:5000")

    # Run the Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
