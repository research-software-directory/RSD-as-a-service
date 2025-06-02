<!--
SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>

SPDX-License-Identifier: CC-BY-4.0
-->

# Publisher

This module provides a publisher service for the `rabbitmq` queue. It is written in Python using Flask.

## Mail Service 

This module currently provides one endpoint for the mail service at `publisher:5000/mail/send` which expects a POST request with the following data: 

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