# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import json

import pika 

def publish_to_queue(queue, body):
    conn = pika.BlockingConnection(pika.ConnectionParameters("rabbitmq"))
    channel = conn.channel()
    channel.queue_declare(
        queue=queue,
        durable=True,
        arguments={
            "x-queue-type": "quorum",
            "x-delivery-limit": 3,
        },
    )
    channel.confirm_delivery()
    channel.basic_publish(
        exchange="", routing_key=queue, body=json.dumps(body)
    )
    conn.close()