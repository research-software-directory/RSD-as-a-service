<!--
SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>

SPDX-License-Identifier: CC-BY-4.0
-->

# Mail

This Python module provides a mail service that processes messages from `rabbitmq` in channel `mailq` (or whatever name provided via the environment variable `MAIL_QUEUE`).

## Environment variables
The following environment variables are necessary:

- `MAIL_SMTP_SERVER`
- `MAIL_SMTP_PORT`
- `MAIL_SMTP_SECURITY` (value = "SSL" or "STARTTLS")
- `MAIL_SMTP_LOGIN`
- `MAIL_SMTP_PASSWORD`
- `MAIL_FROM_ADDRESS`
- `MAIL_REPLY_TO`