import socket

from flask import Flask

from ocr import ocr_service

app = Flask(__name__)


def get_free_port():
    sock = socket.socket()
    sock.bind(('', 0))
    ip, sock_port = sock.getsockname()
    sock.close()
    return sock_port


port = get_free_port()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/ocr")
def ocr():
    res = ocr_service()
    return res


if __name__ == '__main__':
    app.run(debug=True, port=port)
    print('flask start at port:', port)
