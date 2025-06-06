# SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import json
import os
from typing import List

import pika
from pydantic import BaseModel, EmailStr

from mailservice.logging import get_logger
from mailservice.mail import send_mail

logger = get_logger(__name__)


MAIL_QUEUE = os.environ.get("MAIL_QUEUE", "mailq")


class MailData(BaseModel):
    subject: str
    recipients: List[EmailStr]
    html_content: str | None
    plain_content: str | None


def handle_mail(channel, method, _properties, body: bytes):
    mail_data = MailData.model_validate(json.loads(body.decode()))
    logger.info("Got mail: %s", mail_data)
    try:
        send_mail(
            subject=mail_data.subject,
            recipients=mail_data.recipients,
            html_content=mail_data.html_content,
            plain_content=mail_data.plain_content,
        )
        channel.basic_ack(method.delivery_tag)
        logger.info("Mail successfully forwarded to SMTP server.")
    except Exception:
        channel.basic_nack(method.delivery_tag)
        logger.error("Failed to forward mail to SMTP server.")


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
