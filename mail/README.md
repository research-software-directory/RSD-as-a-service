<!--
SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>

SPDX-License-Identifier: CC-BY-4.0
-->

# Mail

This Python module provides a mail service that processes messages from `rabbitmq` in channel `mailq` (or whatever name provided via the environment variable `MAIL_QUEUE`).

## Environment variables
The following environment variables are necessary:

- `MAIL_SMTP_SERVER` (value without `https://`)
- `MAIL_SMTP_PORT` (string value of the port number e.g. "587")
- `MAIL_SMTP_SECURITY` (value = "SSL" or "STARTTLS")
- `MAIL_SMTP_LOGIN` (the email address used for login to the SMTP server, e.g. "user@domain.org")
- `MAIL_SMTP_PASSWORD` (the password used for authentication to the SMTP server)
- `MAIL_FROM_ADDRESS` (the email address that should send the emails from the mail service, e.g. "rsd@domain.org")
- `MAIL_REPLY_TO` (optional, an email address that should be set for reply-to)