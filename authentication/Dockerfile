# SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
# SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 dv4all
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.9.10-eclipse-temurin-21 AS builder
WORKDIR /usr/mymaven
RUN mkdir src
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn package --offline

FROM eclipse-temurin:21.0.7_6-jre-noble
WORKDIR /usr/myjava
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar auth.jar
CMD java -cp auth.jar nl.esciencecenter.rsd.authentication.Main
