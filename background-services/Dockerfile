# SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /usr/mymaven
RUN mkdir src
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
RUN mvn package --offline

FROM eclipse-temurin:21-jre-jammy
WORKDIR /usr/myjava
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar background-services.jar
CMD java -cp background-services.jar nl.esciencecenter.rsd.MainDatabase
