# SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import json
import os
from typing import List

import pika
from pydantic import BaseModel, EmailStr, ValidationError

from mailservice.logging import get_logger
from mailservice.mail import send_mail

logger = get_logger(__name__)


MAIL_QUEUE = os.environ.get("MAIL_QUEUE", "mailq")


class MailData(BaseModel):
    subject: str
    recipients: List[EmailStr]
    html_content: str | None
    plain_content: str | None

def validate_and_get_mail_data(input_data):
    max_attempts = 3
    attempt = 0
    while attempt < max_attempts:
        try: 
            mail_data = MailData.model_validate(input_data)
            logger.info(f"Mail data validated for recipients={mail_data.recipients} (subject: {mail_data.subject})")
            return mail_data
        except ValidationError as e:
            logger.error(f"Mail Validation Error: {e}")
            emails = input_data["recipients"]
            errors = e.errors()
            error_inputs = [error['input'] for error in errors]
            valid_emails = [email for email in emails if email not in error_inputs]
            input_data["recipients"] = valid_emails
            attempt += 1
            logger.info(f"Attempt {attempt}: Invalid emails removed, retrying validation...")
    raise ValueError("Maximum validation attempts reached. Some emails are still invalid.")


def handle_mail(channel, method, _properties, body: bytes):
    json_data = json.loads(body.decode())
    mail_data = validate_and_get_mail_data(json_data)
    try:
        if mail_data.recipients:
            send_mail(
                subject=mail_data.subject,
                recipients=mail_data.recipients,
                html_content=mail_data.html_content,
                plain_content=mail_data.plain_content,
            )
            channel.basic_ack(method.delivery_tag)
            logger.info("Mail successfully forwarded to SMTP server.")
        else:
            logger.error(f"No valid recipients for mail: {json_data["subject"]} - not sending")
    except Exception as e:
        channel.basic_nack(method.delivery_tag)
        logger.error(f"Failed to forward mail ({json_data["subject"]}) to SMTP server: {e}")


def start_service():
    conn = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = conn.channel()
    channel.queue_declare(
        queue=MAIL_QUEUE,
        durable=True,
        arguments={
            "x-queue-type": "quorum",
            "x-delivery-limit": 3,
        },
    )
    channel.basic_consume(
        queue=MAIL_QUEUE, auto_ack=False, on_message_callback=handle_mail
    )
    logger.info(f"Waiting for messages on queue '{MAIL_QUEUE}'.")
    channel.start_consuming()
