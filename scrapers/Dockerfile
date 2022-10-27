# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.8.6-openjdk-18 AS builder
WORKDIR /usr/mymaven
RUN mkdir ./src
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn package --offline

FROM openjdk:18.0.1.1-jdk-slim-bullseye
WORKDIR /usr/myjava
RUN apt-get update && apt-get --yes install cron python pip nano
COPY --from=builder /usr/mymaven/src/main/resources/requirements.txt requirements.txt
RUN pip install --requirement requirements.txt
COPY jobs.cron /etc/cron.d/jobs.cron
RUN crontab /etc/cron.d/jobs.cron
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar scrapers.jar
COPY --from=builder /usr/mymaven/src/main/resources/releases.py releases.py
COPY --from=builder /usr/mymaven/src/main/resources/zotero.py zotero.py
COPY --from=builder /usr/mymaven/src/main/resources/oaipmh.py oaipmh.py
CMD printenv > /etc/environment && cron -f
