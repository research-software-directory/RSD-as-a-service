// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"errors"
	"io"
	"log"
	"net/http"
)

func GetAndReadBody(url string) (body []byte, err error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer func(Body io.ReadCloser) {
		closeErr := Body.Close()
		if closeErr != nil {
			log.Printf("Unknown error when closing response body for URL %v overview with error: %v", url, closeErr)
			err = errors.Join(closeErr, err)
		}
	}(resp.Body)

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, err
}
