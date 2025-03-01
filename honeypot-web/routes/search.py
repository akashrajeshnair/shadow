from flask import render_template, request
from routes.routes import search_bp
from utils.logger import log_attack

@search_bp.route("/", methods=["GET"])
def fake_search():
    query = request.args.get("q")
    if query:
        log_attack(request, {"search_query": query})
    return render_template("search.html", query=query)
