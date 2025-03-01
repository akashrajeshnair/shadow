from flask import Blueprint

# Define blueprints for fake pages
auth_bp = Blueprint('auth', __name__)
admin_bp = Blueprint('admin', __name__)
api_bp = Blueprint('api', __name__)
search_bp = Blueprint('search', __name__)
upload_bp = Blueprint('upload', __name__)

from routes.auth import *
from routes.admin import *
from routes.api import *
from routes.search import *
from routes.upload import *