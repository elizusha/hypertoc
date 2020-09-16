#!/usr/bin/env python3

from flask import Flask
app = Flask(__name__, static_url_path='')

@app.route('/')
def root():
    return app.send_static_file("index.html")