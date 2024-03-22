# SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2024 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM golang:1.22.1-bookworm AS builder

WORKDIR /usr/src/app
COPY go.mod .
COPY **.go .
COPY template template

RUN go build -v -o /usr/local/bin/app


FROM ubuntu:22.04

COPY --from=builder /usr/local/bin/app /usr/local/bin/app

RUN useradd user
USER user

CMD ["app"]
