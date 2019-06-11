from flask import Flask, request, jsonify
from nameparser import HumanName

app = Flask(__name__)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    name = request.args.get('name')

    parsedName = HumanName(name)

    return jsonify(parsedName.as_dict())
