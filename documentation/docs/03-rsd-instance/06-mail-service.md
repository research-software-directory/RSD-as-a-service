<!--
SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>

SPDX-License-Identifier: CC-BY-4.0
-->

# Mail Service

The RSD provides a mail service functionality.

:::info
While the mail service is already implemented, use cases where the service is used are still under development. 

The basic implementation of the mail service (publisher, queue and consumer) allows for custom use cases to be implemented (as further mentioned below).

:::

## Mail Service Configuration

### Environment Variables
To set up the mail service functionality, the following environment variables are required:

```shell
MAIL_SMTP_SERVER= # value without https://, e.g. "smtp.server.org"
MAIL_SMTP_PORT= # string value of the port number e.g. "587"
MAIL_SMTP_SECURITY= # value = "SSL" or "STARTTLS"
MAIL_SMTP_LOGIN= # the email address used for login to the SMTP server, e.g. "user@domain.org"
MAIL_SMTP_PASSWORD= # the password used for authentication to the SMTP server
MAIL_FROM_ADDRESS= # the email address that should send the emails from the mail service, e.g. "rsd@domain.org"
MAIL_REPLY_TO= # optional, an email address that should be set for reply-to

MAIL_QUEUE= # optional, name of the rabbitmq channel used for the mail service, default value: mailq 

PUBLISHER_JWT_SECRET_KEY=
```
### Using the mail service

The publisher endpoint for the mail service is `publisher:5000/mail/send` which expects a POST request with the following data: 

```
'{
    "subject": "{SUBJECT}", 
    "recipients": ["{RECIPIENT_MAIL}"], 
    "plain_content": "{CONTENT}",
    "html_content": "{HTML_CONTENT}"
}'
```

The placeholders in `{}` are to be replaced with corresponding values. One of the content types can be left out.

Making a request to this endpoint requires a JWT token using the environment variable `PUBLISHER_JWT_SECRET_KEY` and a payload with a `sub` and `exp` value.

## Other queue-based services

The mail service implementation consists of a publisher service (Python-based), a queue (rabbitmq) and a mail consumer service (Python). The publisher and queue services are structured so that they can be used by other queue-based services.

Publisher services for other use cases can be added at `/publisher/app/services` similar to the implementation of the mail services at `/publisher/app/services/mail.py`.