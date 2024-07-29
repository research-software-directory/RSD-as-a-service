# SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.9.8-eclipse-temurin-21
WORKDIR /usr/mymaven
RUN mkdir src
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src ./src
CMD mvn test --offline
