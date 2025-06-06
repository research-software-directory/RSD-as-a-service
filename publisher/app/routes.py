# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

from flask import Blueprint

from app.services import mail

# Mail Service
mail_api = Blueprint("mail_api", __name__)
mail_api.add_url_rule("/send", view_func=mail.send_mail, methods=["POST"])