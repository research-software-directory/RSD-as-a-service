# SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /usr/mymaven
RUN mkdir ./src
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn package --offline

FROM eclipse-temurin:21-jre-jammy
WORKDIR /usr/myjava
RUN apt-get update && apt-get --yes install cron nano
COPY jobs.cron /etc/cron.d/jobs.cron
RUN crontab /etc/cron.d/jobs.cron
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar scrapers.jar
CMD printenv > /etc/environment && cron -f
