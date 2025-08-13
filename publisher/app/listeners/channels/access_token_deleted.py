# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os

from app.templates.common import render_template
from .base import ChannelHandler
from app.services.postgrest_helpers import get_mail_for_account
from app import utils

class AccessTokenDeletedHandler(ChannelHandler):
    def __init__(self):
        super().__init__("access_token_deleted_now")

    def preprocess(self, payload):
        recipient = get_mail_for_account(payload["account"])
        return dict(
            subject="RSD: Your API access token expired",
            recipients=[recipient],
            html_content=render_template("access_token_expired_now.html", {"DISPLAY_NAME": payload["display_name"]}),
            plain_content=None
        )
