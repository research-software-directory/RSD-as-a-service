# SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import logging

logging.basicConfig()
logging.getLogger("mailservice").setLevel(logging.DEBUG)


def get_logger(name: str):
    return logging.getLogger(name)
