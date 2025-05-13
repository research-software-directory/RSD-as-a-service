# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os

from flask import request, jsonify
from flask_jwt_extended import jwt_required

from app.utils import publish_to_queue

MAIL_QUEUE = os.environ.get("MAIL_QUEUE", "mailq")

@jwt_required()
def send_mail():
    data = request.get_json()
    body = dict(
        subject=data.get("subject"),
        recipients=data.get("recipients"),
        html_content=data.get("html_content"),
        plain_content=data.get("plain_content"),
    )
    publish_to_queue(MAIL_QUEUE, body)

    return "200"

