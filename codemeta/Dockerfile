# SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM golang:1.22.5-bookworm AS builder

WORKDIR /usr/src/app
COPY src .

RUN go build -v -o /usr/local/bin/app
RUN go build -v -o /usr/local/bin/scraper-4tu codemeta/scrapers


FROM ubuntu:22.04

# ca-certificates is needed for HTTPS requests to the 4TU API to work
RUN apt-get update && apt-get install --yes ca-certificates cron nano

COPY --from=builder /usr/local/bin/app /usr/local/bin/app
COPY --from=builder /usr/local/bin/scraper-4tu /usr/local/bin/scraper-4tu
COPY --chmod=555 ./codemeta.sh /usr/local/bin/codemeta.sh

COPY --chmod=644 jobs.cron /etc/cron.d/jobs.cron
RUN crontab /etc/cron.d/jobs.cron

CMD /usr/local/bin/codemeta.sh
