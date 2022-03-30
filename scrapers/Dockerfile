FROM maven:3.8.4-openjdk-17 AS builder
WORKDIR /usr/mymaven
RUN mkdir --parents ./src/main
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src/main ./src/main
RUN mvn package --offline

FROM openjdk:17.0.2-jdk-slim-bullseye
WORKDIR /usr/myjava
RUN apt-get update && apt-get --yes install cron python pip nano
COPY --from=builder /usr/mymaven/src/main/resources/requirements.txt requirements.txt
RUN pip install --requirement requirements.txt
COPY jobs.cron /etc/cron.d/jobs.cron
RUN crontab /etc/cron.d/jobs.cron
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar scrapers.jar
COPY --from=builder /usr/mymaven/src/main/resources/releases.py releases.py
COPY --from=builder /usr/mymaven/src/main/resources/zotero.py zotero.py
CMD printenv > /etc/environment && cron -f
