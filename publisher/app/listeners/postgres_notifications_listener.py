# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import psycopg
import select
import json
import os
import app.utils as utils
from app.auth import JwtProvider
from channels.software_for_community_join_request import SoftwareCommunityJoinRequestHandler
from channels.access_token_deleted import AccessTokenDeletedHandler
from channels.access_token_expiring import AccessTokenExpiringHandler

BASE_URL=os.getenv("POSTGREST_URL")
JWT_PROVIDER = JwtProvider()

CHANNEL_HANDLERS = [
    SoftwareCommunityJoinRequestHandler(),
    AccessTokenDeletedHandler(),
    AccessTokenExpiringHandler()
]

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

def listen_to_channels(conn, channel_handlers):
    cursor = conn.cursor()
    for handler in channel_handlers:
        cursor.execute(f"LISTEN {handler.name};")

    print("Listening to channels...")
    while True:
        try: 
            if select.select([conn], [], [], 5) == ([], [], []):
                continue
            for notify in conn.notifies():
                process_notifications(channel_handlers, notify.channel, json.loads(notify.payload))
        except (Exception, psycopg.DatabaseError) as error:
            utils.log_to_backend(
                service_name="Postgres Notification Listener",
                table_name="",
                message=f"Exception while listening to Postgres: {error}",
            )
            print(error)
            break


def process_notifications(handlers, channel_name, payload):
    for handler in handlers:
        if handler.name == channel_name:
            preprocessed = handler.preprocess(payload)
            handler.process(preprocessed)
            break


if __name__ == "__main__":
    connection = connect_to_postgres()
    connection.autocommit = True
    listen_to_channels(connection, CHANNEL_HANDLERS)
