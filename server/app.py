from flask import Flask

import ocr

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr")
def ocr():
    return ocr.ocr_service()


if __name__ == '__main__':
    app.run(debug=True, port=8081)
