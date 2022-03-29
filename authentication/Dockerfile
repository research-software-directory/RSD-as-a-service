FROM maven:3.8.4-openjdk-17 AS builder
WORKDIR /usr/mymaven
RUN mkdir --parents ./src/main
COPY pom.xml .
RUN mvn dependency:go-offline
COPY ./src/main ./src/main
RUN mvn package --offline

FROM openjdk:17.0.2-jdk-slim-bullseye
WORKDIR /usr/myjava
COPY --from=builder /usr/mymaven/target/*-jar-with-dependencies.jar auth.jar
CMD java -cp auth.jar nl.esciencecenter.rsd.authentication.Main
