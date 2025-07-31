# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os
import json
import pika 
import requests

from app.auth import JwtProvider

HOST_URL = os.getenv("HOST_URL")
BASE_URL=os.getenv("POSTGREST_URL")
JWT_PROVIDER = JwtProvider()

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


def get_common_value(dicts, key):
    values = {d[key] for d in dicts if key in d}
    return values.pop() if len(values) == 1 else None

def create_software_page_url(slug):
    return f"{HOST_URL}/software/{slug}"

def create_community_requests_url(slug):
    return f"{HOST_URL}/communities/{slug}/requests"

def log_to_backend(service_name, table_name, message, reference_id=None, stack_trace="", other_data=None):
    response = requests.post(
        f"{BASE_URL}/backend_log",
        json={
            "service_name": service_name,
            "table_name": table_name,
            "reference_id": reference_id,
            "message": message,
            "stack_trace": stack_trace,
            "other_data": other_data,
        },
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}"
        },
        timeout=15,
    )
    return response
