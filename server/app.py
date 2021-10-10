from flask import Flask

from ocr import ocr_service

app = Flask(__name__)
port = 8081


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr")
def ocr():
    res = ocr_service()
    return res


if __name__ == '__main__':
    app.run(debug=True, port=8081)
    print('flask start at port:', port)
