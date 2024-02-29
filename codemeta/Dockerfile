# SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2024 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM golang:1.22.0-bullseye

WORKDIR /usr/src/app
COPY go.mod .
COPY **.go .

RUN go build -v -o /usr/local/bin/app

COPY **.gohtml .

RUN useradd user
USER user

CMD ["app"]
