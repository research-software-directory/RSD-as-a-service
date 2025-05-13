#!/bin/bash

# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

python -m gunicorn -b 0.0.0.0:5000 "app:create_app()" --log-level debug --access-logfile -