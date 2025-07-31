# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os
import datetime

import jwt
from dotenv import load_dotenv

JWT_SECRET = os.getenv("PGRST_JWT_SECRET")

class JwtProvider:
    def __init__(self):
        load_dotenv()

    def get_admin_jwt(self):
        return jwt.encode(
            {
                "role": "rsd_admin",
                "exp": datetime.datetime.now()
                + datetime.timedelta(minutes=10),
            },
            JWT_SECRET,
            algorithm="HS256",
        )