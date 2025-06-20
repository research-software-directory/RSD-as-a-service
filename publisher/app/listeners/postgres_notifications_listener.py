# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import psycopg
import select
import json
import time
import os
import requests
import app.utils as utils
from app.templates.common import render_template
from app.auth import JwtProvider

BASE_URL=os.getenv("POSTGREST_URL")
JWT_PROVIDER = JwtProvider()

def connect_to_postgres():
    for i in range(5):
        try: 
            return psycopg.connect(
                dbname=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD"),
                host=os.getenv("POSTGRES_DB_HOST"),
                port=os.getenv("POSTGRES_DB_HOST_PORT"),
                connect_timeout=10
            )
        except psycopg.OperationalError as e:
            print(f"Connecting attempt {i+1} Publisher to Postgres database failed: {e}")

def listen_to_channel(cursor, channel_name):
    cursor.execute(f"LISTEN {channel_name};")

def process_notifications(connection):
    while True:
        if select.select([connection], [], [], 5) == ([], [], []):
            continue

        for notify in connection.notifies():
            payload = json.loads(notify.payload)
            if notify.channel == "software_for_community_join_request":
                software_name, software_slug = get_software_name(payload["software"])
                recipients, community_name, community_slug = get_maintainer_emails_for_community(payload["community"])
                if community_name:
                    send_community_join_request_mail(recipients, software_name, community_name, utils.create_software_page_url(software_slug), utils.create_community_requests_url(community_slug))


def get_maintainer_emails_for_community(community_id):
    response = requests.post(
        f"{BASE_URL}/rpc/get_maintainer_emails_for_community_id",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        },
        json={
            'community_id': community_id
        }
    )
    return [maintainer['email_address'] for maintainer in response.json()], utils.get_common_value(response.json(), 'name'), utils.get_common_value(response.json(), 'slug')

def get_software_name(software_id):
    response = requests.get(
        f"{BASE_URL}/software?id=eq.{software_id}&select=brand_name, slug",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        }
    )
    return response.json()[0]["brand_name"], response.json()[0]["slug"]

def send_community_join_request_mail(recipients, software_name, community_name, software_page_url, community_settings_url):
    subject = "RSD: Community join request"
    html_content = render_template("community_join_request.html", {"SOFTWARE_NAME": software_name, "COMMUNITY_NAME": community_name, "SOFTWARE_PAGE_URL": software_page_url, "COMMUNITY_REQUESTS_URL": community_settings_url, "RSD_URL": os.getenv("HOST_URL")})
    body = dict(
        subject=subject,
        recipients=recipients,
        html_content=html_content,
        plain_content=None
    )
    utils.publish_to_queue(os.environ.get("MAIL_QUEUE", "mailq"), body)

if __name__ == "__main__":
    connection = connect_to_postgres()
    connection.autocommit = True

    cursor = connection.cursor()

    # listen for community join requests
    listen_to_channel(cursor, "software_for_community_join_request")
    process_notifications(connection)

