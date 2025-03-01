import logging
#from config import LOG_FILE

# logging.basicConfig(
#     filename=LOG_FILE,
#     level=logging.INFO,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")

def log_event(event):
    logging.info(event)
