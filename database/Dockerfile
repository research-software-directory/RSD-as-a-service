# SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM postgres:15.12
RUN apt-get update && apt-get --yes install cron nano
COPY --chmod=644 jobs.cron /etc/cron.d/jobs.cron
RUN crontab /etc/cron.d/jobs.cron
RUN chmod a+rwx /docker-entrypoint-initdb.d
COPY --chown=postgres:postgres *.sh /docker-entrypoint-initdb.d/
COPY --chown=postgres:postgres *.sql /docker-entrypoint-initdb.d/
RUN mv /docker-entrypoint-initdb.d/entrypoint-rsd.sh /entrypoint-rsd.sh
RUN chmod 777 /entrypoint-rsd.sh
ENTRYPOINT ["/entrypoint-rsd.sh"]
