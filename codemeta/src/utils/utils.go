// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package utils

import (
	"errors"
	"io"
	"log"
	"net/http"
	"time"
)

func GetAndReadBody(url string) (body []byte, err error) {
	client := http.Client{
		Timeout: 60 * time.Second,
	}
	resp, err := client.Get(url)
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

func ReadBody(resp *http.Response) (body []byte, err error) {
	defer func(Body io.ReadCloser) {
		closeErr := Body.Close()
		if closeErr != nil {
			log.Printf("Unknown error when closing response body with error: %v", closeErr)
			err = errors.Join(closeErr, err)
		}
	}(resp.Body)

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, err
}
