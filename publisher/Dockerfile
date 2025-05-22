# SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

FROM python:3.12-slim

WORKDIR /

COPY . .
RUN python3 -m pip install --no-cache-dir -r requirements.txt && \
    chmod +x run.sh

EXPOSE 5013

CMD ["/run.sh"]