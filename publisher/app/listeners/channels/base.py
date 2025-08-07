# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os
from app import utils

class ChannelHandler:
    def __init__(self, name):
        self.name = name

    def preprocess(self, payload):
        """Must override and return mail body dict"""
        raise NotImplementedError("Process method must be implemented.")

    def process(self, mail_body):
        return utils.publish_to_queue(os.environ.get("MAIL_QUEUE", "mailq"), mail_body)
