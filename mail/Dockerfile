# SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2024 - 2025 PERFACCT GmbH
# SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
#
# SPDX-License-Identifier: Apache-2.0

FROM python:3.12-slim

WORKDIR /app

RUN \
  addgroup --gid 1000 --system rsd-group && \
  adduser --uid 1000 --ingroup rsd-group --system rsd-user && \
  chown rsd-user:rsd-group /app

USER rsd-user

COPY --chown=rsd-user:rsd-group requirements.txt .
RUN pip install --no-cache-dir --prefix /app/env -r requirements.txt

COPY --chown=rsd-user:rsd-group mailservice/ ./mailservice

ENV PYTHONPATH="$PYTHONPATH:/app/env/lib/python3.12/site-packages"

CMD ["python", "-m", "mailservice"]
