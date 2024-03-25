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

# needed for HTTPS requests to the 4TU API to work
RUN apt-get update && apt-get install -y ca-certificates

COPY --from=builder /usr/local/bin/app /usr/local/bin/app
COPY --from=builder /usr/local/bin/scraper-4tu /usr/local/bin/scraper-4tu

RUN useradd user
USER user

CMD ["app"]
