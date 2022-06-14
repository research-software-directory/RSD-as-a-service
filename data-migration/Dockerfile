# SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
# SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 dv4all
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.8.5-openjdk-18
WORKDIR /usr/mymaven
RUN mkdir --parents ./src/main
COPY data-migration/pom.xml .
RUN mvn clean package -Dmaven.main.skip -Dmaven.test.skip && rm -r ./target && mvn exec:java --fail-never
COPY data-migration/src/main ./src/main
RUN mvn compile
CMD mvn exec:java
