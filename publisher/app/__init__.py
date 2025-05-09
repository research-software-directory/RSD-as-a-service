# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

from datetime import datetime
import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.routes import mail_api

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    print("---Flask App created")

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["JWT_SECRET_KEY"] = os.getenv("PUBLISHER_JWT_SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 900 #15 minutes
    app.config["JWT_ALGORITHM"] = 'HS256'

    jwt.init_app(app)

    CORS(app)

    app.register_blueprint(mail_api, url_prefix="/mail")

    return app