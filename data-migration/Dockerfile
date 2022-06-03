# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
#
# SPDX-License-Identifier: Apache-2.0

FROM maven:3.8.4-openjdk-17
WORKDIR /usr/mymaven
RUN mkdir --parents ./src/main
COPY data-migration/pom.xml .
RUN mvn clean package -Dmaven.main.skip -Dmaven.test.skip && rm -r ./target && mvn exec:java --fail-never
COPY data-migration/src/main ./src/main
RUN mvn compile
CMD mvn exec:java
