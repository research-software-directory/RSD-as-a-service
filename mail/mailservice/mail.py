# SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: EUPL-1.2

import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate

from mailservice.logging import get_logger

logger = get_logger(__name__)


MAIL_SMTP_SERVER = os.environ.get("MAIL_SMTP_SERVER")
MAIL_SMTP_PORT = os.environ.get("MAIL_SMTP_PORT")
MAIL_SMTP_SECURITY = os.environ.get("MAIL_SMTP_SECURITY")
MAIL_SMTP_LOGIN = os.environ.get("MAIL_SMTP_LOGIN")
MAIL_SMTP_PASSWORD = os.environ.get("MAIL_SMTP_PASSWORD")
MAIL_FROM_ADDRESS = os.environ.get("MAIL_FROM_ADDRESS")
MAIL_REPLY_TO = os.environ.get("MAIL_REPLY_TO")

assert MAIL_SMTP_SERVER is not None
assert MAIL_SMTP_PORT is not None
assert MAIL_SMTP_SECURITY in ("SSL", "STARTTLS")
assert MAIL_SMTP_LOGIN is not None
assert MAIL_SMTP_PASSWORD is not None
assert MAIL_FROM_ADDRESS is not None
assert MAIL_REPLY_TO is not None


def send_mail(
    *,
    subject,
    from_address=MAIL_FROM_ADDRESS,
    recipients,
    reply_address=MAIL_REPLY_TO,
    html_content=None,
    plain_content=None,
):
    if html_content and plain_content:
        msg = MIMEMultipart("alternative")
        msg.attach(MIMEText(html_content, "html"))
        msg.attach(MIMEText(plain_content, "plain"))
    elif html_content:
        msg = MIMEText(html_content, "html")
    elif plain_content:
        msg = MIMEText(plain_content, "plain")
    else:
        return False

    msg["Subject"] = subject
    msg["From"] = from_address
    msg["To"] = ", ".join(recipients)
    msg["Date"] = formatdate(localtime=True)
    msg["reply-to"] = reply_address

    try:
        if MAIL_SMTP_SECURITY == "STARTTLS":
            with smtplib.SMTP(MAIL_SMTP_SERVER, MAIL_SMTP_PORT) as smtp:
                context = ssl.create_default_context()
                smtp.starttls(context=context)
                smtp.login(MAIL_SMTP_LOGIN, MAIL_SMTP_PASSWORD)
                smtp.sendmail(MAIL_SMTP_LOGIN, recipients, msg.as_string())
        elif MAIL_SMTP_SECURITY == "SSL":
            with smtplib.SMTP_SSL(MAIL_SMTP_SERVER, MAIL_SMTP_PORT) as smtp:
                smtp.login(MAIL_SMTP_LOGIN, MAIL_SMTP_PASSWORD)
                smtp.sendmail(MAIL_SMTP_LOGIN, recipients, msg.as_string())
        else:
            raise ValueError(
                "Invalid security setting: %s.", MAIL_SMTP_SECURITY
            )
    except Exception as ex:
        logger.error("Failed to send mail: %s", ex)
        raise ex
