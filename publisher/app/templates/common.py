# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

import os
from pathlib import Path
from importlib import resources

from jinja2 import BaseLoader, Environment

def render_template(tmpl: str, data: dict):
    tmpl_file = Path(os.path.dirname(__file__)) / tmpl
    with tmpl_file.open("r", encoding="utf-8") as f:
        tmpl_content = f.read()
    return (
        Environment(loader=BaseLoader())
        .from_string(tmpl_content)
        .render(**data)
    )