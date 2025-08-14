# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os

from app.templates.common import render_template
from .base import ChannelHandler
from app.services.postgrest_helpers import get_software_name, get_maintainer_emails_for_community, get_community_info
from app import utils

class SoftwareCommunityJoinRequestHandler(ChannelHandler):
    def __init__(self):
        super().__init__("software_for_community_join_request")

    def preprocess(self, payload):
        software_name, software_slug = get_software_name(payload["software"])
        recipients = get_maintainer_emails_for_community(payload["community"])
        community_name, community_slug = get_community_info(payload["community"])
        software_page_url = utils.create_software_page_url(software_slug)
        community_settings_url = utils.create_community_requests_url(community_slug)
        return dict(
            subject=f"RSD: Community join request for {community_name}",
            recipients=recipients,
            html_content=render_template("community_join_request.html", {"SOFTWARE_NAME": software_name, "COMMUNITY_NAME": community_name, "SOFTWARE_PAGE_URL": software_page_url, "COMMUNITY_REQUESTS_URL": community_settings_url, "RSD_URL": os.getenv("HOST_URL")}),
            plain_content=None
        )
