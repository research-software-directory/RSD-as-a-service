# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os
import requests
from app.auth import JwtProvider

BASE_URL=os.getenv("POSTGREST_URL")
JWT_PROVIDER = JwtProvider()

def get_maintainer_emails_for_community(community_id):
    response = requests.post(
        f"{BASE_URL}/rpc/maintainers_of_community",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        },
        json={
            'community_id': community_id
        }
    )
    return [maintainer['email'][0] for maintainer in response.json()]

def get_community_info(community_id):
    response = requests.get(
        f"{BASE_URL}/community?id=eq.{community_id}&select=name,slug",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        }
    )
    return response.json()[0]["name"], response.json()[0]["slug"]

def get_software_name(software_id):
    response = requests.get(
        f"{BASE_URL}/software?id=eq.{software_id}&select=brand_name, slug",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        }
    )
    return response.json()[0]["brand_name"], response.json()[0]["slug"]

def get_mail_for_account(account_id):
    response = requests.get(
        f"{BASE_URL}/user_profile?account=eq.{account_id}&select=email_address",
        headers={
            "Authorization": f"Bearer {JWT_PROVIDER.get_admin_jwt()}",
            "Content-Type": "application/json",
        }
    )
    return response.json()[0]["email_address"]
