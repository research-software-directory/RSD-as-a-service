// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"time"
)

func getAdminJwt(secret string) string {
	header := struct {
		Alg string `json:"alg"`
		Typ string `json:"typ"`
	}{
		Alg: "HS256",
		Typ: "JWT",
	}

	headerBytes, _ := json.Marshal(&header)

	headerString := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(headerBytes)

	body := struct {
		Role string `json:"role"`
		Exp  int64  `json:"exp"`
	}{
		Role: "rsd_admin",
		Exp:  time.Now().Add(time.Hour).Unix(),
	}

	bodyBytes, _ := json.Marshal(&body)

	bodyString := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(bodyBytes)

	toSign := headerString + "." + bodyString

	signer := hmac.New(sha256.New, []byte(secret))

	signer.Write([]byte(toSign))

	signedBytes := signer.Sum(nil)

	signedString := base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(signedBytes)

	return headerString + "." + bodyString + "." + signedString
}
